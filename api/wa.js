export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

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
`📲 Klik WhatsApp EZOID

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📊 WA Today: klik baru`;


  const url = `https://api.telegram.org/bot${token}/sendMessage`;


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


  res.status(200).json({
    status: "WA tercatat"
  });

}
