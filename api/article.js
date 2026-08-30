export default async function handler(req, res) {
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
return res.status(500).json({ ok: false, error: "Telegram environment variables tidak tersedia." });
}

const userAgent = req.headers["user-agent"] || "";
const referer = req.headers["referer"] || "";
const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|google-inspectiontool|googlebot|bingbot|yandex|baiduspider|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|applebot|linkedinbot|twitterbot|telegrambot|whatsapp/i;
const isBot = botPattern.test(userAgent);

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
const judul = body.title || query.title || "Artikel EZOID";
const urlArtikel = body.url || query.url || "-";

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

const message = `${status}

📖 Artikel EZOID

📌 Judul:
${judul}

🔗 URL:
${urlArtikel}

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📍 Lokasi: Tidak diketahui

📱 Device: ${device}
🌐 Sumber: ${sumber}`;

try {
const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ chat_id: chatId, text: message })
});

```
const result = await response.json();
return res.status(response.ok ? 200 : 502).json(result);
```

} catch (error) {
return res.status(500).json({ ok: false, error: error.message });
}
}
