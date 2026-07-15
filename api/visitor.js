export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";

  let lokasi = "Tidak diketahui";

  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();

    if (data.city || data.country_name) {
      lokasi = `${data.city || "-"}, ${data.country_name || "-"}`;
    }

  } catch (e) {
    lokasi = "Tidak diketahui";
  }


  // DEVICE
  const userAgent = req.headers["user-agent"] || "";

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


  // SUMBER TRAFFIC
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


  const now = new Date();

  const tanggal = now.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  const jam = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"
  });


  const message =
`🚀 Pengunjung baru EZOID

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB
📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;


  const url = `https://api.telegram.org/bot${token}/sendMessage`;

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
