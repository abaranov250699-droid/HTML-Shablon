require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mailcraft_secret_jwt_key_2026_render_neon';

// Папка для загрузки изображений
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Аутентификация через JWT токен
function authMiddleware(req, res, next) {
  let token = null;
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация (отсутствует JWT токен)' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, username, tenantId }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный или истекший JWT токен: ' + err.message });
  }
}

// Опциональный аутентификатор (для чтения публичных данных)
function optionalAuthMiddleware(req, res, next) {
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
}

// ==================== REST API: AUTH (JWT) ====================

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, tenantId } = req.body;
    if (!username || !password || username.trim().length < 3 || password.length < 4) {
      return res.status(400).json({ error: 'Логин должен быть от 3 символов, пароль от 4 символов' });
    }

    const user = await db.registerUser(username, password, tenantId);

    // Генерация JWT токена с сессией tenant
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        tenantId: user.tenant_id || user.tenantId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        tenantId: user.tenant_id || user.tenantId
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Укажите логин и пароль' });
    }

    const user = await db.loginUser(username, password);

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        tenantId: user.tenantId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        tenantId: user.tenantId
      }
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

// Проверка сессии пользователя
app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({
    authenticated: true,
    user: req.user
  });
});

// Выход
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Вы успешно вышли' });
});

// ==================== REST API: TEMPLATES (RLS ИЗОЛЯЦИЯ) ====================

// Получение списка шаблонов арендатора
app.get('/api/templates', authMiddleware, async (req, res) => {
  try {
    const templates = await db.getUserTemplates(req.user.tenantId);
    return res.json({ success: true, templates });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка получения шаблонов: ' + err.message });
  }
});

// Сохранение или обновление шаблона
app.post('/api/templates', authMiddleware, async (req, res) => {
  try {
    const templateData = req.body;
    if (!templateData || !templateData.state) {
      return res.status(400).json({ error: 'Не переданы данные шаблона' });
    }

    const saved = await db.saveTemplate(req.user.tenantId, req.user.userId, templateData);
    return res.json({ success: true, template: saved });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сохранения: ' + err.message });
  }
});

// Удаление шаблона
app.delete('/api/templates/:id', authMiddleware, async (req, res) => {
  try {
    await db.deleteTemplate(req.user.tenantId, req.params.id);
    return res.json({ success: true, message: 'Шаблон удален' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ==================== БИЗНЕС-МОДУЛИ СЕРВИСА ====================

// Кастомные виджеты
app.get('/api/custom-widgets', authMiddleware, async (req, res) => {
  try {
    const widgets = await db.getCustomWidgets(req.user.tenantId);
    return res.json({ success: true, widgets });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Менеджеры
app.get('/api/managers', authMiddleware, async (req, res) => {
  try {
    const managers = await db.getManagers(req.user.tenantId);
    return res.json({ success: true, managers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Сделки
app.get('/api/deals', authMiddleware, async (req, res) => {
  try {
    const deals = await db.getDeals(req.user.tenantId);
    return res.json({ success: true, deals });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Платежи
app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    const payments = await db.getPayments(req.user.tenantId);
    return res.json({ success: true, payments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== СКАЧИВАНИЕ ИЗОБРАЖЕНИЙ / PROXY ====================

function fetchBufferWithRedirects(targetUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Слишком много перенаправлений'));

    let urlObj;
    try {
      urlObj = new URL(targetUrl);
    } catch (e) {
      return reject(new Error('Некорректный URL: ' + targetUrl));
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, targetUrl).href;
        return fetchBufferWithRedirects(nextUrl, maxRedirects - 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Сервер вернул код ${res.statusCode}`));
      }

      const contentType = res.headers['content-type'] || 'image/png';
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType }));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Таймаут соединения'));
    });
  });
}

async function resolveYandexDiskUrl(publicUrl) {
  const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicUrl)}`;
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.href) resolve(json.href);
          else reject(new Error(json.message || 'Не удалось получить прямую ссылку от Яндекс.Диска'));
        } catch (e) {
          reject(new Error('Ошибка ответа Яндекс.Диска: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

app.post('/api/fetch-remote', async (req, res) => {
  try {
    let targetUrl = (req.body.url || '').trim();
    if (!targetUrl) return res.status(400).json({ error: 'Ссылка пустая' });

    if (targetUrl.includes('disk.yandex') || targetUrl.includes('yadi.sk')) {
      targetUrl = await resolveYandexDiskUrl(targetUrl);
    }

    const { buffer, contentType } = await fetchBufferWithRedirects(targetUrl);

    let ext = '.png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
    else if (contentType.includes('svg')) ext = '.svg';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('gif')) ext = '.gif';

    const safeName = `remote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const savePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(savePath, buffer);

    const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
    const localUrl = `/uploads/${safeName}`;

    return res.json({
      success: true,
      url: localUrl,
      base64: base64Data
    });
  } catch (err) {
    return res.status(500).json({ error: 'Не удалось загрузить: ' + err.message });
  }
});

// ==================== HEALTHCHECK ДЛЯ RENDER.COM ====================
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    service: 'HTML-Shablon',
    database: db.isPostgres() ? 'neon-cloud-postgresql (eu-central-1)' : 'local-storage',
    rls: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==================== РАЗДАЧА СТАТИЧЕСКИХ ФАЙЛОВ И РОУТИНГ ====================

app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Главные страницы сервиса
app.get(['/', '/landing'], (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates.html'));
});

app.get(['/editor', '/editor.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 обработчик
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'landing.html'));
});

// Запуск сервера
const serverInstance = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Email Builder Web Service запущен на порту: ${PORT}`);
  console.log(`🔗 Локальный адрес: http://localhost:${PORT}`);
  console.log(`☁️  СУБД: ${db.isPostgres() ? 'PostgreSQL (Neon.tech, RLS активен)' : 'Локальный режим'}`);
  console.log('====================================================');
});

// Безопасное завершение процессов при перезапуске Render.com
process.on('SIGTERM', () => {
  console.log('SIGTERM сигнал получен. Завершение работы...');
  serverInstance.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT сигнал получен. Завершение работы...');
  serverInstance.close(() => process.exit(0));
});

module.exports = app;
