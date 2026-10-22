/**
 * Sejarah Bot — Rule-based engine (no LLM)
 * Shared between the web UI and the Telegram bot.
 *
 * Usage:
 *   const { createSession, processMessage } = require('./engine');
 *   const session = createSession();
 *   const reply = processMessage(session, userInput);
 */

'use strict';

// ─────────────────────────────────────────────
// Knowledge base
// ─────────────────────────────────────────────

const KNOWLEDGE = {
  overview: {
    keywords: ['topik', 'overview', 'keseluruhan', 'masyarakat majmuk', 'plural society', 'kaum di malaysia', 'kaum-kaum', 'ringkasan', 'summary', 'apa yang', 'terangkan topik'],
    title: 'Topik: Kaum-Kaum di Malaysia & Masyarakat Majmuk',
    content: `📚 *Topik: Kaum-Kaum di Malaysia & Masyarakat Majmuk*

Topik ini merangkumi:
1️⃣ Asal usul masyarakat majmuk di Tanah Melayu
2️⃣ Sebab kedatangan kaum Cina ke Tanah Melayu
3️⃣ Sebab kedatangan kaum India ke Tanah Melayu
4️⃣ Dasar British: Pecah dan Perintah
5️⃣ Hubungan antara kaum semasa penjajahan British
6️⃣ Kerjasama kaum menuju kemerdekaan (Parti Perikatan)

Taip nombor atau nama subtopik untuk penerangan lanjut. Contoh: "kaum Cina" atau "dasar British".`,
    subtopics: ['cina', 'india', 'melayu', 'dasar', 'perikatan', 'kemerdekaan', 'masyarakat majmuk'],
  },

  asal_masyarakat_majmuk: {
    keywords: ['asal usul', 'asal', 'usul', 'bagaimana terbentuk', 'kenapa ada pelbagai', 'mengapa ada pelbagai kaum', 'terbentuk', 'pembentukan masyarakat'],
    title: 'Asal Usul Masyarakat Majmuk',
    content: `🏛️ *Asal Usul Masyarakat Majmuk di Tanah Melayu*

Masyarakat majmuk terbentuk akibat dasar penjajahan British yang menggalakkan penghijrahan masuk kaum lain ke Tanah Melayu.

📌 *Faktor utama:*
• British memerlukan tenaga buruh murah untuk industri perlombongan bijih timah dan ladang getah
• Kaum Cina dibawa masuk terutama untuk kerja lombong
• Kaum India dibawa masuk terutama untuk kerja ladang getah
• Orang Melayu kekal sebagai petani dan nelayan di kawasan luar bandar

📌 *Akibatnya:*
• Setiap kaum tinggal dalam kawasan berasingan
• Setiap kaum mempunyai sistem pendidikan, bahasa, dan budaya sendiri
• Interaksi antara kaum adalah terhad — inilah ciri utama masyarakat majmuk

💡 *Masyarakat majmuk* = masyarakat yang terdiri daripada pelbagai kaum yang hidup bersama tetapi tidak bercampur secara menyeluruh.`,
  },

  kaum_cina: {
    keywords: ['cina', 'china', 'tionghua', 'cina datang', 'kedatangan cina', 'mengapa cina', 'kenapa cina', 'sebab cina'],
    title: 'Kedatangan Kaum Cina ke Tanah Melayu',
    content: `🟡 *Kedatangan Kaum Cina ke Tanah Melayu*

📌 *Sebab-sebab kedatangan:*
• *Tolak (Push factors):* Kemiskinan, kebuluran, dan kekacauan politik di negara China (Dynasty Qing runtuh, Perang Candu)
• *Tarik (Pull factors):* Peluang ekonomi di Tanah Melayu — terutama industri perlombongan bijih timah di Perak dan Selangor

📌 *Peranan utama kaum Cina:*
• Buruh lombong bijih timah
• Pedagang dan peniaga di bandar
• Membuka kedai dan perniagaan kecil

📌 *Kawasan penempatan:*
• Kawasan perlombongan: Larut, Kuala Lumpur, Taiping
• Kawasan bandar: Georgetown (Pulau Pinang), Kuala Lumpur

📌 *Impak:*
• Pertumbuhan pesat ekonomi bijih timah
• Pembentukan bandar-bandar baru di Tanah Melayu
• Terbentuknya komuniti Cina yang tersendiri (Kongsi Gelap, Persatuan Cina)`,
  },

  kaum_india: {
    keywords: ['india', 'tamil', 'india datang', 'kedatangan india', 'mengapa india', 'kenapa india', 'sebab india', 'ladang getah'],
    title: 'Kedatangan Kaum India ke Tanah Melayu',
    content: `🟠 *Kedatangan Kaum India ke Tanah Melayu*

📌 *Sebab-sebab kedatangan:*
• *Tolak (Push factors):* Kemiskinan dan kekurangan tanah di India Selatan (terutama Tamil Nadu)
• *Tarik (Pull factors):* Permintaan tinggi buruh untuk ladang getah yang sedang berkembang pesat

📌 *Sistem pengambilan:*
• *Sistem Kangani* — Ketua buruh (kangani) dihantar ke India untuk merekrut pekerja
• *Sistem kontrak* — Pekerja terikat kontrak bekerja di ladang

📌 *Peranan utama kaum India:*
• Buruh ladang getah
• Tukang besi, buruh pembinaan jalan kereta api
• Sebahagian kecil menjadi profesional (doktor, peguam) dan berkhidmat dalam kerajaan British

📌 *Kawasan penempatan:*
• Ladang-ladang getah di Perak, Selangor, Johor, Negeri Sembilan
• Kawasan bandar: Kuala Lumpur (buruh pembinaan)

📌 *Impak:*
• Industri getah berkembang menjadi sumber pendapatan utama Tanah Melayu
• Komuniti India tertumpu di ladang — terasing dari masyarakat lain`,
  },

  kaum_melayu: {
    keywords: ['melayu', 'orang melayu', 'bumiputera', 'penduduk asal', 'kaum melayu'],
    title: 'Orang Melayu dalam Konteks Masyarakat Majmuk',
    content: `🟢 *Orang Melayu dalam Masyarakat Majmuk*

📌 *Kedudukan orang Melayu semasa British:*
• Penduduk asal (bumiputera) Tanah Melayu
• British mengiktiraf raja-raja Melayu melalui Sistem Residen
• Orang Melayu digalakkan kekal dalam sektor pertanian dan perikanan

📌 *Dasar British terhadap orang Melayu:*
• British tidak menggalakkan orang Melayu berhijrah ke bandar
• Orang Melayu ditempatkan di kawasan luar bandar
• Peluang pendidikan terhad kepada sekolah Melayu sahaja (tidak ke sekolah Inggeris dengan mudah)

📌 *Akibat:*
• Orang Melayu ketinggalan dalam bidang ekonomi berbanding kaum Cina
• Jurang ekonomi antara orang Melayu dan bukan Melayu semakin melebar
• Ini menjadi isu utama dalam perundingan kemerdekaan kemudiannya`,
  },

  dasar_british: {
    keywords: ['dasar british', 'pecah dan perintah', 'divide and rule', 'dasar penjajah', 'british', 'penjajahan', 'kolonial', 'strategi british'],
    title: 'Dasar British: Pecah dan Perintah',
    content: `⚖️ *Dasar British: Pecah dan Perintah (Divide and Rule)*

📌 *Apakah dasar ini?*
British sengaja mengasingkan kaum-kaum di Tanah Melayu supaya mereka tidak bersatu dan mudah diperintah.

📌 *Cara pelaksanaan:*
• *Kawasan berasingan:* Melayu di kampung, Cina di lombong/bandar, India di ladang
• *Pekerjaan berasingan:* Setiap kaum dikhaskan untuk sektor ekonomi tertentu
• *Sekolah berasingan:* Sekolah Melayu, Sekolah Cina, Sekolah Tamil — bahasa pengantar berbeza
• *Undang-undang berbeza:* Hukum adat Melayu, undang-undang ladang untuk India

📌 *Kesan dasar ini:*
• Setiap kaum hidup dalam "dunia" tersendiri tanpa banyak interaksi
• Timbul stereotaip dan prejudis antara kaum
• Jurang sosial dan ekonomi semakin melebar
• Orang Melayu merasa terancam dengan kehadiran kaum pendatang

💡 *Ini adalah asas kepada cabaran perpaduan kaum yang Malaysia hadapi hingga kini.*`,
  },

  kerjasama_kemerdekaan: {
    keywords: ['kemerdekaan', 'merdeka', 'kerjasama kaum', 'bersatu', 'parti perikatan', 'perikatan', 'umno', 'mca', 'mic', 'tolak ansur', 'kontrak sosial', 'perpaduan'],
    title: 'Kerjasama Kaum Menuju Kemerdekaan',
    content: `🇲🇾 *Kerjasama Kaum Menuju Kemerdekaan*

📌 *Parti Perikatan (1955)*
Gabungan tiga parti mewakili tiga kaum utama:
• *UMNO* (United Malays National Organisation) — Orang Melayu
• *MCA* (Malayan Chinese Association) — Kaum Cina
• *MIC* (Malayan Indian Congress) — Kaum India

📌 *Prinsip Tolak Ansur (Compromise):*
• Kaum Cina dan India bersetuju menerima kedudukan istimewa orang Melayu sebagai bumiputera
• Orang Melayu bersetuju memberikan hak kewarganegaraan kepada kaum Cina dan India
• Bahasa Melayu dijadikan bahasa kebangsaan, tetapi bahasa lain boleh digunakan

📌 *Kontrak Sosial:*
• Perjanjian tidak bertulis antara kaum sebagai asas penubuhan negara Malaysia yang merdeka
• Menjadi asas Perlembagaan Malaysia 1957

📌 *Kemerdekaan 31 Ogos 1957:*
• Hasil kerjasama dan semangat tolak ansur antara kaum
• Membuktikan perpaduan kaum boleh dicapai melalui rundingan dan hormat menghormati

✨ *Mesej utama:* Kemerdekaan dicapai BUKAN melalui konflik, tetapi melalui *tolak ansur dan kerjasama.*`,
  },

  kesan_utama: {
    keywords: ['kesan', 'impak', 'akibat', 'effect', 'hasil', 'apa kesan', 'apakah kesan'],
    title: 'Kesan Utama Pembentukan Masyarakat Majmuk',
    content: `📊 *Kesan Utama Pembentukan Masyarakat Majmuk*

📌 *Kesan Ekonomi:*
• Malaysia berkembang menjadi pengeluar bijih timah dan getah terbesar dunia
• Ekonomi pelbagai sektor berkembang pesat semasa penjajahan British
• Namun, kekayaan tidak diagihkan secara sama rata antara kaum

📌 *Kesan Sosial:*
• Wujud jurang sosial dan budaya yang ketara antara kaum
• Setiap kaum mengekalkan bahasa, agama, dan adat resam tersendiri
• Interaksi antara kaum sangat terhad — sekolah, kawasan, dan pekerjaan berasingan

📌 *Kesan Politik:*
• Wujud kesedaran kebangsaan dalam kalangan semua kaum pada akhir era penjajahan
• Kaum-kaum bersatu dalam Parti Perikatan untuk menuntut kemerdekaan
• Perpaduan kaum menjadi asas penubuhan Malaysia sebagai negara merdeka

📌 *Kesan Jangka Panjang:*
• Dasar Ekonomi Baru (DEB) 1971 untuk menangani jurang ekonomi
• Keperluan berterusan untuk memupuk perpaduan kaum di Malaysia`,
  },
};

