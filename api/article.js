import https from "https";

export default async function handler(req, res) {
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
return res.status(500).json({ ok: false, error: "Telegram environment variables tidak tersedia." });
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
try { body = JSON.parse(body); } catch (e) { body = {}; }
}

const query = req.query || {};
const judul = body.title || query.title || "Artikel EZOID";
const urlArtikel = body.url || query.url || referer || "-";

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
const telegramResult = await new Promise((resolve, reject) => {
const data = JSON.stringify({ chat_id: chatId, text: message });

```
  const request = https.request({
    hostname: "api.telegram.org",
    path: `/bot${token}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  }, (response) => {
    let result = "";
    response.on("data", chunk => { result += chunk; });
    response.on("end", () => {
      try {
        resolve({ statusCode: response.statusCode, data: JSON.parse(result) });
      } catch (e) {
        reject(new Error("Respons Telegram tidak valid."));
      }
    });
  });

  request.on("error", reject);
  request.write(data);
  request.end();
});

return res.status(telegramResult.statusCode >= 200 && telegramResult.statusCode < 300 ? 200 : 502).json(telegramResult.data);
```

} catch (error) {
return res.status(500).json({
ok: false,
error: error && error.message ? error.message : String(error)
});
}
}
