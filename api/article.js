```javascript
export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";

  let lokasi = "Tidak diketahui";

  try {

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

      const geo2 = await fetch(`http://ip-api.com/json/${ip}`);
      const data2 = await geo2.json();

      if (data2.status === "success") {

        lokasi =
          `${data2.city || "-"}, ${data2.regionName || "-"}, ${data2.country || "-"}`;

      }

    } catch (e2) {}

  }

  const userAgent = req.headers["user-agent"] || "";

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

  // =========================
  // SUMBER
  // =========================

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

  // =========================
  // DATA ARTIKEL
  // =========================

  const body = req.body || {};

  const judul =
    body.title ||
    req.query.title ||
    "Artikel EZOID";

  const urlArtikel =
    body.url ||
    req.query.url ||
    "-";

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

  let statusPengunjung;

  if (isBot) {
    statusPengunjung = "🤖 Pengunjung Bot Membuka Artikel";
  } else {
    statusPengunjung = "👤 Pengunjung Manusia Membuka Artikel";
  }

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

  res.status(200).json(result);

}
```