// ─────────────────────────────────────────────
// Practice questions per subtopic
// ─────────────────────────────────────────────

const PRACTICE_QUESTIONS = {
  kaum_cina: [
    { q: 'Nyatakan DUA faktor tolak yang menyebabkan kaum Cina berhijrah ke Tanah Melayu.', a: 'Faktor tolak: (1) Kemiskinan dan kebuluran di China; (2) Kekacauan politik — runtuhnya Dynasty Qing dan perang saudara.' },
    { q: 'Apakah sektor ekonomi utama yang dimainkan oleh kaum Cina di Tanah Melayu?', a: 'Perlombongan bijih timah dan perniagaan/perdagangan di kawasan bandar.' },
  ],
  kaum_india: [
    { q: 'Terangkan sistem Kangani yang digunakan untuk membawa buruh India ke Tanah Melayu.', a: 'Sistem Kangani — seorang ketua buruh (kangani) dihantar ke India untuk merekrut pekerja ladang getah dengan tawaran pekerjaan dan penginapan.' },
    { q: 'Di kawasan manakah kebanyakan kaum India menetap di Tanah Melayu?', a: 'Ladang-ladang getah di negeri Perak, Selangor, Johor, dan Negeri Sembilan.' },
  ],
  dasar_british: [
    { q: 'Apakah yang dimaksudkan dengan dasar "Pecah dan Perintah" British?', a: 'Dasar British mengasingkan kaum-kaum mengikut kawasan, pekerjaan, dan sistem pendidikan supaya mereka tidak bersatu dan mudah diperintah.' },
    { q: 'Berikan DUA cara British melaksanakan dasar pecah dan perintah.', a: '(1) Mengasingkan kaum mengikut kawasan — Melayu di kampung, Cina di lombong, India di ladang; (2) Menyediakan sekolah berasingan dengan bahasa pengantar berbeza.' },
  ],
  kerjasama_kemerdekaan: [
    { q: 'Apakah tiga parti yang membentuk Parti Perikatan pada tahun 1955?', a: 'UMNO (Melayu), MCA (Cina), dan MIC (India).' },
    { q: 'Jelaskan prinsip tolak ansur yang diamalkan oleh kaum-kaum dalam Parti Perikatan.', a: 'Kaum Cina dan India menerima kedudukan istimewa orang Melayu; orang Melayu pula bersetuju memberikan kewarganegaraan kepada kaum Cina dan India.' },
  ],
  asal_masyarakat_majmuk: [
    { q: 'Mengapakah masyarakat majmuk terbentuk di Tanah Melayu?', a: 'Kerana dasar penjajahan British yang membawa masuk kaum Cina dan India sebagai buruh untuk industri perlombongan bijih timah dan ladang getah.' },
    { q: 'Apakah ciri utama masyarakat majmuk?', a: 'Masyarakat terdiri daripada pelbagai kaum yang hidup bersama tetapi tidak bercampur — setiap kaum mengekalkan bahasa, budaya, dan agama tersendiri.' },
  ],
};

