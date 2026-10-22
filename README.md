# Sejarah Bot 🇲🇾

An academic support chatbot for Malaysian History students covering **Kaum-Kaum di Malaysia** (DSKP Sejarah). Available as:

- **Web chat** — open `index.html` in any browser, no server needed
- **Telegram bot** — connect via BotFather, run `node bot.js`

No LLM API required — fully rule-based.

---

## Quick Start

### Web Interface

Just open `index.html` directly in your browser. No installation required.

To serve it properly over a local network (e.g. for classroom use):

```bash
cd sejarah-bot
npx serve . -p 3000
# Open http://localhost:3000
```

---

### Telegram Bot

#### Step 1 — Create your bot with BotFather

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts — choose a name (e.g. `Sejarah Bot`) and a username (e.g. `sejarahmy_bot`)
4. Copy the **API token** BotFather gives you

#### Step 2 — Configure the project

```bash
cd sejarah-bot
cp .env.example .env
```

Edit `.env` and paste your token:

```
BOT_TOKEN=123456789:AAF...your_token_here
```

#### Step 3 — Install dependencies and run

```bash
npm install
npm start
```

The bot will start polling. Search for your bot on Telegram and send `/start`.

---

## Bot Commands (Telegram)

| Command | Description |
|---------|-------------|
| `/start` | Welcome message + quick-reply buttons |
| `/help`  | Usage guide and topic list |
| `/reset` | Clear your session and start fresh |

---

## Topics Covered

| # | Subtopic |
|---|----------|
| 1 | Asal usul masyarakat majmuk |
| 2 | Kedatangan kaum Cina ke Tanah Melayu |
| 3 | Kedatangan kaum India ke Tanah Melayu |
| 4 | Orang Melayu dalam konteks masyarakat majmuk |
| 5 | Dasar British: Pecah dan Perintah |
| 6 | Kerjasama kaum menuju kemerdekaan (Parti Perikatan) |
| 7 | Kesan utama pembentukan masyarakat majmuk |

---

## Bot Behaviour

- **Slot filling**: If no topic is specified, the bot asks which subtopic to review
- **Escalation**: Declines exam/assignment help and redirects to a teacher
- **Fallback**: After 2 unrecognised inputs, escalates to teacher contact
- **Out-of-scope guard**: Refuses topics outside the DSKP scope

---

## File Structure

```
sejarah-bot/
├── index.html      ← Standalone web chat (no server needed)
├── bot.js          ← Telegram bot entry point
├── engine.js       ← Shared rule-based logic & knowledge base
├── package.json
├── .env.example    ← Copy to .env and fill in your BOT_TOKEN
└── README.md
```

---

## Deploying to a Server (Optional)

To keep the Telegram bot running 24/7, deploy `bot.js` to any Node.js host:

- **Railway / Render / Fly.io** — free tiers available
- **VPS** — use `pm2` to keep it alive:

```bash
npm install -g pm2
pm2 start bot.js --name sejarah-bot
pm2 save
```

For the web interface, any static host works (Netlify, GitHub Pages, Vercel).
