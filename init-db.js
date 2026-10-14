/**
 * Скрипт миграции и инициализации схемы БД в Neon.tech PostgreSQL
 * Запуск: node init-db.js или npm run db:migrate
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function initDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.log('⚠️  Внимание: переменная окружения DATABASE_URL не задана!');
    console.log('👉 Укажите строку подключения Neon PostgreSQL в файле .env или Render Dashboard:');
    console.log('   DATABASE_URL=postgres://user:password@ep-xyz.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    process.exit(0);
  }

  console.log('🔌 Подключение к облачному PostgreSQL (Neon.tech)...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Успешное соединение с сервером базы данных!');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🚀 Применение схемы таблиц и политик RLS (Row Level Security)...');
    await client.query(sql);

    console.log('🎉 Схема PostgreSQL успешно развернута!');
    console.log('   - Таблицы: users, templates, custom_widgets, managers, deals, payments');
    console.log('   - Политика RLS: app.current_tenant активирована на всех таблицах');

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Ошибка при инициализации базы данных:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  initDb();
}

module.exports = initDb;