// ─────────────────────────────────────────────
// Session management
// ─────────────────────────────────────────────

function createSession() {
  return {
    fallbackCount: 0,
    lastTopic: null,
    _pendingQuestion: null,
  };
}

// ─────────────────────────────────────────────
// Intent matching helpers
// ─────────────────────────────────────────────

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchIntent(text) {
  const t = normalize(text);

  // Greetings
  if (/\b(hi|hello|helo|hai|assalamualaikum|salam|selamat|apa khabar)\b/.test(t)) return 'greeting';

  // Practice / soalan latihan
  if (/\b(latihan|soalan|practice|quiz|cuba|test|tanya|contoh soalan|soal)\b/.test(t)) return 'practice';

  // Help / menu
  if (/\b(help|tolong|bantuan|menu|pilihan|boleh bantu|apa yang awak boleh|apa boleh)\b/.test(t)) return 'help';

  // Goodbye
  if (/\b(bye|terima kasih|thanks|thank you|selesai|habis|ok dah|sudah|cukup)\b/.test(t)) return 'bye';

  // Topic matching
  for (const [key, topic] of Object.entries(KNOWLEDGE)) {
    for (const kw of topic.keywords) {
      if (t.includes(kw)) return key;
    }
  }

  return null;
}

function pickPracticeQuestion(topicKey) {
  const qs = PRACTICE_QUESTIONS[topicKey];
  if (!qs) return null;
  return qs[Math.floor(Math.random() * qs.length)];
}

