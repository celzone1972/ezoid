export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: "Telegram environment variables tidak tersedia."
    });
  }

  const userAgent = req.headers["user-agent"] || "";
  const referer = req.headers["referer"] || "";

  // Ambil IP visitor
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket?.remoteAddress || "";

  // Deteksi bot / crawler
  const isBot =
    /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|google-inspectiontool|googlebot|bingbot|yandex|baiduspider|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|applebot|linkedinbot|twitterbot|telegrambot|whatsapp/i
      .test(userAgent);

  // Deteksi device
  let device = "Tidak diketahui";

  if (/android/i.test(userAgent)) {
    device = "Android Mobile";
  } else if (/iphone/i.test(userAgent)) {
    device = "iPhone";
  } else if (/ipad/i.test(userAgent)) {
    device = "iPad";
  } else if (/windows/i.test(userAgent)) {
    device = "Windows Desktop";
  } else if (/macintosh/i.test(userAgent)) {
    device = "Mac Desktop";
  } else if (/linux/i.test(userAgent)) {
    device = "Linux Desktop";
  }

  // Deteksi sumber
  let sumber = "Direct";

  if (/facebook/i.test(referer)) {
    sumber = "Facebook";
  } else if (/google/i.test(referer)) {
    sumber = "Google";
  } else if (/whatsapp/i.test(referer)) {
    sumber = "WhatsApp";
  } else if (/bing/i.test(referer)) {
    sumber = "Bing";
  } else if (/yahoo/i.test(referer)) {
    sumber = "Yahoo";
  }

  // Ambil body
  let body = req.body || {};

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const query = req.query || {};

  const judul =
    body.title ||
    query.title ||
    "Artikel EZOID";

  const urlArtikel =
    body.url ||
    query.url ||
    referer ||
    "-";

  // =========================
  // LOKASI VISITOR
  // =========================

  let lokasi = "Tidak diketahui";

  try {
    if (ip && ip !== "::1" && ip !== "127.0.0.1") {
      const geoResponse = await fetch(
        `https://ipapi.co/${encodeURIComponent(ip)}/json/`
      );

      if (geoResponse.ok) {
        const geo = await geoResponse.json();

        const kota = geo.city || "";
        const region = geo.region || "";
        const negara = geo.country_name || "";

        const bagian = [kota, region, negara].filter(Boolean);

        if (bagian.length > 0) {
          lokasi = bagian.join(", ");
        }
      }
    }
  } catch (error) {
    lokasi = "Tidak diketahui";
  }

  // =========================
  // TANGGAL & JAM WIB
  // =========================

  const now = new Date();

  const tanggal = now.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  const jam = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"
  });

  // =========================
  // STATUS
  // =========================

  const status = isBot
    ? "🤖 ARTIKEL EZOID DIBACA BOT"
    : "👤 ARTIKEL EZOID DIBUKA MANUSIA";

  // =========================
  // PESAN TELEGRAM
  // =========================

  const message = `${status}

📖 Artikel EZOID

📌 Judul:
${judul}

🔗 URL:
${urlArtikel}

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    return res
      .status(telegramResponse.ok ? 200 : 502)
      .json(telegramResult);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || String(error)
    });
  }
}
