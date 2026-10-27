-- ============================================================================
-- VOTERMITRA: Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- Enable UUID & pg_trgm extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if re-initializing (safe order)
DROP TABLE IF EXISTS claim_audits CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS flags CASCADE;
DROP TABLE IF EXISTS voters_v2 CASCADE;
DROP TABLE IF EXISTS voters_v1 CASCADE;
DROP TABLE IF EXISTS part_sections CASCADE;
DROP TABLE IF EXISTS roll_parts CASCADE;
DROP TABLE IF EXISTS constituencies CASCADE;

-- 1. CONSTITUENCIES
CREATE TABLE constituencies (
    ac_no INTEGER NOT NULL PRIMARY KEY,
    ac_name VARCHAR(100) NOT NULL,
    ac_reservation VARCHAR(10) DEFAULT 'GEN',
    pc_no INTEGER NOT NULL,
    pc_name VARCHAR(100) NOT NULL,
    pc_reservation VARCHAR(10) DEFAULT 'GEN',
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL
);

-- 2. ROLL PARTS (Polling Stations)
CREATE TABLE roll_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ac_no INTEGER NOT NULL REFERENCES constituencies(ac_no) ON DELETE CASCADE,
    part_no INTEGER NOT NULL,
    revision_year INTEGER NOT NULL DEFAULT 2026,
    qualifying_date DATE NOT NULL DEFAULT '2026-10-01',
    publication_date DATE NOT NULL DEFAULT '2026-08-31',
    revision_type VARCHAR(100) NOT NULL DEFAULT 'Special Intensive Revision, 2026',
    polling_station_no INTEGER NOT NULL,
    polling_station_name VARCHAR(255) NOT NULL,
    polling_station_address TEXT NOT NULL,
    polling_station_type VARCHAR(50) DEFAULT 'General',
    ward VARCHAR(50),
    post_office VARCHAR(100),
    police_station VARCHAR(100),
    tehsil VARCHAR(100),
    district VARCHAR(100),
    pin_code VARCHAR(10),
    total_electors INTEGER NOT NULL,
    male_electors INTEGER NOT NULL,
    female_electors INTEGER NOT NULL,
    third_gender_electors INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (ac_no, part_no, revision_year)
);

-- 3. PART SECTIONS
CREATE TABLE part_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL REFERENCES roll_parts(id) ON DELETE CASCADE,
    section_no INTEGER NOT NULL,
    section_name TEXT NOT NULL,
    UNIQUE (part_id, section_no)
);

-- 4. VOTERS V1 (Baseline Draft Roll)
CREATE TABLE voters_v1 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL REFERENCES roll_parts(id) ON DELETE CASCADE,
    ac_no INTEGER NOT NULL REFERENCES constituencies(ac_no),
    part_no INTEGER NOT NULL,
    section_no INTEGER NOT NULL DEFAULT 1,
    serial_no INTEGER NOT NULL,
    epic_no VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_clean VARCHAR(200) NOT NULL,
    relation_type VARCHAR(20) NOT NULL DEFAULT 'Father',
    relation_name VARCHAR(200) NOT NULL DEFAULT '',
    relation_clean VARCHAR(200) NOT NULL DEFAULT '',
    house_no VARCHAR(100) NOT NULL DEFAULT '',
    house_clean VARCHAR(100) NOT NULL DEFAULT '',
    age INTEGER CHECK (age IS NULL OR (age >= 18 AND age <= 130)),
    gender VARCHAR(15) NOT NULL DEFAULT 'Male' CHECK (gender IN ('Male', 'Female', 'Third Gender')),
    has_photo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VOTERS V2 (Revised Intensive Roll with Planted/Real Changes)
CREATE TABLE voters_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL REFERENCES roll_parts(id) ON DELETE CASCADE,
    ac_no INTEGER NOT NULL REFERENCES constituencies(ac_no),
    part_no INTEGER NOT NULL,
    section_no INTEGER NOT NULL DEFAULT 1,
    serial_no INTEGER NOT NULL,
    epic_no VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_clean VARCHAR(200) NOT NULL,
    relation_type VARCHAR(20) NOT NULL DEFAULT 'Father',
    relation_name VARCHAR(200) NOT NULL DEFAULT '',
    relation_clean VARCHAR(200) NOT NULL DEFAULT '',
    house_no VARCHAR(100) NOT NULL DEFAULT '',
    house_clean VARCHAR(100) NOT NULL DEFAULT '',
    age INTEGER CHECK (age IS NULL OR (age >= 18 AND age <= 130)),
    gender VARCHAR(15) NOT NULL DEFAULT 'Male' CHECK (gender IN ('Male', 'Female', 'Third Gender')),
    has_photo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indices
