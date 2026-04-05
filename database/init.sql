-- NeuroAlert Africa - Database Schema v1.1

-- 1. Languages & Translations (i18n)
CREATE TABLE languages (
    code CHAR(3) PRIMARY KEY, -- fr, en, ha, yo, ig, wo
    name_local TEXT NOT NULL,
    name_fr TEXT,
    direction TEXT DEFAULT 'ltr',
    is_active BOOLEAN NOT NULL DEFAULT false,
    countries TEXT[], -- ['NG', 'NE']
    ussd_trigger TEXT -- USSD keyword to select this language
);

CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL, -- ussd.welcome, fast.q1, etc.
    language_code CHAR(3) REFERENCES languages(code),
    content TEXT NOT NULL,
    context TEXT, -- ussd / sms / dashboard
    is_reviewed BOOLEAN DEFAULT false,
    reviewed_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_translations_key ON translations(key);

-- 2. USSD Sessions
CREATE TABLE ussd_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL, -- From Africa's Talking
    phone_number TEXT NOT NULL, -- Hashed or plain depending on privacy needs
    language_code CHAR(3) REFERENCES languages(code),
    current_step TEXT NOT NULL, -- welcome, fast_face, etc.
    fast_face BOOLEAN,
    fast_arm BOOLEAN,
    fast_speech BOOLEAN,
    fast_score SMALLINT,
    ai_risk_score FLOAT4,
    ai_decision TEXT, -- low_risk, alert_level1, alert_level2
    location_text TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, completed, timed_out
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_ussd_sessions_session_id ON ussd_sessions(session_id);

-- 3. Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ussd_sessions(id),
    alert_level SMALLINT NOT NULL, -- 1 or 2
    phone_caller TEXT NOT NULL,
    phone_emergency TEXT,
    phone_relative TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    location_text TEXT,
    country_code CHAR(2),
    fast_score SMALLINT NOT NULL,
    ai_risk_score FLOAT4,
    sms_sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active', -- active, acknowledged, resolved, false_positive
    resolved_at TIMESTAMPTZ,
    response_time_min INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_country ON alerts(country_code);

-- 4. Institutions & Dashboard
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT, -- ministry, hospital, ngo, etc.
    country_code CHAR(2) NOT NULL,
    plan TEXT DEFAULT 'free', -- free, premium
    alert_zones TEXT[], -- city codes
    contact_email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE institution_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Link to Supabase Auth
    institution_id UUID REFERENCES institutions(id),
    full_name TEXT,
    role TEXT DEFAULT 'viewer', -- admin, operator, viewer
    language_pref CHAR(3) DEFAULT 'fr',
    last_login TIMESTAMPTZ
);

-- 5. AI & Analytics
CREATE TABLE ai_analysis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ussd_sessions(id),
    model_version TEXT,
    input_features JSONB,
    raw_score FLOAT4,
    decision TEXT,
    latency_ms INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    country_code CHAR(2),
    language_code CHAR(3),
    total_sessions INTEGER DEFAULT 0,
    total_alerts_l1 INTEGER DEFAULT 0,
    total_alerts_l2 INTEGER DEFAULT 0,
    avg_response_min FLOAT4,
    false_positive_rate FLOAT4
);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);

-- 6. Logs & Audits
CREATE TABLE sms_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES alerts(id),
    recipient TEXT NOT NULL,
    type TEXT, -- emergency, relative, firstaid_info
    language_code CHAR(3),
    content TEXT,
    at_message_id TEXT, -- ID from Africa's Talking
    status TEXT, -- queued, sent, delivered, failed
    sent_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES institution_users(id),
    action TEXT NOT NULL, -- alert.acknowledge, etc.
    target_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
