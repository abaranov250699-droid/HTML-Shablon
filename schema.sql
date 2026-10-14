-- ============================================================================
-- SQL СХЕМА ДЛЯ CLOUD POSTGRESQL (NEON.TECH, РЕГИОН EU-CENTRAL-1)
-- Включает Row Level Security (RLS) для строгой изоляции арендаторов (tenants)
-- ============================================================================

-- 1. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Миграция для добавления колонок согласия, если таблица уже существует
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- 2. Таблица шаблонов email-писем (с включенным RLS)
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Включение Row Level Security (RLS) для таблицы templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Создание политики изоляции по сессионному параметру app.current_tenant
DROP POLICY IF EXISTS tenant_isolation_templates ON templates;
CREATE POLICY tenant_isolation_templates ON templates
    AS PERMISSIVE
    FOR ALL
    TO PUBLIC
    USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', true), ''));


CREATE INDEX IF NOT EXISTS idx_templates_tenant ON templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_templates_updated ON templates(updated_at DESC);
