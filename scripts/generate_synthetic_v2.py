import json
import os
import random
import re
import uuid
import numpy as np
import pandas as pd

# Set fixed seeds for deterministic reproducibility
RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

DATA_DIR = "data"
V1_PATH = os.path.join(DATA_DIR, "voters_v1.csv")
PARTS_PATH = os.path.join(DATA_DIR, "roll_parts.csv")
V2_PATH = os.path.join(DATA_DIR, "voters_v2.csv")
GROUND_TRUTH_JSON = os.path.join(DATA_DIR, "ground_truth_answer_key.json")
GROUND_TRUTH_CSV = os.path.join(DATA_DIR, "ground_truth_anomalies.csv")
V2_SQL_PATH = os.path.join(DATA_DIR, "supabase_v2_seed.sql")

COMMON_FIRST_NAMES_MALE = [
    "Aarav", "Aditya", "Amit", "Anand", "Anil", "Deepak", "Gaurav", "Harish", "Kailash",
    "Manish", "Manoj", "Mukesh", "Naveen", "Pankaj", "Pradeep", "Rahul", "Rajesh", "Rakesh",
    "Rohit", "Sachin", "Sanjay", "Satish", "Suresh", "Varun", "Vikas", "Vinod", "Vishal"
]

COMMON_FIRST_NAMES_FEMALE = [
    "Aarti", "Anjali", "Anju", "Deepa", "Divya", "Geeta", "Kamlesh", "Kavita", "Kiran",
    "Manju", "Meena", "Monika", "Neha", "Pooja", "Poonam", "Priya", "Radha", "Rajni",
    "Renu", "Ritu", "Rekha", "Sarita", "Seema", "Shashi", "Shweta", "Suman", "Sunita"
]

COMMON_LAST_NAMES = [
    "Aggarwal", "Bansal", "Chopra", "Dahiya", "Garg", "Goel", "Goyal", "Gupta", "Jain",
    "Jindal", "Kapoor", "Khatri", "Kumar", "Malik", "Mehra", "Mittal", "Rawat", "Saini",
    "Sehgal", "Sethi", "Sharma", "Singh", "Thakur", "Tiwari", "Verma", "Yadav"
]

def generate_random_epic(prefix="URO"):
    digits = "".join([str(random.randint(0, 9)) for _ in range(7)])
    return f"{prefix}{digits}"

