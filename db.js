const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
let pool = null;
let isPostgres = false;

// 1. Инициализация подключения к PostgreSQL (Neon.tech)
if (DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Обязательно для облачного Neon.tech PostgreSQL
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
    isPostgres = true;
    console.log('📦 [DB] Облачный PostgreSQL (Neon.tech, eu-central-1) подключен.');
  } catch (err) {
    console.error('❌ [DB] Ошибка подключения к PostgreSQL:', err.message);
  }
} else {
  console.log('ℹ️  [DB] DATABASE_URL не обнаружена. Используется локальный адаптер данных.');
  console.log('👉 Для перехода на Neon PostgreSQL укажите DATABASE_URL в файле .env');
}

// Автоматическая проверка и накат схемы при старте сервера с PostgreSQL
async function autoMigrate() {
  if (!isPostgres || !pool) return;
  try {
    const client = await pool.connect();
    const schemaFile = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaFile)) {
      const sql = fs.readFileSync(schemaFile, 'utf8');
      await client.query(sql);
      console.log('🛡️  [DB] Row Level Security (RLS) и схема таблиц активированы в Neon PostgreSQL.');
    }
    client.release();
  } catch (e) {
    console.error('⚠️  [DB] Ошибка автоматической миграции:', e.message);
  }
}
autoMigrate();

/**
 * Выполнение запроса в контексте арендатора с включенной политикой Row Level Security (RLS)
 * Устанавливает параметр сессии PostgreSQL: app.current_tenant
 */
async function withTenantClient(tenantId, callback) {
  if (!isPostgres || !pool) {
    throw new Error('PostgreSQL не сконфигурирован');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Установка tenant_id для изоляции через Row Level Security
    await client.query("SELECT set_config('app.current_tenant', $1, true)", [tenantId || '']);
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ==================== РЕАЛИЗАЦИЯ POSTGRESQL ====================

// Регистрация
async function registerUserPg(username, password, tenantId) {
  const cleanUsername = username.trim().toLowerCase();
  const assignedTenantId = tenantId || `tenant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const passwordHash = await bcrypt.hash(password, 10);

  const res = await pool.query(
    `INSERT INTO users (username, password_hash, tenant_id)
     VALUES ($1, $2, $3)
     RETURNING id, username, tenant_id, created_at`,
    [cleanUsername, passwordHash, assignedTenantId]
  );
  return res.rows[0];
}

// Авторизация
async function loginUserPg(username, password) {
  const cleanUsername = username.trim().toLowerCase();
  const res = await pool.query(
    `SELECT id, username, password_hash, tenant_id FROM users WHERE username = $1`,
    [cleanUsername]
  );
  const user = res.rows[0];
  if (!user) throw new Error('Неверный логин или пароль');

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error('Неверный логин или пароль');

  return { id: user.id, username: user.username, tenantId: user.tenant_id };
}

// Шаблоны с RLS
async function getUserTemplatesPg(tenantId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(
      `SELECT id, tenant_id, user_id, name, state, created_at, updated_at
       FROM templates
       ORDER BY updated_at DESC`
    );
    return res.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      state: r.state,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  });
}

async function saveTemplatePg(tenantId, userId, templateData) {
  return withTenantClient(tenantId, async (client) => {
    const tplId = templateData.id || `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const name = templateData.name || 'Мой шаблон письма';
    const state = templateData.state || {};
    const now = new Date();

    const res = await client.query(
      `INSERT INTO templates (id, tenant_id, user_id, name, state, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           state = EXCLUDED.state,
           updated_at = EXCLUDED.updated_at
       RETURNING id, tenant_id, user_id, name, state, created_at, updated_at`,
      [tplId, tenantId, userId || null, name, JSON.stringify(state), now]
    );

    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      name: r.name,
      state: r.state,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  });
}

async function deleteTemplatePg(tenantId, templateId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(
      `DELETE FROM templates WHERE id = $1 RETURNING id`,
      [templateId]
    );
    if (res.rowCount === 0) {
      throw new Error('Шаблон не найден или у вас нет прав на его удаление');
    }
    return true;
  });
}

// REST API для расширенных бизнес-модулей (виджеты, менеджеры, сделки, платежи)
async function getCustomWidgetsPg(tenantId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(`SELECT * FROM custom_widgets ORDER BY created_at DESC`);
    return res.rows;
  });
}

