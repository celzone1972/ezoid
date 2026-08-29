export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";

  let lokasi = "Tidak diketahui";

  try {
    // Coba ipapi.co dulu
    const geo1 = await fetch(`https://ipapi.co/${ip}/json/`);
    const data1 = await geo1.json();

    if (data1.city || data1.region || data1.country_name) {

      lokasi =
        `${data1.city || "-"}, ${data1.region || "-"}, ${data1.country_name || "-"}`;

    } else {

      throw new Error("ipapi gagal");

    }

  } catch (e1) {

    try {

      // Fallback ke ip-api.com
      const geo2 = await fetch(`http://ip-api.com/json/${ip}`);
      const data2 = await geo2.json();

      if (data2.status === "success") {

        lokasi =
          `${data2.city || "-"}, ${data2.regionName || "-"}, ${data2.country || "-"}`;

      } else {

        throw new Error("ip-api gagal");

      }

    } catch (e2) {

      lokasi = "Tidak diketahui";

    }

  }


  // USER AGENT
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

    // SEO / Website Crawlers
    { pattern: /ahrefsbot/i, name: "AhrefsBot" },
    { pattern: /semrushbot/i, name: "SemrushBot" },
    { pattern: /mj12bot/i, name: "MJ12bot" },
    { pattern: /dotbot/i, name: "DotBot" },
    { pattern: /rogerbot/i, name: "Rogerbot" },
    { pattern: /screaming frog/i, name: "Screaming Frog" },
    { pattern: /sitebulb/i, name: "Sitebulb" },

    // Apple / Other
    { pattern: /applebot/i, name: "Applebot" },
    { pattern: /qwantify/i, name: "Qwantify" },
    { pattern: /archive\.org_bot/i, name: "Internet Archive Bot" },
    { pattern: /ia_archiver/i, name: "Internet Archive Bot" }

  ];


  // Cek bot berdasarkan daftar
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

    if (/samsung/i.test(userAgent)) {

      device = "Android / Samsung";

    }

    else if (/xiaomi|redmi|mi /i.test(userAgent)) {

      device = "Android / Xiaomi";

    }

    else if (/realme/i.test(userAgent)) {

      device = "Android / Realme";

    }

    else if (/oppo/i.test(userAgent)) {

      device = "Android / Oppo";

    }

    else if (/vivo/i.test(userAgent)) {

      device = "Android / Vivo";

    }

    else {

      device = "Android";

    }

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
`🚀 Pengunjung Manusia EZOID

👤 Jenis: HUMAN

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB
📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

  }

  else {

    message =
`🤖 BOT / CRAWLER EZOID

🤖 Jenis: BOT / CRAWLER
🕷️ Bot: ${namaBot}

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB
📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

  }


  // =====================================================
  // KIRIM KE TELEGRAM
  // =====================================================

  const url =
    `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      chat_id: chatId,
      text: message

    })

  });


  const result = await response.json();

  console.log("Telegram response:", result);


  res.status(200).json(result);

}