CREATE INDEX idx_voters_v1_ac_part ON voters_v1(ac_no, part_no);
CREATE INDEX idx_voters_v1_epic ON voters_v1(epic_no);
CREATE INDEX idx_voters_v1_house ON voters_v1(ac_no, part_no, house_clean);
CREATE INDEX idx_voters_v1_trgm_name ON voters_v1 USING gin (name_clean gin_trgm_ops);

CREATE INDEX idx_voters_v2_ac_part ON voters_v2(ac_no, part_no);
CREATE INDEX idx_voters_v2_epic ON voters_v2(epic_no);
CREATE INDEX idx_voters_v2_house ON voters_v2(ac_no, part_no, house_clean);
CREATE INDEX idx_voters_v2_trgm_name ON voters_v2 USING gin (name_clean gin_trgm_ops);

-- 6. ANOMALY FLAGS
CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anomaly_type VARCHAR(80) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'DISMISSED', 'INVESTIGATING')),
    ac_no INTEGER NOT NULL REFERENCES constituencies(ac_no),
    part_no INTEGER NOT NULL,
    section_no INTEGER,
    affected_count INTEGER NOT NULL DEFAULT 1,
    confidence_score NUMERIC(5, 4) NOT NULL,
    z_score NUMERIC(6, 2),
    primary_finding TEXT NOT NULL,
    evidence_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    innocent_explanations JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_planted BOOLEAN DEFAULT FALSE,
    planted_scenario_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flags_lookup ON flags(ac_no, part_no, severity, status);

-- 7. AUDITOR REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID NOT NULL REFERENCES flags(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_role VARCHAR(50) NOT NULL DEFAULT 'Electoral Officer',
    decision VARCHAR(50) NOT NULL CHECK (decision IN (
        'VERIFIED_ANOMALY',
        'FALSE_POSITIVE_BENIGN',
        'CLERICAL_TYPO',
        'ESCALATED_FIELD_VISIT'
    )),
    innocent_reason_accepted VARCHAR(255),
    justification TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BENCHMARK SCENARIOS (Ground Truth Answer Key)
CREATE TABLE IF NOT EXISTS benchmark_scenarios (
    scenario_id VARCHAR(50) PRIMARY KEY,
    anomaly_type VARCHAR(80) NOT NULL,
    ac_no INTEGER,
    part_no INTEGER,
    description TEXT
);

-- 9. CLAIM AUDITS (Telegram Bot & Fact-Checker Logs)
CREATE TABLE claim_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(20) NOT NULL CHECK (source IN ('TELEGRAM_VOICE', 'TELEGRAM_TEXT', 'WEB_UI', 'API')),
    telegram_user_id BIGINT,
    raw_query TEXT NOT NULL,
    transcribed_text TEXT,
    language_code VARCHAR(10) DEFAULT 'hi',
    selected_function VARCHAR(80),
    function_args JSONB DEFAULT '{}'::jsonb,
    tool_raw_output JSONB DEFAULT '{}'::jsonb,
    verdict VARCHAR(30),
    confidence VARCHAR(20),
    reasoning JSONB DEFAULT '[]'::jsonb,
    official_explanation TEXT NOT NULL,
    synthesized_audio_url TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with open read access for demo purposes
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE roll_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters_v1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access Constituencies" ON constituencies FOR SELECT USING (true);
CREATE POLICY "Public Read Access Roll Parts" ON roll_parts FOR SELECT USING (true);
CREATE POLICY "Public Read Access Part Sections" ON part_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Access Voters V1" ON voters_v1 FOR SELECT USING (true);
CREATE POLICY "Public Read Access Voters V2" ON voters_v2 FOR SELECT USING (true);
CREATE POLICY "Public Read Access Flags" ON flags FOR SELECT USING (true);
CREATE POLICY "Public Read Access Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Write Access Reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Access Claim Audits" ON claim_audits FOR SELECT USING (true);
CREATE POLICY "Public Write Access Claim Audits" ON claim_audits FOR INSERT WITH CHECK (true);
