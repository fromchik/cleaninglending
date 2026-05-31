# Cleaning Landing MVP

MVP для хімчистки меблів: продаючий лендинг, форма заявки з фото та Telegram-адмінка власника.

## Стек

- Frontend: React, Vite, TypeScript, Tailwind
- Backend: Node.js, Express, TypeScript
- База даних: SQLite
- Фото: `multipart/form-data`
- Telegram: Bot API

## Встановлення

```bash
cd server
npm install

cd ../client
npm install
```

## Env

Скопіюйте `.env.example` у `server/.env` і заповніть Telegram-поля:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

DATABASE_PATH=./data/cleaning.sqlite
UPLOAD_DIR=./uploads

TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=

MAX_PHOTOS=6
MAX_FILE_SIZE_MB=10
```

`TELEGRAM_BOT_TOKEN` створюється через BotFather. `TELEGRAM_ADMIN_CHAT_ID` можна дізнатися через тимчасовий лог вхідних повідомлень або сторонній get-id bot.

## Запуск

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Відкрийте `http://localhost:5173`.

## Перевірка

1. Відкрийте лендинг.
2. Натисніть “Розрахувати ціну за фото”.
3. Заповніть послугу, район, телефон, коментар.
4. Додайте кілька фото.
5. Надішліть форму.
6. Перевірте, що заявка з'явилася в Telegram.
7. Натисніть кнопки статусів у Telegram.
8. Надішліть `/leads`, щоб побачити останні 10 заявок.

## Static Vercel release

The current Vercel release deploys only `client`. The form validates locally and does not send personal data or photos. The preserved `server` directory is a dormant base for a future backend integration.

1. Import the repository into Vercel.
2. Set **Root Directory** to `client`.
3. Keep **Framework Preset** as `Vite`.
4. Use `npm run build` and the `dist` output directory.
5. Deploy without environment variables.

The generated `*.vercel.app` address includes HTTPS automatically. The VPS instructions below remain available for the later server-backed version.

## Production

Для швидкого production-деплою краще використовувати VPS:

1. Встановити Node.js і PM2.
2. Завантажити `server` і `client`.
3. Зібрати frontend: `cd client && npm run build`.
4. Зібрати backend: `cd server && npm run build`.
5. Налаштувати `.env` у `server`.
6. Запустити backend через PM2.
7. Налаштувати Nginx reverse proxy і HTTPS через Certbot.

SQLite і `server/uploads` мають зберігатися на постійному диску. Serverless-платформи для цього MVP не підходять.
