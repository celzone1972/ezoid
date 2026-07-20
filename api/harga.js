export default async function handler(req, res) {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;


  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "";


  let lokasi = "Tidak diketahui";


  try {

    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();

    lokasi =
      `${data.city || "-"}, ${data.region || "-"}, ${data.country_name || "-"}`;


  } catch {

    lokasi = "Tidak diketahui";

  }



  const userAgent = req.headers["user-agent"] || "";

  let device = "Tidak diketahui";


  if (/android/i.test(userAgent)) {
    device = "Android Mobile";
  }
  else if (/iphone/i.test(userAgent)) {
    device = "iPhone";
  }
  else if (/windows/i.test(userAgent)) {
    device = "Windows Desktop";
  }



  const referer = req.headers["referer"] || "";

  let sumber = "Direct";


  if (referer.includes("facebook")) {
    sumber = "Facebook";
  }
  else if (referer.includes("google")) {
    sumber = "Google";
  }



  const now = new Date();


  const tanggal = now.toLocaleDateString("id-ID", {
    timeZone:"Asia/Jakarta"
  });


  const jam = now.toLocaleTimeString("id-ID", {
    timeZone:"Asia/Jakarta",
    hour:"2-digit",
    minute:"2-digit"
  });



  const message =
`💰 Visitor Melihat Harga EZOID

📅 Tanggal: ${tanggal}
⏰ Jam: ${jam} WIB

📍 Lokasi: ${lokasi}

📱 Device: ${device}
🌐 Sumber: ${sumber}`;



  const url =
  `https://api.telegram.org/bot${token}/sendMessage`;



  await fetch(url, {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      chat_id:chatId,
      text:message

    })

  });



  res.status(200).json({
    success:true
  });

}
