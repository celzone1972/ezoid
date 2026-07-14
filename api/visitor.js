export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";

  let lokasi = "Tidak diketahui";

  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();

    lokasi = `${data.city || "-"}, ${data.country_name || "-"}`;

  } catch (e) {
    lokasi = "Gagal mendapatkan lokasi";
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
📍 Lokasi: ${lokasi}`;

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

  res.status(200).json(result);
}