async function getManagersPg(tenantId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(`SELECT * FROM managers ORDER BY created_at DESC`);
    return res.rows;
  });
}

async function getDealsPg(tenantId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(`SELECT * FROM deals ORDER BY created_at DESC`);
    return res.rows;
  });
}

async function getPaymentsPg(tenantId) {
  return withTenantClient(tenantId, async (client) => {
    const res = await client.query(`SELECT * FROM payments ORDER BY paid_at DESC`);
    return res.rows;
  });
}

// ==================== ЛОКАЛЬНЫЙ РЕЗЕРВНЫЙ АДАПТЕР (FALLBACK) ====================
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

function getLocalUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return []; }
}
function saveLocalUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}
function getLocalTemplates() {
  try { return JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8')); } catch { return []; }
}
function saveLocalTemplates(tpls) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(tpls, null, 2), 'utf8');
}

async function registerUserLocal(username, password, tenantId) {
  const users = getLocalUsers();
  const cleanUsername = username.trim().toLowerCase();
  if (users.find(u => u.username === cleanUsername)) {
    throw new Error('Пользователь с таким логином уже существует');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username: cleanUsername,
    passwordHash,
    tenantId: tenantId || `tenant_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveLocalUsers(users);
  return { id: newUser.id, username: newUser.username, tenantId: newUser.tenantId };
}

async function loginUserLocal(username, password) {
  const users = getLocalUsers();
  const cleanUsername = username.trim().toLowerCase();
  const user = users.find(u => u.username === cleanUsername);
  if (!user) throw new Error('Неверный логин или пароль');
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Неверный логин или пароль');
  return { id: user.id, username: user.username, tenantId: user.tenantId || `tenant_${user.id}` };
}

function getUserTemplatesLocal(tenantId) {
  const tpls = getLocalTemplates();
  return tpls
    .filter(t => t.tenantId === tenantId || (!t.tenantId && t.userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function saveTemplateLocal(tenantId, userId, templateData) {
  const tpls = getLocalTemplates();
  const now = new Date().toISOString();
  if (templateData.id) {
    const idx = tpls.findIndex(t => t.id === templateData.id && (t.tenantId === tenantId || t.userId === userId));
    if (idx !== -1) {
      tpls[idx] = {
        ...tpls[idx],
        name: templateData.name || tpls[idx].name,
        state: templateData.state,
        updatedAt: now
      };
      saveLocalTemplates(tpls);
      return tpls[idx];
    }
  }
  const newTpl = {
    id: 'tpl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    tenantId,
    userId,
    name: templateData.name || 'Мой шаблон письма',
    state: templateData.state,
    createdAt: now,
    updatedAt: now
  };
  tpls.push(newTpl);
  saveLocalTemplates(tpls);
  return newTpl;
}

function deleteTemplateLocal(tenantId, templateId) {
  let tpls = getLocalTemplates();
  const initLen = tpls.length;
  tpls = tpls.filter(t => !(t.id === templateId && (t.tenantId === tenantId || t.userId)));
  if (tpls.length === initLen) throw new Error('Шаблон не найден');
  saveLocalTemplates(tpls);
  return true;
}

// ==================== УНИФИЦИРОВАННЫЙ ЭКСПОРТ ====================
module.exports = {
  isPostgres: () => isPostgres,
  registerUser: (u, p, t) => isPostgres ? registerUserPg(u, p, t) : registerUserLocal(u, p, t),
  loginUser: (u, p) => isPostgres ? loginUserPg(u, p) : loginUserLocal(u, p),
  getUserTemplates: (t) => isPostgres ? getUserTemplatesPg(t) : getUserTemplatesLocal(t),
  saveTemplate: (t, u, d) => isPostgres ? saveTemplatePg(t, u, d) : saveTemplateLocal(t, u, d),
  deleteTemplate: (t, id) => isPostgres ? deleteTemplatePg(t, id) : deleteTemplateLocal(t, id),
  getCustomWidgets: (t) => isPostgres ? getCustomWidgetsPg(t) : Promise.resolve([]),
  getManagers: (t) => isPostgres ? getManagersPg(t) : Promise.resolve([]),
  getDeals: (t) => isPostgres ? getDealsPg(t) : Promise.resolve([]),
  getPayments: (t) => isPostgres ? getPaymentsPg(t) : Promise.resolve([])
};
