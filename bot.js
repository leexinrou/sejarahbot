/**
 * Sejarah Bot — Telegram Bot
 * Uses node-telegram-bot-api (polling mode)
 *
 * Setup:
 *   1. npm install
 *   2. Copy .env.example to .env and fill in your BOT_TOKEN
 *   3. node bot.js
 */

'use strict';

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { createSession, processMessage } = require('./engine');

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error('❌  BOT_TOKEN is not set. Copy .env.example to .env and add your token.');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Store one session per chat ID
const sessions = new Map();

function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, createSession());
  }
  return sessions.get(chatId);
}

// ─────────────────────────────────────────────
// Convert Telegram MarkdownV2 bold (*text* → *text*)
// engine.js uses *text* which Telegram Markdown v1 supports
// ─────────────────────────────────────────────

/**
 * Telegram sendMessage with Markdown formatting.
 * Falls back to plain text if parse_mode fails.
 */
async function sendReply(chatId, text, replyMarkup) {
  const opts = {
    parse_mode: 'Markdown',
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  };
  try {
    await bot.sendMessage(chatId, text, opts);
  } catch {
    // Strip markdown and resend as plain
    const plain = text.replace(/[*_`[\]()~>#+=|{}.!\\]/g, '');
    await bot.sendMessage(chatId, plain, replyMarkup ? { reply_markup: replyMarkup } : {});
  }
}

// ─────────────────────────────────────────────
// Build inline keyboard from quick-reply labels
// (We use a custom reply_keyboard instead — friendlier on mobile)
// ─────────────────────────────────────────────

function buildKeyboard(labels) {
  if (!labels || labels.length === 0) {
    return { remove_keyboard: true };
  }
  // Split into rows of max 2 buttons
  const rows = [];
  for (let i = 0; i < labels.length; i += 2) {
    rows.push(labels.slice(i, i + 2).map(text => ({ text })));
  }
  return {
    keyboard: rows,
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

// ─────────────────────────────────────────────
// /start command
// ─────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const session = getSession(chatId);

  const name = msg.from.first_name ? `, ${msg.from.first_name}` : '';
  const welcome = `👋 Assalamualaikum${name}! Saya *Sejarah Bot*, pembantu ulang kaji anda untuk topik *Kaum-Kaum di Malaysia* 🇲🇾

Saya boleh membantu anda dengan:
📖 Penerangan subtopik
✏️ Soalan latihan

Taip *"menu"* untuk lihat semua topik, atau terus tanya seperti:
• "Terangkan kedatangan kaum Cina"
• "Apakah dasar pecah dan perintah?"
• "Bagi saya soalan latihan"`;

  const keyboard = buildKeyboard(['Menu topik', 'Kaum Cina', 'Kaum India', 'Dasar British']);
  await sendReply(chatId, welcome, keyboard);
});

// ─────────────────────────────────────────────
// /help command
// ─────────────────────────────────────────────

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  await sendReply(chatId, `*Sejarah Bot — Cara Penggunaan*\n\n• Tanya soalan dalam Bahasa Melayu atau Inggeris\n• Taip *"menu"* untuk senarai topik\n• Taip *"latihan"* untuk soalan latihan (selepas memilih topik)\n• Taip *"jawapan"* untuk semak jawapan anda\n• Taip *"latihan lagi"* untuk soalan seterusnya\n\n*Topik yang tersedia:*\n1️⃣ Asal usul masyarakat majmuk\n2️⃣ Kedatangan kaum Cina\n3️⃣ Kedatangan kaum India\n4️⃣ Orang Melayu dalam masyarakat majmuk\n5️⃣ Dasar British: Pecah dan Perintah\n6️⃣ Kerjasama kaum & kemerdekaan\n7️⃣ Kesan utama`, buildKeyboard(['Menu topik', 'Kaum Cina', 'Dasar British', 'Kemerdekaan']));
});

// ─────────────────────────────────────────────
// /reset command — clear session
// ─────────────────────────────────────────────

bot.onText(/\/reset/, async (msg) => {
  const chatId = msg.chat.id;
  sessions.delete(chatId);
  await sendReply(chatId, '🔄 Sesi telah ditetapkan semula. Taip /start untuk mula semula.', { remove_keyboard: true });
});

// ─────────────────────────────────────────────
// All text messages
// ─────────────────────────────────────────────

bot.on('message', async (msg) => {
  if (!msg.text) return;              // ignore non-text (photos, stickers, etc.)
  if (msg.text.startsWith('/')) return; // commands handled above

  const chatId = msg.chat.id;
  const session = getSession(chatId);

  // Show "typing…" indicator
  bot.sendChatAction(chatId, 'typing');

  // Small delay to feel more natural
  await new Promise(r => setTimeout(r, 600));

  const reply = processMessage(session, msg.text);

  // Derive quick-reply buttons based on context keywords in the reply
  const qrLabels = deriveQuickReplies(reply, session);
  const keyboard = buildKeyboard(qrLabels);

  await sendReply(chatId, reply, keyboard);
});

// ─────────────────────────────────────────────
// Derive quick-reply suggestions from bot reply text
// ─────────────────────────────────────────────

function deriveQuickReplies(replyText, session) {
  const t = replyText.toLowerCase();

  if (t.includes('minta jawapan') || t.includes('taip "jawapan"') || t.includes('taip jawapan')) {
    return ['Jawapan', 'Latihan lagi', 'Menu topik'];
  }
  if (t.includes('latihan lagi') || t.includes('soalan seterusnya')) {
    return ['Latihan lagi', 'Menu topik'];
  }
  if (t.includes('soalan latihan untuk topik mana') || t.includes('latihan untuk topik')) {
    return ['Soalan latihan Cina', 'Soalan latihan India', 'Soalan latihan British'];
  }
  if (t.includes('hubungi guru')) {
    return ['Menu topik'];
  }
  if (t.includes('mahu mencuba') || t.includes('latihan') && session.lastTopic) {
    return ['Latihan', 'Menu topik'];
  }
  if (t.includes('topik ini merangkumi') || t.includes('1️⃣') || t.includes('menu')) {
    return ['Kaum Cina', 'Kaum India', 'Dasar British', 'Kemerdekaan'];
  }
  return ['Menu topik'];
}

// ─────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────

bot.on('polling_error', (err) => {
  console.error('Polling error:', err.code, err.message);
});

bot.on('error', (err) => {
  console.error('Bot error:', err.message);
});

console.log('🤖 Sejarah Bot is running via Telegram polling...');
console.log('   Press Ctrl+C to stop.');
