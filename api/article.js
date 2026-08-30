```javascript
export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        ok: false,
        error: "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum tersedia di Environment Variables."
      });
    }

    const headers = req.headers || {};
    const userAgent = headers["user-agent"] || "";
    const referer = headers["referer"] || "";

    // =========================
    // DETEKSI BOT
    // =========================

    const botPattern =
      /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|google-inspectiontool|googlebot|bingbot|yandex|baiduspider|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|applebot|linkedinbot|twitterbot|telegrambot|whatsapp/i;

    const isBot = botPattern.test(userAgent);

    // =========================
    // DEVICE
    // =========================

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
    }

    // =========================
    // SUMBER
    // =========================

    let sumber = "Direct";

    if (referer.includes("facebook")) {
      sumber = "Facebook";
    } else if (referer.includes("google")) {
      sumber = "Google";
    } else if (referer.includes("whatsapp")) {
      sumber = "WhatsApp";
    }

    // =========================
    // DATA ARTIKEL
    // POST dari HTML atau GET untuk tes langsung
    // =========================

    let body = req.body || {};

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const judul =
      body.title ||
      req.query.title ||
      "Artikel EZOID";

    const query = req.query || {};

    const urlArtikel =
      body.url ||
      query.url ||
      "https://ezoid.vercel.app/";

    // =========================
    // WAKTU
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
    // STATUS PENGUNJUNG
    // =========================

    const statusPengunjung = isBot
      ? "🤖 Pengunjung Bot Membuka Artikel"
      : "👤 Pengunjung Manusia Membuka Artikel";

    // =========================
    // PESAN TELEGRAM
    // =========================

    const message =
`${statusPengunjung}

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

    // =========================
    // KIRIM TELEGRAM
    // =========================

    const telegramUrl =
      `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramUrl, {
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

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        telegram: result
      });
    }

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message || "Terjadi kesalahan pada API artikel."
    });

  }

}
```