def main():
    print("Loading Baseline Voters (V1)...")
    df_v1 = pd.read_csv(V1_PATH)
    df_parts = pd.read_csv(PARTS_PATH)
    print(f"Total V1 Voters Loaded: {len(df_v1)} across {len(df_parts)} Polling Parts")

    # Group parts by AC
    parts_by_ac = {}
    for _, row in df_parts.iterrows():
        ac = int(row['ac_no'])
        parts_by_ac.setdefault(ac, []).append(row)

    # Clone V1 to start V2
    df_v2 = df_v1.copy()
    
    # -------------------------------------------------------------------------
    # 1. APPLY NATURAL DEMOGRAPHIC EVOLUTION (98.5% realistic life events)
    # -------------------------------------------------------------------------
    print("Applying natural demographic evolution (aging, mortality, new youth enrollments)...")
    
    # Natural aging: everyone who remains advances by 1 year
    df_v2['age'] = df_v2['age'].apply(lambda a: int(a + 1) if pd.notnull(a) else a)
    
    # Natural deceased exits (~1.0% focused on elderly 70+)
    elderly_mask = df_v2['age'] >= 70
    elderly_indices = df_v2[elderly_mask].index.tolist()
    natural_deaths_count = int(len(elderly_indices) * 0.08) # 8% of 70+
    natural_deaths = set(random.sample(elderly_indices, natural_deaths_count))
    
    # General natural exits (~0.4% across all ages due to relocation)
    general_indices = [i for i in df_v2.index if i not in natural_deaths]
    natural_relocations_count = int(len(general_indices) * 0.004)
    natural_exits = natural_deaths.union(set(random.sample(general_indices, natural_relocations_count)))
    
    df_v2 = df_v2.drop(index=list(natural_exits)).reset_index(drop=True)
    print(f"  Natural removals applied: {len(natural_exits)} electors")

    # Natural youth additions (turning 18, ~1.5% new electors)
    natural_additions = []
    num_youth = int(len(df_v1) * 0.015)
    sampled_households = df_v2.sample(num_youth, random_state=RANDOM_SEED)
    
    for _, parent in sampled_households.iterrows():
        gender = random.choice(["Male", "Female"])
        fn = random.choice(COMMON_FIRST_NAMES_MALE if gender == "Male" else COMMON_FIRST_NAMES_FEMALE)
        ln = parent['name'].split()[-1] if parent['name'] else "Kumar"
        name = f"{fn} {ln}"
        
        # Relation is usually the parent
        rel_type = "Father" if parent['gender'] == "Male" else "Mother"
        rel_name = parent['name']
        
        natural_additions.append({
            'id': str(uuid.uuid4()),
            'part_id': parent['part_id'],
            'ac_no': parent['ac_no'],
            'part_no': parent['part_no'],
            'section_no': parent['section_no'],
            'serial_no': 9000 + len(natural_additions),
            'epic_no': generate_random_epic("URO"),
            'name': name,
            'name_clean': name.lower(),
            'relation_type': rel_type,
            'relation_name': rel_name,
            'relation_clean': rel_name.lower(),
            'house_no': parent['house_no'],
            'house_clean': parent['house_clean'],
            'age': 18,
            'gender': gender,
            'has_photo': True,
            'created_at': '2026-08-31 00:00:00+00'
        })
        
    df_v2 = pd.concat([df_v2, pd.DataFrame(natural_additions)], ignore_index=True)
    print(f"  Natural youth additions applied: {len(natural_additions)} new 18-year-old electors")

    # -------------------------------------------------------------------------
    # 2. CONTROLLED ANOMALY PLANTING (EXACTLY 40 BENCHMARKED CASES)
    # -------------------------------------------------------------------------
    print("\nPlanting exactly 40 controlled, benchmarked anomalies across 5 categories...")
    planted_anomalies = []
    
    # Available parts for planting
    available_parts = df_parts.to_dict('records')
    
    # -------------------------------------------------------------------------
    # CATEGORY 1: TARGETED_BULK_DELETION (10 cases)
    # Targeted demographic purge (e.g. young females 20-35 deleted at abnormal rate Z > 3.5)
    # -------------------------------------------------------------------------
    print("  -> Planting Category 1: Targeted Demographic Deletions (10 cases)...")
    cat1_parts = random.sample(available_parts, 10)
    for idx, p in enumerate(cat1_parts):
        sc_id = f"ANOM-CAT1-DEL-{idx+1:02d}"
        ac_no = p['ac_no']
        part_no = p['part_no']
        
        # Find female electors in age 20-35 in this part
        candidates = df_v2[(df_v2['ac_no'] == ac_no) & (df_v2['part_no'] == part_no) & 
                           (df_v2['gender'] == 'Female') & (df_v2['age'].between(20, 35))]
        
        del_count = min(len(candidates), random.randint(28, 48))
        if del_count < 15:
            # Fallback to broader age bracket if sample is small
            candidates = df_v2[(df_v2['ac_no'] == ac_no) & (df_v2['part_no'] == part_no) & (df_v2['gender'] == 'Female')]
            del_count = min(len(candidates), random.randint(25, 40))
            
        targets = candidates.sample(del_count, random_state=RANDOM_SEED + idx)
        target_epics = targets['epic_no'].tolist()
        
        # Remove from V2
        df_v2 = df_v2[~df_v2['epic_no'].isin(target_epics)].reset_index(drop=True)
        
        planted_anomalies.append({
            'scenario_id': sc_id,
            'category': 'BULK_DELETION',
            'severity': 'CRITICAL',
            'ac_no': ac_no,
            'part_no': part_no,
            'section_no': int(targets.iloc[0]['section_no']) if len(targets) > 0 else 1,
            'affected_count': del_count,
            'deviation_metric': f"Z-Score: +{round(random.uniform(3.8, 5.4), 2)} sigma",
            'affected_sample_epics': target_epics[:5],
            'primary_finding': f"Abnormal targeted deletion of {del_count} female electors aged 20-35 in Part {part_no} of AC {ac_no}.",
            'innocent_explanations': [
                "Post-marital name transfer to husband's constituency under Form 8",
                "Slum demolition and rehabilitation drive under urban renewal scheme",
                "Closure of working women's hostel facility in the sector"
            ],
            'confidence_score': round(random.uniform(0.92, 0.98), 4)
        })

    # -------------------------------------------------------------------------
    # CATEGORY 2: PHANTOM_ADDRESS_STACKING (10 cases)
    # 40-75 newly fabricated electors clustered into a single residential/commercial unit
    # -------------------------------------------------------------------------
    print("  -> Planting Category 2: Phantom Address Stacking (10 cases)...")
    cat2_parts = random.sample([p for p in available_parts if p not in cat1_parts[:5]], 10)
    fake_addresses = [
        "Shop No. 4, Market Complex", "House No. 0, Ground Floor", "Plot 12-B, Basement",
        "Khasra 44/2, Tin Shed", "Flat C-1, Commercial Wing", "Property No. 99, Back Lane",
        "Cabin No. 7, Community Hall", "B-Block Garage Unit 2", "Shop 18, Main Road", "Plot 88, Near Transformer"
    ]
    
    for idx, p in enumerate(cat2_parts):
        sc_id = f"ANOM-CAT2-STACK-{idx+1:02d}"
        ac_no = p['ac_no']
        part_no = p['part_no']
        part_id = p['id']
        addr = fake_addresses[idx]
        stack_count = random.randint(42, 68)
        
        new_stacked_voters = []
        for v_idx in range(stack_count):
            gender = random.choice(["Male", "Female"])
            fn = random.choice(COMMON_FIRST_NAMES_MALE if gender == "Male" else COMMON_FIRST_NAMES_FEMALE)
            ln = random.choice(COMMON_LAST_NAMES)
            name = f"{fn} {ln}"
            rel_name = f"{random.choice(COMMON_FIRST_NAMES_MALE)} {ln}"
            age = random.randint(21, 58)
            epic = generate_random_epic("URO")
            
            new_stacked_voters.append({
                'id': str(uuid.uuid4()),
                'part_id': part_id,
                'ac_no': ac_no,
                'part_no': part_no,
                'section_no': 1,
                'serial_no': 8000 + v_idx,
                'epic_no': epic,
                'name': name,
                'name_clean': name.lower(),
                'relation_type': 'Father',
                'relation_name': rel_name,
                'relation_clean': rel_name.lower(),
                'house_no': addr,
                'house_clean': addr,
                'age': age,
                'gender': gender,
                'has_photo': True,
                'created_at': '2026-08-31 00:00:00+00'
            })
            
        df_v2 = pd.concat([df_v2, pd.DataFrame(new_stacked_voters)], ignore_index=True)
        sample_epics = [v['epic_no'] for v in new_stacked_voters[:5]]
        
        planted_anomalies.append({
            'scenario_id': sc_id,
            'category': 'HOUSE_OVERCROWDING',
            'severity': 'CRITICAL',
            'ac_no': ac_no,
            'part_no': part_no,
            'section_no': 1,
            'affected_count': stack_count,
            'deviation_metric': f"Address Density: {stack_count} electors / unit (Poisson p < 1e-6)",
            'affected_sample_epics': sample_epics,
            'primary_finding': f"Address overcrowding anomaly: {stack_count} unrelated electors registered at '{addr}' in Part {part_no}.",
            'innocent_explanations': [
                "Newly notified student or PG hostel accommodation",
                "Police line or paramilitary staff transit quarters",
                "Ancestral undivided Hindu Undivided Family (HUF) residential property"
            ],
            'confidence_score': round(random.uniform(0.94, 0.99), 4)
        })

    # -------------------------------------------------------------------------
    # CATEGORY 3: CROSS_BOOTH_DUPLICATE_CLONES (8 cases)
    # The exact same voter identities cloned into adjacent parts with new EPICs
    # -------------------------------------------------------------------------
    print("  -> Planting Category 3: Cross-Booth Identity Clones (8 cases)...")
    for idx in range(8):
        sc_id = f"ANOM-CAT3-CLONE-{idx+1:02d}"
        # Pick an AC with at least 2 parts
        valid_acs = [ac for ac, pts in parts_by_ac.items() if len(pts) >= 2]
        target_ac = random.choice(valid_acs)
        p_src, p_dst = random.sample(parts_by_ac[target_ac], 2)
        
        # Pick 12 to 20 voters from source part
        src_voters = df_v2[(df_v2['ac_no'] == target_ac) & (df_v2['part_no'] == p_src['part_no'])]
        clone_count = min(len(src_voters), random.randint(12, 22))
        clones_to_copy = src_voters.sample(clone_count, random_state=RANDOM_SEED + idx).copy()
        
        cloned_rows = []
        for _, orig in clones_to_copy.iterrows():
            # Clone with identical name, relative, age, but new Part and new EPIC
            new_epic = generate_random_epic("TSO")
            cloned_rows.append({
                'id': str(uuid.uuid4()),
                'part_id': p_dst['id'],
                'ac_no': target_ac,
                'part_no': p_dst['part_no'],
                'section_no': 1,
                'serial_no': 7500 + len(cloned_rows),
                'epic_no': new_epic,
                'name': orig['name'],
                'name_clean': orig['name_clean'],
                'relation_type': orig['relation_type'],
                'relation_name': orig['relation_name'],
                'relation_clean': orig['relation_clean'],
                'house_no': orig['house_no'],
                'house_clean': orig['house_clean'],
                'age': orig['age'],
                'gender': orig['gender'],
                'has_photo': True,
                'created_at': '2026-08-31 00:00:00+00'
            })
            
        df_v2 = pd.concat([df_v2, pd.DataFrame(cloned_rows)], ignore_index=True)
        sample_epics = [r['epic_no'] for r in cloned_rows[:5]]
        
        planted_anomalies.append({
            'scenario_id': sc_id,
            'category': 'DUPLICATE_EPIC',
            'severity': 'HIGH',
            'ac_no': target_ac,
            'part_no': p_dst['part_no'],
            'section_no': 1,
            'affected_count': clone_count,
            'deviation_metric': f"RapidFuzz Identity Similarity: 100% across Part {p_src['part_no']} and Part {p_dst['part_no']}",
            'affected_sample_epics': sample_epics,
            'primary_finding': f"Cross-booth duplicate identities: {clone_count} electors in Part {p_dst['part_no']} match voters in Part {p_src['part_no']}.",
            'innocent_explanations': [
                "Elector submitted Form 8 migration request; previous booth deletion pending administrative sign-off",
                "Twin siblings sharing identical paternal details and household address"
            ],
            'confidence_score': round(random.uniform(0.91, 0.97), 4)
        })

    # -------------------------------------------------------------------------
    # CATEGORY 4: CHRONO_DISCREPANCY / IMPOSSIBLE_AGING (6 cases)
    # Voters whose age jumps by 12-25 years or decreases between v1 and v2
    # -------------------------------------------------------------------------
    print("  -> Planting Category 4: Chrono-Discrepancies / Impossible Aging (6 cases)...")
    for idx in range(6):
        sc_id = f"ANOM-CAT4-AGE-{idx+1:02d}"
        p = available_parts[idx]
        ac_no = p['ac_no']
        part_no = p['part_no']
        
        part_voters = df_v2[(df_v2['ac_no'] == ac_no) & (df_v2['part_no'] == part_no) & (df_v2['age'].between(25, 45))]
        chrono_count = min(len(part_voters), random.randint(14, 26))
        chosen = part_voters.sample(chrono_count, random_state=RANDOM_SEED + idx)
        
        affected_epics = []
        for i_idx, (_, row) in enumerate(chosen.iterrows()):
            delta = random.choice([+15, +18, +22, -12])
            new_age = max(18, min(95, row['age'] + delta))
            df_v2.loc[df_v2['epic_no'] == row['epic_no'], 'age'] = new_age
            affected_epics.append(row['epic_no'])
            
        planted_anomalies.append({
            'scenario_id': sc_id,
            'category': 'AGE_DISCREPANCY',
            'severity': 'MEDIUM',
            'ac_no': ac_no,
            'part_no': part_no,
            'section_no': int(chosen.iloc[0]['section_no']) if len(chosen) > 0 else 1,
            'affected_count': chrono_count,
            'deviation_metric': f"Age Jump Anomaly: Delta >= 12 years in 1 revision cycle (|Delta_Age - 1| >> 0)",
            'affected_sample_epics': affected_epics[:5],
            'primary_finding': f"Impossible chrono-aging detected: {chrono_count} electors in Part {part_no} shifted age by 12-22 years in 1 year.",
            'innocent_explanations': [
                "Clerical typographical error in Year of Birth during data digitization",
                "Aadhaar linkage reconciliation correcting historical estimated age"
            ],
            'confidence_score': round(random.uniform(0.88, 0.94), 4)
        })

    # -------------------------------------------------------------------------
    # CATEGORY 5: LOCALIZED_SEX_RATIO_SKEW (6 cases)
    # Severe gender distortion in a localized section (> 4 sigma drop)
    # -------------------------------------------------------------------------
    print("  -> Planting Category 5: Localized Sex Ratio Distortion (6 cases)...")
    for idx in range(6):
        sc_id = f"ANOM-CAT5-RATIO-{idx+1:02d}"
        p = available_parts[idx + 6]
        ac_no = p['ac_no']
        part_no = p['part_no']
        part_id = p['id']
        
        # Inject 45 to 70 exclusively male electors
        male_spike_count = random.randint(45, 75)
        skewed_voters = []
        for v_idx in range(male_spike_count):
            fn = random.choice(COMMON_FIRST_NAMES_MALE)
            ln = random.choice(COMMON_LAST_NAMES)
            name = f"{fn} {ln}"
            rel_name = f"{random.choice(COMMON_FIRST_NAMES_MALE)} {ln}"
            age = random.randint(20, 35)
            epic = generate_random_epic("URO")
            
            skewed_voters.append({
                'id': str(uuid.uuid4()),
                'part_id': part_id,
                'ac_no': ac_no,
                'part_no': part_no,
                'section_no': 2,
                'serial_no': 6500 + v_idx,
                'epic_no': epic,
                'name': name,
                'name_clean': name.lower(),
                'relation_type': 'Father',
                'relation_name': rel_name,
                'relation_clean': rel_name.lower(),
                'house_no': f"Block D-{v_idx // 4 + 1}",
                'house_clean': f"Block D-{v_idx // 4 + 1}",
                'age': age,
                'gender': 'Male',
                'has_photo': True,
                'created_at': '2026-08-31 00:00:00+00'
            })
            
        df_v2 = pd.concat([df_v2, pd.DataFrame(skewed_voters)], ignore_index=True)
        sample_epics = [v['epic_no'] for v in skewed_voters[:5]]
        
        planted_anomalies.append({
            'scenario_id': sc_id,
            'category': 'SEX_RATIO_DISTORTION',
            'severity': 'HIGH',
            'ac_no': ac_no,
            'part_no': part_no,
            'section_no': 2,
            'affected_count': male_spike_count,
            'deviation_metric': f"Sex Ratio: 320 F / 1000 M (Constituency Baseline: 860 F / 1000 M, Z = +4.8 sigma)",
            'affected_sample_epics': sample_epics,
            'primary_finding': f"Severe sex ratio skew in Section 2, Part {part_no}: {male_spike_count} exclusively male electors injected.",
            'innocent_explanations': [
                "Construction worker temporary camp setup for metro/highway infrastructure",
                "Industrial factory single-male workforce housing unit"
            ],
            'confidence_score': round(random.uniform(0.92, 0.96), 4)
        })

    # -------------------------------------------------------------------------
    # 3. EXPORT REVISED ROLL (V2) & GROUND TRUTH BENCHMARK
    # -------------------------------------------------------------------------
    print(f"\nFinal V2 Roll Size: {len(df_v2)} electors (Baseline V1 was {len(df_v1)})")
    print(f"Total Planted Anomalies: {len(planted_anomalies)} (Target: 40)")
    
    # Export Voters V2 CSV
    df_v2.to_csv(V2_PATH, index=False)
    print(f"  -> Exported: {V2_PATH}")
    
    # Export Ground Truth JSON
    with open(GROUND_TRUTH_JSON, "w", encoding="utf-8") as f:
        json.dump(planted_anomalies, f, indent=2)
    print(f"  -> Exported: {GROUND_TRUTH_JSON}")
    
    # Export Ground Truth CSV for fast tabular review
    df_gt = pd.DataFrame(planted_anomalies)
    df_gt.to_csv(GROUND_TRUTH_CSV, index=False)
    print(f"  -> Exported: {GROUND_TRUTH_CSV}")
    
    # Export Supabase V2 & Flags SQL Seed Script
    print("Generating Supabase V2 & Flags Seed SQL...")
    with open(V2_SQL_PATH, "w", encoding="utf-8") as f:
        f.write("-- VOTERMITRA REVISED ROLL (V2) & PLANTED FLAGS SEED SCRIPT\n\n")
        
        # 1. Voters V2 batch inserts (500 rows/batch)
        f.write("-- 1. Insert Voters V2\n")
        batch_size = 500
        for i in range(0, len(df_v2), batch_size):
            chunk = df_v2.iloc[i:i + batch_size]
            vals = []
            for _, v in chunk.iterrows():
                age_sql = str(int(v['age'])) if pd.notnull(v['age']) else "NULL"
                v_name_esc = str(v['name']).replace("'", "''")
                v_name_clean_esc = str(v['name_clean']).replace("'", "''")
                v_rel_name_esc = str(v['relation_name']).replace("'", "''")
                v_rel_clean_esc = str(v['relation_clean']).replace("'", "''")
                v_house_esc = str(v['house_no']).replace("'", "''")
                v_house_clean_esc = str(v['house_clean']).replace("'", "''")
                photo_str = "true" if v['has_photo'] else "false"
                vals.append(f"('{v['id']}', '{v['part_id']}', {v['ac_no']}, {v['part_no']}, {v['section_no']}, {v['serial_no']}, '{v['epic_no']}', '{v_name_esc}', '{v_name_clean_esc}', '{v['relation_type']}', '{v_rel_name_esc}', '{v_rel_clean_esc}', '{v_house_esc}', '{v_house_clean_esc}', {age_sql}, '{v['gender']}', {photo_str})")
            f.write("INSERT INTO voters_v2 (id, part_id, ac_no, part_no, section_no, serial_no, epic_no, name, name_clean, relation_type, relation_name, relation_clean, house_no, house_clean, age, gender, has_photo) VALUES\n" + ",\n".join(vals) + ";\n")
        f.write("\n")
        
        # 2. Planted Flags insert
        f.write("-- 2. Insert Planted Flags (Ground Truth Benchmark)\n")
        for anom in planted_anomalies:
            finding_esc = anom['primary_finding'].replace("'", "''")
            evidence_json = json.dumps({'sample_epics': anom['affected_sample_epics'], 'metric': anom['deviation_metric']}).replace("'", "''")
            breakdown_json = json.dumps({'statistical_weight': 0.45, 'demographic_skew': 0.35, 'household_dispersion': 0.20}).replace("'", "''")
            innocent_json = json.dumps(anom['innocent_explanations']).replace("'", "''")
            f.write(
                f"INSERT INTO flags (anomaly_type, severity, status, ac_no, part_no, section_no, affected_count, confidence_score, z_score, primary_finding, evidence_payload, confidence_breakdown, innocent_explanations, is_planted, planted_scenario_id) "
                f"VALUES ('{anom['category']}', '{anom['severity']}', 'PENDING', {anom['ac_no']}, {anom['part_no']}, {anom['section_no']}, {anom['affected_count']}, {anom['confidence_score']}, 4.25, '{finding_esc}', '{evidence_json}'::jsonb, '{breakdown_json}'::jsonb, '{innocent_json}'::jsonb, true, '{anom['scenario_id']}');\n"
            )
            
    print(f"  -> Exported: {V2_SQL_PATH}")
    print("\n[SUCCESS] Synthetic Revision Planter Finished Successfully!")

if __name__ == '__main__':
    main()
