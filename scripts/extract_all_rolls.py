import asyncio
import glob
import hashlib
import json
import os
import re
import time
import uuid
import pandas as pd
import pypdfium2 as pdfium
import winocr
from PIL import ImageEnhance, ImageOps

DATASET_DIR = "Dataset"
OUTPUT_DIR = "data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# Cleaners & Normalizers
# -----------------------------------------------------------------------------
def clean_text(s):
    if not s:
        return ""
    # Remove control characters and normalize spaces
    s = re.sub(r'[\r\n\t]+', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def clean_name(s):
    if not s:
        return ""
    # Strip non-alphanumeric except spaces
    s = clean_text(s)
    # Remove OCR noise symbols like | _ ~ `
    s = re.sub(r'[\'"`~_|=]+', '', s)
    return s.strip()

def normalize_epic(raw):
    if not raw:
        return None
    raw = clean_text(raw).upper().replace(' ', '')
    m = re.search(r'([A-Z0-9]{3}[0-9]{7})', raw)
    if m:
        code = m.group(1)
        # First 3 should be letters: 0 -> O, 1 -> I
        prefix = code[:3].replace('0', 'O').replace('1', 'I')
        return prefix + code[3:]
    m2 = re.search(r'([A-Z]{2,4}[0-9]{6,8})', raw)
    if m2:
        return m2.group(1)
    return raw[:15]

# -----------------------------------------------------------------------------
# Card Parser
# -----------------------------------------------------------------------------
def parse_card_lines(lines, default_section=1):
    text = '\n'.join(lines)
    
    # 1. Serial Number
    serial_no = None
    m_s = re.search(r'^\s*(\d{1,4})\b', text, re.MULTILINE)
    if m_s:
        serial_no = int(m_s.group(1))
        
    # 2. EPIC Number
    epic_no = None
    m_e = re.search(r'\b([A-Z0-9]{3}[0-9]{7})\b', text)
    if m_e:
        epic_no = normalize_epic(m_e.group(1))
    else:
        m_e2 = re.search(r'\b([A-Z]{2,4}\s*[0-9]{6,8})\b', text)
        if m_e2:
            epic_no = normalize_epic(m_e2.group(1))
            
    # 3. Name
    name = None
    m_n = re.search(r'Name\s*[:\s-]\s*([^\n\r]+)', text, re.IGNORECASE)
    if m_n:
        raw_name = m_n.group(1).strip()
        raw_name = re.split(r'\b(Father|Husband|Mother|Others|House|Age|photo|Available)\b', raw_name, flags=re.I)[0].strip()
        raw_name = re.sub(r'^[ :.-]+|[ :.-]+$', '', raw_name)
        name = clean_name(raw_name)
        
    # 4. Relation
    rel_type, rel_name = 'Father', ''
    m_r = re.search(r'(Husband|Father|Mother|Other)[a-zA-Z\'\s]*Name\s*[:\s-]\s*([^\n\r]+)', text, re.IGNORECASE)
    if m_r:
        rtype_raw = m_r.group(1).lower()
        if 'husband' in rtype_raw: rel_type = 'Husband'
        elif 'mother' in rtype_raw: rel_type = 'Mother'
        elif 'other' in rtype_raw: rel_type = 'Others'
        else: rel_type = 'Father'
        
        raw_rname = m_r.group(2).strip()
        raw_rname = re.split(r'\b(House|Age|Gender|photo|Available)\b', raw_rname, flags=re.I)[0].strip()
        raw_rname = re.sub(r'^[ :.-]+|[ :.-]+$', '', raw_rname)
        rel_name = clean_name(raw_rname)
        
    # 5. House No
    house_no = ''
    m_h = re.search(r'House\s*Number\s*[:\s-]\s*([^\n\r]+)', text, re.IGNORECASE)
    if m_h:
        raw_h = m_h.group(1).strip()
        raw_h = re.split(r'\b(Age|Gender|photo|Available)\b', raw_h, flags=re.I)[0].strip()
        raw_h = re.sub(r'^[ :.-]+|[ :.-]+$', '', raw_h)
        house_no = clean_text(raw_h)
        
    # 6. Age
    age = None
    m_ag = re.search(r'Age\s*[:\s-]*\s*(\d{1,3})', text, re.IGNORECASE)
    if m_ag:
        age_val = int(m_ag.group(1))
        if 18 <= age_val <= 125:
            age = age_val
            
    # 7. Gender
    gender = 'Male'
    t_lower = text.lower()
    if 'female' in t_lower:
        gender = 'Female'
    elif 'third' in t_lower:
        gender = 'Third Gender'
    elif 'male' in t_lower:
        gender = 'Male'
        
    # Filter empty boxes
    if not name and not epic_no and not serial_no:
        return None
        
    if not name:
        name = "UNKNOWN ELECTOR"
    if not epic_no:
        epic_no = f"TEMP{uuid.uuid4().hex[:7].upper()}"
        
    house_clean = re.sub(r'\s*(floor|ff|sf|tf|ugf|first|second|third|ground).*$', '', house_no, flags=re.I).strip()
    if not house_clean:
        house_clean = house_no
        
    return {
        'serial_no': serial_no or 0,
        'epic_no': epic_no,
        'name': name,
        'name_clean': name.lower(),
        'relation_type': rel_type,
        'relation_name': rel_name,
        'relation_clean': rel_name.lower(),
        'house_no': house_no,
        'house_clean': house_clean,
        'age': age,
        'gender': gender,
        'has_photo': True,
        'section_no': default_section
    }

# -----------------------------------------------------------------------------
# Page 0 (Cover) Parser
# -----------------------------------------------------------------------------
async def parse_cover_page(pdf_path):
    pdf = pdfium.PdfDocument(pdf_path)
    img = pdf[0].render(scale=2.0).to_pil()
    gray = ImageOps.grayscale(img)
    enhanced = ImageEnhance.Contrast(gray).enhance(1.8)
    res = await winocr.recognize_pil(enhanced, lang='en')
    text = '\n'.join([l.text for l in res.lines])
    
    # AC No & Name
    ac_no, ac_name, ac_res = 0, "UNKNOWN", "GEN"
    m_ac = re.search(r'Assembly Constituency\s*[:\s-]*\s*(\d+)\s*-\s*([A-Z\s]+?)(?:\s*\(([A-Z]+)\))?$', text, re.MULTILINE)
    if m_ac:
        ac_no = int(m_ac.group(1))
        ac_name = clean_text(m_ac.group(2))
        ac_res = m_ac.group(3) or "GEN"
    else:
        # Fallback from filename
        m_fn = re.search(r'-U05-(\d+)-', pdf_path)
        if m_fn:
            ac_no = int(m_fn.group(1))
            
    # Part No
    part_no = 1
    m_p = re.search(r'Part\s*No\.?\s*[:\s-]*\s*(\d+)', text, re.IGNORECASE)
    if m_p:
        part_no = int(m_p.group(1))
    else:
        m_fn_p = re.search(r'-ENG-(\d+)-', pdf_path)
        if m_fn_p:
            part_no = int(m_fn_p.group(1))
            
    # PC No & Name
    pc_no, pc_name, pc_res = 0, "DELHI", "GEN"
    m_pc = re.search(r'Parliamentary Constituency.*?[:\s-]*\s*(\d+)\s*-\s*([A-Z\s]+?)(?:\s*\(([A-Z]+)\))?$', text, re.MULTILINE)
    if m_pc:
        pc_no = int(m_pc.group(1))
        pc_name = clean_text(m_pc.group(2))
        pc_res = m_pc.group(3) or "GEN"
        
    # Revision details
    rev_year = 2026
    qual_date = "2026-10-01"
    pub_date = "2026-08-31"
    m_qd = re.search(r'Qualifying Date\s*[:\s-]*\s*(\d{2}-\d{2}-\d{4})', text)
    if m_qd:
        parts = m_qd.group(1).split('-')
        qual_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
    m_pd = re.search(r'Date of Publication\s*[:\s-]*\s*(\d{2}-\d{2}-\d{4})', text)
    if m_pd:
        parts = m_pd.group(1).split('-')
        pub_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
        
    # Polling station
    ps_name = f"{part_no} - PRIMARY SCHOOL"
    ps_address = "DELHI"
    m_ps = re.search(r'No\. and Name of Polling Station\s*[:\s-]*\s*([^\n\r]+)', text)
    if m_ps:
        ps_name = clean_text(m_ps.group(1))
    m_ps_addr = re.search(r'Address of Polling Station\s*[:\s-]*\s*([\s\S]+?)(?=4\. NUMBER|Main Town)', text)
    if m_ps_addr:
        ps_address = clean_text(m_ps_addr.group(1))
        
    # Demographic & admin
    town, ward, po, ps, tehsil, district, pin = "DELHI", "", "", "", "", "DELHI", "110001"
    m_pin = re.search(r'Pin code\s*[:\s-]*\s*(\d{6})', text, re.I)
    if m_pin: pin = m_pin.group(1)
    m_dist = re.search(r'District\s*[:\s-]*\s*([A-Z\s]+)', text, re.I)
    if m_dist: district = clean_text(m_dist.group(1).split('\n')[0])
    m_teh = re.search(r'Tahsil\s*[:\s-]*\s*([A-Z\s]+)', text, re.I)
    if m_teh: tehsil = clean_text(m_teh.group(1).split('\n')[0])
    m_ward = re.search(r'Ward\s*[:\s-]*\s*(\w+)', text, re.I)
    if m_ward: ward = clean_text(m_ward.group(1))
    
    # Counts
    total_electors = 0
    male_electors = 0
    female_electors = 0
    third_gender = 0
    
    m_tot = re.findall(r'\b(\d{2,4})\b', text)
    # The last occurrence of large numbers in table
    m_end = re.search(r'Ending\s*Serial No\.\s*(\d+)', text, re.I)
    if m_end:
        total_electors = int(m_end.group(1))
    else:
        # Check last numbers
        nums = [int(n) for n in m_tot if 100 <= int(n) <= 3000]
        if nums:
            total_electors = nums[-1]
            
    # Sections
    sections = []
    m_sec_block = re.search(r'No\. and name of sections in the part\s*([\s\S]+?)(?=Main Town|3\.\s*Polling|$)', text)
    if m_sec_block:
        sec_text = m_sec_block.group(1)
        raw_secs = re.findall(r'(\d+)\s*[-–]\s*([^\n\r]+)', sec_text)
        for s_no, s_name in raw_secs:
            cleaned_sname = clean_text(s_name)
            if cleaned_sname:
                sections.append({'section_no': int(s_no), 'section_name': cleaned_sname})
    if not sections:
        sections.append({'section_no': 1, 'section_name': f"Section 1 - Main Ward {ward}"})
        
    return {
        'ac_no': ac_no,
        'ac_name': ac_name,
        'ac_reservation': ac_res,
        'pc_no': pc_no,
        'pc_name': pc_name,
        'pc_reservation': pc_res,
        'part_no': part_no,
        'revision_year': rev_year,
        'qualifying_date': qual_date,
        'publication_date': pub_date,
        'polling_station_no': part_no,
        'polling_station_name': ps_name,
        'polling_station_address': ps_address,
        'ward': ward,
        'tehsil': tehsil,
        'district': district,
        'pin_code': pin,
        'total_electors': total_electors,
        'male_electors': male_electors,
        'female_electors': female_electors,
        'third_gender_electors': third_gender,
        'sections': sections
    }

# -----------------------------------------------------------------------------
# Voter Pages Extraction
# -----------------------------------------------------------------------------
async def parse_voter_pages(pdf_path, part_info):
    pdf = pdfium.PdfDocument(pdf_path)
    total_pages = len(pdf)
    voters = []
    
    current_section = 1
    if part_info['sections']:
        current_section = part_info['sections'][0]['section_no']
        
    # Pages 2 to total_pages - 2 are voter pages
    start_page = 2
    end_page = total_pages - 2
    
    print(f"  Extracting voter pages {start_page + 1} to {end_page + 1} (Total {end_page - start_page + 1} pages)...")
    
    for p_idx in range(start_page, end_page + 1):
        t0 = time.time()
        page = pdf[p_idx]
        img = page.render(scale=2.5).to_pil()
        W, H = img.size
        gray = ImageOps.grayscale(img)
        enhanced = ImageEnhance.Contrast(gray).enhance(1.8)
        
        res = await winocr.recognize_pil(enhanced, lang='en')
        
        # Check header for section update
        for line in res.lines[:6]:
            m_sec = re.search(r'Section\s*No[.\s]*and\s*Name\s*(\d+)', line.text, re.I)
            if m_sec:
                current_section = int(m_sec.group(1))
                break
                
        # Grid bounds
        y_start = int(200 * 1.25)
        y_end = int(5480 * 1.25)
        row_height = (y_end - y_start) / 10.0
        col_width = W / 3.0
        
        cells = [[[] for _ in range(3)] for _ in range(10)]
        for line in res.lines:
            xs = [w.bounding_rect.x for w in line.words]
            ys = [w.bounding_rect.y for w in line.words]
            ws = [w.bounding_rect.width for w in line.words]
            hs = [w.bounding_rect.height for w in line.words]
            if not xs:
                continue
            cx = (min(xs) + max(xs[i] + ws[i] for i in range(len(xs)))) / 2.0
            cy = (min(ys) + max(ys[i] + hs[i] for i in range(len(ys)))) / 2.0
            
            if y_start <= cy <= y_end:
                r = int((cy - y_start) / row_height)
                c = int(cx / col_width)
                if 0 <= r < 10 and 0 <= c < 3:
                    cells[r][c].append((cy, line.text))
                    
        page_voters = 0
        for r in range(10):
            for c in range(3):
                cell_lines = [item[1] for item in sorted(cells[r][c], key=lambda x: x[0])]
                if not cell_lines:
                    continue
                card = parse_card_lines(cell_lines, default_section=current_section)
                if card:
                    card['ac_no'] = part_info['ac_no']
                    card['part_no'] = part_info['part_no']
                    voters.append(card)
                    page_voters += 1
                    
        print(f"    Page {p_idx+1}/{total_pages}: {page_voters} electors extracted in {time.time() - t0:.2f}s")
        
    return voters

# -----------------------------------------------------------------------------
# Main Batch Pipeline
# -----------------------------------------------------------------------------
async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Extract ECI Electoral Roll PDFs to Supabase CSV/SQL")
    parser.add_argument("--max-files", type=int, default=None, help="Limit number of PDFs to process for quick testing")
    parser.add_argument("--pdf", type=str, default=None, help="Process a specific PDF filename")
    args = parser.parse_args()

    files = glob.glob(os.path.join(DATASET_DIR, "*.pdf"))
    unique_files = {}
    for f in files:
        with open(f, 'rb') as fp:
            h = hashlib.md5(fp.read()).hexdigest()
        if h not in unique_files:
            unique_files[h] = f
            
    file_list = sorted(unique_files.values())
    if args.pdf:
        file_list = [f for f in file_list if args.pdf in f]
    elif args.max_files:
        file_list = file_list[:args.max_files]

    print(f"Targeting {len(file_list)} unique PDF file(s) for extraction.")
    
    all_constituencies = {}
    all_parts = []
    all_sections = []
    all_voters = []
    
    # Process each unique PDF
    for idx, pdf_path in enumerate(file_list):
        print(f"\n=======================================================")
        print(f"[{idx+1}/{len(file_list)}] Processing: {os.path.basename(pdf_path)}")
        print(f"=======================================================")
        
        # 1. Parse Cover
        part_info = await parse_cover_page(pdf_path)
        part_id = str(uuid.uuid4())
        part_info['id'] = part_id
        
        # Track Constituency
        ac_no = part_info['ac_no']
        if ac_no not in all_constituencies:
            all_constituencies[ac_no] = {
                'ac_no': ac_no,
                'ac_name': part_info['ac_name'],
                'ac_reservation': part_info['ac_reservation'],
                'pc_no': part_info['pc_no'],
                'pc_name': part_info['pc_name'],
                'pc_reservation': part_info['pc_reservation'],
                'state_code': 'U05',
                'state_name': 'NCT OF Delhi'
            }
            
        # Track Part
        all_parts.append({
            'id': part_id,
            'ac_no': ac_no,
            'part_no': part_info['part_no'],
            'revision_year': part_info['revision_year'],
            'qualifying_date': part_info['qualifying_date'],
            'publication_date': part_info['publication_date'],
            'revision_type': 'Special Intensive Revision, 2026',
            'polling_station_no': part_info['polling_station_no'],
            'polling_station_name': part_info['polling_station_name'],
            'polling_station_address': part_info['polling_station_address'],
            'polling_station_type': 'General',
            'ward': part_info['ward'],
            'post_office': 'DELHI',
            'police_station': 'DELHI',
            'tehsil': part_info['tehsil'],
            'district': part_info['district'],
            'pin_code': part_info['pin_code'],
            'total_electors': part_info['total_electors'],
            'male_electors': 0,
            'female_electors': 0,
            'third_gender_electors': 0
        })
        
        # Track Sections
        for sec in part_info['sections']:
            all_sections.append({
                'id': str(uuid.uuid4()),
                'part_id': part_id,
                'section_no': sec['section_no'],
                'section_name': sec['section_name']
            })
            
        # 2. Extract Electors
        voters = await parse_voter_pages(pdf_path, part_info)
        m_count = sum(1 for v in voters if v['gender'] == 'Female')
        f_count = sum(1 for v in voters if v['gender'] == 'Male')
        print(f"  Finished Part {part_info['part_no']}: Extracted {len(voters)} electors (Females: {m_count}, Males: {f_count})")
        
        # Link part_id to voters
        for v in voters:
            v['id'] = str(uuid.uuid4())
            v['part_id'] = part_id
            all_voters.append(v)
            
        print(f"  -> Total Cumulative Electors so far: {len(all_voters)}")
        
        # Save incremental datasets after each PDF finishes
        _export_datasets(all_constituencies, all_parts, all_sections, all_voters)

def _export_datasets(all_constituencies, all_parts, all_sections, all_voters):
    print("  Updating CSV and SQL seed exports...")
    # 1. Constituencies CSV
    df_const = pd.DataFrame(list(all_constituencies.values()))
    df_const.to_csv(os.path.join(OUTPUT_DIR, "constituencies.csv"), index=False)
    
    # 2. Roll Parts CSV
    df_parts = pd.DataFrame(all_parts)
    df_parts.to_csv(os.path.join(OUTPUT_DIR, "roll_parts.csv"), index=False)
    
    # 3. Sections CSV
    df_sec = pd.DataFrame(all_sections)
    df_sec.to_csv(os.path.join(OUTPUT_DIR, "part_sections.csv"), index=False)
    
    # 4. Voters V1 CSV
    df_voters = pd.DataFrame(all_voters)
    df_voters.to_csv(os.path.join(OUTPUT_DIR, "voters_v1.csv"), index=False)
    
    # 5. Generate Supabase SQL Insert Seed Script
    sql_path = os.path.join(OUTPUT_DIR, "supabase_seed.sql")
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("-- VOTERMITRA SEED DATA EXPORT\n")
        f.write("-- Generated directly from parsed ECI Electoral Rolls\n\n")
        
        # Constituencies
        for c in all_constituencies.values():
            ac_name_esc = c['ac_name'].replace("'", "''")
            pc_name_esc = c['pc_name'].replace("'", "''")
            f.write(f"INSERT INTO constituencies (ac_no, ac_name, ac_reservation, pc_no, pc_name, pc_reservation, state_code, state_name) "
                    f"VALUES ({c['ac_no']}, '{ac_name_esc}', '{c['ac_reservation']}', {c['pc_no']}, '{pc_name_esc}', '{c['pc_reservation']}', '{c['state_code']}', '{c['state_name']}') ON CONFLICT (ac_no) DO NOTHING;\n")
        f.write("\n")
        
        # Roll Parts
        for p in all_parts:
            ps_name_esc = p['polling_station_name'].replace("'", "''")
            ps_addr_esc = p['polling_station_address'].replace("'", "''")
            f.write(f"INSERT INTO roll_parts (id, ac_no, part_no, revision_year, qualifying_date, publication_date, revision_type, polling_station_no, polling_station_name, polling_station_address, polling_station_type, ward, tehsil, district, pin_code, total_electors, male_electors, female_electors, third_gender_electors) "
                    f"VALUES ('{p['id']}', {p['ac_no']}, {p['part_no']}, {p['revision_year']}, '{p['qualifying_date']}', '{p['publication_date']}', '{p['revision_type']}', {p['polling_station_no']}, '{ps_name_esc}', '{ps_addr_esc}', '{p['polling_station_type']}', '{p['ward']}', '{p['tehsil']}', '{p['district']}', '{p['pin_code']}', {p['total_electors']}, {p['male_electors']}, {p['female_electors']}, {p['third_gender_electors']}) ON CONFLICT DO NOTHING;\n")
        f.write("\n")
        
        # Part Sections
        for s in all_sections:
            sec_name_esc = s['section_name'].replace("'", "''")
            f.write(f"INSERT INTO part_sections (id, part_id, section_no, section_name) "
                    f"VALUES ('{s['id']}', '{s['part_id']}', {s['section_no']}, '{sec_name_esc}') ON CONFLICT DO NOTHING;\n")
        f.write("\n")
        
        # Batch insert for Voters (500 rows per batch)
        f.write("-- Voters V1 Insertions\n")
        batch_size = 500
        for i in range(0, len(all_voters), batch_size):
            chunk = all_voters[i:i + batch_size]
            vals = []
            for v in chunk:
                age_sql = str(v['age']) if v['age'] is not None else "NULL"
                v_name_esc = v['name'].replace("'", "''")
                v_name_clean_esc = v['name_clean'].replace("'", "''")
                v_rel_name_esc = v['relation_name'].replace("'", "''")
                v_rel_clean_esc = v['relation_clean'].replace("'", "''")
                v_house_esc = v['house_no'].replace("'", "''")
                v_house_clean_esc = v['house_clean'].replace("'", "''")
                photo_str = "true" if v['has_photo'] else "false"
                vals.append(f"('{v['id']}', '{v['part_id']}', {v['ac_no']}, {v['part_no']}, {v['section_no']}, {v['serial_no']}, '{v['epic_no']}', '{v_name_esc}', '{v_name_clean_esc}', '{v['relation_type']}', '{v_rel_name_esc}', '{v_rel_clean_esc}', '{v_house_esc}', '{v_house_clean_esc}', {age_sql}, '{v['gender']}', {photo_str})")
            f.write("INSERT INTO voters_v1 (id, part_id, ac_no, part_no, section_no, serial_no, epic_no, name, name_clean, relation_type, relation_name, relation_clean, house_no, house_clean, age, gender, has_photo) VALUES\n" + ",\n".join(vals) + ";\n")
            
    print(f"\n[SUCCESS] Extraction complete!")
    print(f"  - Constituencies: {len(all_constituencies)}")
    print(f"  - Polling Parts: {len(all_parts)}")
    print(f"  - Sections: {len(all_sections)}")
    print(f"  - Total Electors: {len(all_voters)}")
    print(f"  - Files Generated:")
    print(f"      * {os.path.join(OUTPUT_DIR, 'constituencies.csv')}")
    print(f"      * {os.path.join(OUTPUT_DIR, 'roll_parts.csv')}")
    print(f"      * {os.path.join(OUTPUT_DIR, 'part_sections.csv')}")
    print(f"      * {os.path.join(OUTPUT_DIR, 'voters_v1.csv')}")
    print(f"      * {os.path.join(OUTPUT_DIR, 'supabase_seed.sql')}")

if __name__ == '__main__':
    asyncio.run(main())
