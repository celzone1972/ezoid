const https = require("https");

function sendTelegram(token, chatId, text) {
return new Promise((resolve, reject) => {
const data = JSON.stringify({
chat_id: chatId,
text
});

```
const request = https.request(
  {
    hostname: "api.telegram.org",
    path: `/bot${token}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  },
  (response) => {
    let result = "";
    response.on("data", (chunk) => { result += chunk; });
    response.on("end", () => {
      try {
        resolve({ status: response.statusCode, data: JSON.parse(result) });
      } catch {
        resolve({ status: response.statusCode, data: result });
      }
    });
  }
);

request.on("error", reject);
request.write(data);
request.end();
```

});
}

export default async function handler(req, res) {
try {
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

```
if (!token || !chatId) {
  return res.status(500).json({
    ok: false,
    error: "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID tidak tersedia."
  });
}

const userAgent = req.headers["user-agent"] || "";
const referer = req.headers["referer"] || "";

const isBot = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|google-inspectiontool|googlebot|bingbot|yandex|baiduspider|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|applebot|linkedinbot|twitterbot|telegrambot|whatsapp/i.test(userAgent);

let device = "Tidak diketahui";
if (/android/i.test(userAgent)) device = "Android Mobile";
else if (/iphone/i.test(userAgent)) device = "iPhone";
else if (/ipad/i.test(userAgent)) device = "iPad";
else if (/windows/i.test(userAgent)) device = "Windows Desktop";
else if (/macintosh/i.test(userAgent)) device = "Mac Desktop";

let sumber = "Direct";
if (/facebook/i.test(referer)) sumber = "Facebook";
else if (/google/i.test(referer)) sumber = "Google";
else if (/whatsapp/i.test(referer)) sumber = "WhatsApp";

let body = req.body || {};
if (typeof body === "string") {
  try { body = JSON.parse(body); } catch { body = {}; }
}

const query = req.query || {};
let judul = body.title || query.title || req.headers["x-article-title"] || "";
const urlArtikel = body.url || query.url || req.headers["x-article-url"] || referer || "-";

// Jika HTML belum mengirim judul, ambil <title> dari halaman artikel.
if (!judul && referer) {
  try {
    const pageResponse = await fetch(referer);
    const pageHtml = await pageResponse.text();
    const titleMatch = pageHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      judul = titleMatch[1].replace(/\s+/g, " ").trim();
    }
  } catch {}
}

if (!judul) judul = "Artikel EZOID";

const now = new Date();
const tanggal = now.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
const jam = now.toLocaleTimeString("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit"
});

const status = isBot
  ? "🤖 Pengunjung Bot Membuka Artikel"
  : "👤 Pengunjung Manusia Membuka Artikel";

const message = `${status}\n\n📖 Artikel EZOID\n\n📌 Judul:\n${judul}\n\n🔗 URL:\n${urlArtikel}\n\n📅 Tanggal: ${tanggal}\n⏰ Jam: ${jam} WIB\n\n📍 Lokasi: Tidak diketahui\n\n📱 Device: ${device}\n🌐 Sumber: ${sumber}`;

const telegram = await sendTelegram(token, chatId, message);

return res.status(telegram.status === 200 ? 200 : 502).json(telegram.data);
```

} catch (error) {
return res.status(500).json({
ok: false,
error: String(error && error.message ? error.message : error)
});
}
}