// ─────────────────────────────────────────────
// Escalation check
// ─────────────────────────────────────────────

const ESCALATION_KEYWORDS = [
  'peperiksaan sebenar', 'exam sebenar', 'soalan peperiksaan', 'tugasan', 'assignment',
  'pt3', 'spm', 'upsr', 'jawab esei', 'tulis esei', 'buat esei', 'hantar',
  'markah', 'gred', 'grade', 'jawapan penuh',
];

const OUT_OF_SCOPE_KEYWORDS = [
  'perang dunia', 'revolusi perancis', 'sejarah eropah', 'sejarah china', 'sejarah india',
  'tamadun', 'greek', 'rom', 'ottoman', 'matematik', 'sains', 'fizik', 'kimia', 'biologi',
  'geografi', 'ekonomi', 'english', 'bahasa inggeris',
];

function checkEscalation(text) {
  const t = normalize(text);
  if (ESCALATION_KEYWORDS.some(kw => t.includes(kw))) return 'exam';
  if (OUT_OF_SCOPE_KEYWORDS.some(kw => t.includes(kw))) return 'outofscope';
  return null;
}

// ─────────────────────────────────────────────
// Main response processor
// ─────────────────────────────────────────────

function processMessage(session, rawInput) {
  if (!rawInput || !rawInput.trim()) {
    return 'Sila taip soalan atau topik yang ingin awak ulang kaji. 😊';
  }

  const input = rawInput.trim();

  // --- Escalation guard ---
  const escalation = checkEscalation(input);
  if (escalation === 'exam') {
    return `⚠️ Maaf, saya tidak boleh membantu menjawab soalan peperiksaan sebenar atau tugasan bergred.

Untuk soalan peperiksaan atau tugasan, sila hubungi guru Sejarah anda melalui WhatsApp:
👉 https://wa.me/60111234567

Saya boleh membantu awak *memahami* dan *mengulang kaji* topik ini. Cuba tanya: "Terangkan kedatangan kaum Cina" atau "Bagi saya soalan latihan tentang dasar British."`;
  }

  if (escalation === 'outofscope') {
    return `⚠️ Maaf, saya hanya boleh membantu dengan topik *Kaum-Kaum di Malaysia* dalam skop DSKP Sejarah.

Untuk topik lain, sila hubungi guru anda melalui WhatsApp:
👉 https://wa.me/60111234567

Topik yang saya boleh bantu:\n• Asal usul masyarakat majmuk\n• Kedatangan kaum Cina & India\n• Dasar British (Pecah dan Perintah)\n• Kerjasama kaum & kemerdekaan`;
  }

  const intent = matchIntent(input);

  // --- Greetings ---
  if (intent === 'greeting') {
    session.fallbackCount = 0;
    return `👋 Assalamualaikum! Saya *Sejarah Bot*, pembantu ulang kaji anda untuk topik *Kaum-Kaum di Malaysia*.

Saya boleh membantu anda dengan:
📖 Penerangan subtopik
✏️ Soalan latihan

Taip *"menu"* untuk lihat semua topik, atau terus tanya seperti:
• "Terangkan kedatangan kaum Cina"
• "Apakah dasar pecah dan perintah?"
• "Bagi saya soalan latihan"`;
  }

  // --- Help / Menu ---
  if (intent === 'help') {
    session.fallbackCount = 0;
    return KNOWLEDGE.overview.content;
  }

  // --- Goodbye ---
  if (intent === 'bye') {
    session.fallbackCount = 0;
    return `🎓 Terima kasih kerana menggunakan Sejarah Bot! Semoga berjaya dalam ulang kaji awak.\n\nIngat: *Ilmu adalah pelaburan terbaik!* 📚\n\nJika ada soalan lagi, saya sedia membantu.`;
  }

  // --- Practice questions ---
  if (intent === 'practice') {
    session.fallbackCount = 0;
    const topicKey = session.lastTopic;

    if (!topicKey || !PRACTICE_QUESTIONS[topicKey]) {
      // Ask which topic
      return `✏️ Soalan latihan untuk topik mana?\n\n1️⃣ Asal usul masyarakat majmuk\n2️⃣ Kedatangan kaum Cina\n3️⃣ Kedatangan kaum India\n4️⃣ Dasar British (Pecah dan Perintah)\n5️⃣ Kerjasama kaum & kemerdekaan\n\nContoh: "Soalan latihan kaum Cina"`;
    }

    const pq = pickPracticeQuestion(topicKey);
    if (!pq) return 'Maaf, soalan latihan untuk topik ini belum tersedia.';

    session._pendingQuestion = pq;
    return `✏️ *Soalan Latihan:*\n\n${pq.q}\n\n_(Cuba jawab sendiri dahulu, kemudian taip "jawapan" untuk semak.)_`;
  }

  // --- "jawapan" keyword to reveal answer ---
  if (/\b(jawapan|answer|semak|check|tunjuk jawapan)\b/.test(normalize(input))) {
    if (session._pendingQuestion) {
      const pq = session._pendingQuestion;
      session._pendingQuestion = null;
      return `✅ *Jawapan:*\n${pq.a}\n\nTaip "latihan lagi" untuk soalan seterusnya, atau tanya subtopik lain!`;
    }
    return 'Taip soalan atau topik dahulu, kemudian minta jawapan. 😊';
  }

  // --- "latihan lagi" ---
  if (/latihan lagi|soalan lagi|next question/.test(normalize(input))) {
    const topicKey = session.lastTopic;
    if (topicKey && PRACTICE_QUESTIONS[topicKey]) {
      const pq = pickPracticeQuestion(topicKey);
      session._pendingQuestion = pq;
      return `✏️ *Soalan Latihan (${KNOWLEDGE[topicKey]?.title || topicKey}):*\n\n${pq.q}\n\n_(Taip "jawapan" untuk semak jawapan anda.)_`;
    }
    return 'Taip nama subtopik dahulu untuk mendapatkan soalan latihan berkaitan.';
  }

  // --- Knowledge topic match ---
  if (intent && KNOWLEDGE[intent]) {
    session.fallbackCount = 0;
    session.lastTopic = intent;
    const hasPractice = !!PRACTICE_QUESTIONS[intent];
    const extra = hasPractice
      ? `\n\n💡 Mahu mencuba *soalan latihan* untuk topik ini? Taip "latihan".`
      : '';
    return KNOWLEDGE[intent].content + extra;
  }

  // --- Numeric menu shortcut ---
  const numMatch = input.match(/^[1-6]$/);
  if (numMatch) {
    const menuMap = { '1': 'asal_masyarakat_majmuk', '2': 'kaum_cina', '3': 'kaum_india', '4': 'dasar_british', '5': 'kerjasama_kemerdekaan', '6': 'kesan_utama' };
    const topicKey = menuMap[input];
    if (topicKey && KNOWLEDGE[topicKey]) {
      session.fallbackCount = 0;
      session.lastTopic = topicKey;
      const hasPractice = !!PRACTICE_QUESTIONS[topicKey];
      const extra = hasPractice
        ? `\n\n💡 Mahu mencuba *soalan latihan* untuk topik ini? Taip "latihan".`
        : '';
      return KNOWLEDGE[topicKey].content + extra;
    }
  }

  // --- Fallback ---
  session.fallbackCount += 1;

  if (session.fallbackCount >= 2) {
    session.fallbackCount = 0;
    return `😔 Maaf, saya masih tidak dapat memahami soalan awak.

Sila hubungi guru Sejarah anda melalui WhatsApp:
👉 https://wa.me/60111234567

Jika awak ingin teruskan dengan saya, taip *"menu"* untuk lihat topik yang tersedia.`;
  }

  return `Maaf, saya kurang faham. Boleh awak nyatakan subtopik kaum mana yang nak diulang kaji atau cuba tanya dengan cara lain?

Contoh:
• "Terangkan kaum Cina"
• "Apakah dasar British?"
• "Soalan latihan kemerdekaan"
• Taip *"menu"* untuk semua topik`;
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

module.exports = { createSession, processMessage };
