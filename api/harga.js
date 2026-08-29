export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";

  let lokasi = "Tidak diketahui";


  // =====================================================
  // LOKASI
  // =====================================================

  try {

    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();

    if (data.city || data.region || data.country_name) {

      lokasi =
        `${data.city || "-"}, ${data.region || "-"}, ${data.country_name || "-"}`;

    } else {

      throw new Error("ipapi gagal");

    }

  } catch {

    try {

      const geo = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await geo.json();

      if (data.status === "success") {

        lokasi =
          `${data.city || "-"}, ${data.regionName || "-"}, ${data.country || "-"}`;

      } else {

        throw new Error("ip-api gagal");

      }

    } catch {

      lokasi = "Tidak diketahui";

    }

  }


  // =====================================================
  // USER AGENT
  // =====================================================

  const userAgent = req.headers["user-agent"] || "";


  // =====================================================
  // DETEKSI BOT / CRAWLER
  // =====================================================

  let jenisPengunjung = "👤 HUMAN";
  let namaBot = "";


  const botList = [

    // Search Engine
    { pattern: /googlebot/i, name: "Googlebot" },
    { pattern: /google-inspectiontool/i, name: "Google-InspectionTool" },
    { pattern: /bingbot/i, name: "Bingbot" },
    { pattern: /adidxbot/i, name: "AdIdxBot" },
    { pattern: /baiduspider/i, name: "Baiduspider" },
    { pattern: /yandexbot/i, name: "YandexBot" },
    { pattern: /duckduckbot/i, name: "DuckDuckBot" },
    { pattern: /slurp/i, name: "Yahoo Slurp" },
    { pattern: /sogou/i, name: "Sogou Spider" },
    { pattern: /exabot/i, name: "Exabot" },
    { pattern: /petalbot/i, name: "PetalBot" },

    // AI Crawlers
    { pattern: /gptbot/i, name: "GPTBot" },
    { pattern: /chatgpt-user/i, name: "ChatGPT-User" },
    { pattern: /oai-searchbot/i, name: "OAI-SearchBot" },
    { pattern: /claudebot/i, name: "ClaudeBot" },
    { pattern: /anthropic-ai/i, name: "Anthropic AI" },
    { pattern: /perplexitybot/i, name: "PerplexityBot" },
    { pattern: /cohere-ai/i, name: "Cohere AI" },
    { pattern: /bytespider/i, name: "Bytespider" },
    { pattern: /meta-externalagent/i, name: "Meta External Agent" },

    // Social Media Crawlers
    { pattern: /facebookexternalhit/i, name: "Facebook Crawler" },
    { pattern: /facebot/i, name: "Facebot" },
    { pattern: /twitterbot/i, name: "Twitterbot" },
    { pattern: /linkedinbot/i, name: "LinkedInBot" },
    { pattern: /pinterestbot/i, name: "PinterestBot" },
    { pattern: /telegrambot/i, name: "TelegramBot" },
    { pattern: /discordbot/i, name: "DiscordBot" },

    // SEO Crawlers
    { pattern: /ahrefsbot/i, name: "AhrefsBot" },
    { pattern: /semrushbot/i, name: "SemrushBot" },
    { pattern: /mj12bot/i, name: "MJ12bot" },
    { pattern: /dotbot/i, name: "DotBot" },
    { pattern: /rogerbot/i, name: "Rogerbot" },
    { pattern: /screaming frog/i, name: "Screaming Frog" },
    { pattern: /sitebulb/i, name: "Sitebulb" },

    // Other
    { pattern: /applebot/i, name: "Applebot" },
    { pattern: /qwantify/i, name: "Qwantify" },
    { pattern: /archive\.org_bot/i, name: "Internet Archive Bot" },
    { pattern: /ia_archiver/i, name: "Internet Archive Bot" }

  ];


  // Cek daftar bot

  for (const bot of botList) {

    if (bot.pattern.test(userAgent)) {

      jenisPengunjung = "🤖 BOT / CRAWLER";
      namaBot = bot.name;

      break;

    }

  }


  // =====================================================
  // DETEKSI BOT UMUM
  // =====================================================

  if (jenisPengunjung === "👤 HUMAN") {

    const genericBotPattern =
      /bot|crawler|spider|scraper|slurp|archiver|headless|phantomjs|selenium|puppeteer|playwright|httpclient|curl|wget|python-requests|axios/i;

    if (genericBotPattern.test(userAgent)) {

      jenisPengunjung = "🤖 BOT / CRAWLER";
      namaBot = "Crawler / Bot (Unknown)";

    }

  }


  // =====================================================
  // DEVICE
  // =====================================================

  let device = "Tidak diketahui";


  if (jenisPengunjung === "🤖 BOT / CRAWLER") {

    device = "Crawler";

  }

  else if (/android/i.test(userAgent)) {

    device = "Android Mobile";

  }

  else if (/iphone/i.test(userAgent)) {

    device = "iPhone";

  }

  else if (/ipad/i.test(userAgent)) {

    device = "iPad";

  }

  else if (/windows/i.test(userAgent)) {

    device = "Windows Desktop";

  }

  else if (/macintosh/i.test(userAgent)) {

    device = "Mac Desktop";

  }


  // =====================================================
  // SUMBER TRAFFIC
  // =====================================================

  const referer = req.headers["referer"] || "";

  let sumber = "Direct";


  if (referer.includes("facebook")) {

    sumber = "Facebook";

  }

  else if (referer.includes("google")) {

    sumber = "Google";

  }

  else if (referer.includes("whatsapp")) {

    sumber = "WhatsApp";

  }


  // =====================================================
  // TANGGAL & JAM WIB
  // =====================================================

  const now = new Date();


  const tanggal = now.toLocaleDateString("id-ID", {

    timeZone: "Asia/Jakarta"

  });


  const jam = now.toLocaleTimeString("id-ID", {

    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"

  });


  // =====================================================
  // PESAN TELEGRAM
  // =====================================================

  let message;


  if (jenisPengunjung === "👤 HUMAN") {

    message =
`💰 Pengunjung Manusia Melihat Harga EZOID

👤 Jenis: HUMAN

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

  }

  else {

    message =
`🤖 Bot / Crawler Membaca Harga EZOID

🤖 Jenis: BOT / CRAWLER
🕷️ Bot: ${namaBot}

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

  }


  // =====================================================
  // KIRIM TELEGRAM
  // =====================================================

  const url =
    `https://api.telegram.org/bot${token}/sendMessage`;


  await fetch(url, {

    method: "POST",

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify({

      chat_id: chatId,
      text: message

    })

  });


  // =====================================================
  // RESPONSE
  // =====================================================

  res.status(200).json({

    success: true

  });

}
