# 🏗️ HTML-Shablon — Облачная Инфраструктура

Профессиональный веб-сервис для создания адаптивных HTML-писем с серверной инфраструктурой корпоративного уровня, изоляцией данных арендаторов (Multi-Tenant Row Level Security) и непрерывной доставкой (CI/CD).

---

## 🏛️ Архитектура системы

```
 ┌─────────────────────────────────────────────────────────────┐
 │               Пользователи / Браузеры (Frontend)            │
 │  Лендинг (landing.html) • Каталог (templates) • Редактор    │
 └──────────────────────────────┬──────────────────────────────┘
                                │ HTTPS / JWT Bearer
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                Хостинг Render.com (Web Service)              │
 │  Платформа: Node.js + Express.js                            │
 │  Репозиторий GitHub: HTML-Shablon (ветка main)              │
 │  CI/CD: Автоматический build & deploy при каждом git push    │
 │  REST API: /api/auth, /api/templates, /api/fetch-remote     │
 └──────────────────────────────┬──────────────────────────────┘
                                │ PostgreSQL Client (pg Pool + SSL)
                                │ Сессионная изоляция: app.current_tenant
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                База данных Neon.tech (eu-central-1)         │
 │  Технология: Serverless Cloud PostgreSQL 16+                │
 │  Безопасность: Row Level Security (RLS) изоляция арендаторов│
 │  Таблицы: users, templates                                  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 1. 🗄️ База данных: Cloud PostgreSQL (Neon.tech)

- **Провайдер:** [Neon.tech](https://neon.tech) (Serverless облачный PostgreSQL в регионе `eu-central-1` / Франкфурт).
- **Подключение в коде:** Через библиотеку `pg` (`Pool` из Node Postgres) в файле [`db.js`](file:///c:/Users/User/Desktop/HTML%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80/db.js).
- **Безопасность и изоляция (Row Level Security):**
  На уровне СУБД включена политика RLS. Каждый пользователь/арендатор изолирован и видит **только свои данные** через сессионный параметр `app.current_tenant`:

```sql
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_templates ON templates
    AS PERMISSIVE FOR ALL TO PUBLIC
    USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), ''))
    WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', true), ''));
```

В коде перед выполнением запроса транзакция открывает изолированную сессию:
```javascript
await client.query("SELECT set_config('app.current_tenant', $1, true)", [tenantId]);
```

### Применение схемы (Миграция):
```bash
# Применит schema.sql к вашей облачной базе Neon.tech
npm run db:migrate
```

---

## 2. 🚀 Сервер: Node.js + Express.js на Render.com

- **Среда выполнения:** Node.js 18+ с фреймворком Express.js ([`server.js`](file:///c:/Users/User/Desktop/HTML%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80/server.js)).
- **Раздача статики:** Лендинг (`/`, `/landing`), каталог готовых макетов (`/templates`), визуальный редактор (`/editor`), пресеты и загрузки.
- **Аутентификация:** Полноценный JWT-механизм (JSON Web Tokens) с хешированием паролей через `bcryptjs`. Токен содержит идентификаторы пользователя и его арендатора (`tenantId`).
- **Хостинг:** [Render.com](https://render.com) (Web Service).
- **CI/CD:** Привязка к GitHub-репозиторию `HTML-Shablon`. При каждом `git push` в ветку `main` Render автоматически собирает свежий код (`npm install`) и перезапускает веб-сервис без простоя.

---

## 3. 📡 Спецификация REST API

| Метод | Эндпоинт | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/health` | Публичный | Мониторинг здоровья сервиса для Render.com |
| `POST` | `/api/auth/register` | Публичный | Регистрация пользователя с выдачей JWT |
| `POST` | `/api/auth/login` | Публичный | Вход по логину/паролю с выдачей JWT |
| `GET` | `/api/auth/me` | JWT | Проверка текущей сессии и данных пользователя |
| `POST` | `/api/auth/logout` | Публичный | Завершение сессии и очистка cookies |
| `GET` | `/api/templates` | JWT (RLS) | Получение списка шаблонов арендатора |
| `POST` | `/api/templates` | JWT (RLS) | Создание или обновление шаблона письма |
| `DELETE` | `/api/templates/:id` | JWT (RLS) | Удаление шаблона арендатора |
| `POST` | `/api/fetch-remote` | Публичный | Проксирование картинок и ссылок Яндекс.Диска |

---

## 4. 🛠️ Инструкция по развертыванию

### Шаг 1. Создание БД в Neon.tech
1. Зарегистрируйтесь на [Neon.tech](https://neon.tech) и создайте проект в регионе **Europe (Frankfurt) / eu-central-1**.
2. Скопируйте строку подключения (`Connection Details`):
   ```
   postgres://neondb_owner:YOUR_PASS@ep-xyz.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### Шаг 2. Развертывание на Render.com
1. Зайдите в [Render Dashboard](https://dashboard.render.com).
2. Выберите **New +** -> **Blueprint** (или **Web Service**) и подключите ваш репозиторий GitHub `HTML-Shablon`.
3. Файл [`render.yaml`](file:///c:/Users/User/Desktop/HTML%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80/render.yaml) автоматически сконфигурирует сборку:
   - **Environment:** Node
   - **Region:** Frankfurt (eu-central-1)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
4. В разделе **Environment Variables** укажите переменную:
   - `DATABASE_URL` = `<ваша_ссылка_из_Neon.tech>`
5. Нажмите **Apply / Deploy**.

### Шаг 3. Локальный запуск (Разработка)
```bash
# 1. Установка пакетов
npm install

# 2. Создание файла переменных окружения
cp .env.example .env
# (укажите ваш DATABASE_URL в файле .env)

# 3. Применение схемы к Neon PostgreSQL
npm run db:migrate

# 4. Запуск сервера
npm start
# Сервис будет доступен на http://localhost:3000
```
