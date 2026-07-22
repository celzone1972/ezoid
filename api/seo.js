import { google } from "googleapis";

export default async function handler(req, res) {

  try {

    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    );

    const auth = new google.auth.GoogleAuth({

      credentials,

      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly"
      ]

    });


    const searchconsole = google.searchconsole({

      version: "v1",
      auth

    });

    const today = new Date();

const endDate = today.toISOString().split("T")[0];

today.setDate(today.getDate() - 1);

const startDate = today.toISOString().split("T")[0];


    const response = await searchconsole.searchanalytics.query({

      siteUrl: "https://ezoid.vercel.app/",

      requestBody: {

        startDate: startDate,

endDate: endDate,
        rowLimit: 10

      }

    });


    const row = response.data.rows ? response.data.rows[0] : null;
    const date28 = new Date();
date28.setDate(date28.getDate() - 28);

const startDate28 = date28.toISOString().split("T")[0];

const response28 = await searchconsole.searchanalytics.query({
  siteUrl: "https://ezoid.vercel.app/",
  requestBody: {
    startDate: startDate28,
    endDate: endDate,
    rowLimit: 10
  }
});

const row28 = response28.data.rows
  ? response28.data.rows[0]
  : null;
    const formatTanggal = (tanggal) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};
    const report = `
📊 SEO EZOID REPORT

📅 24 Jam
👆 Klik: ${row ? row.clicks : 0}
👀 Tayangan: ${row ? row.impressions : 0}
📈 CTR: ${row ? (row.ctr * 100).toFixed(2) + "%" : "0%"}
🏆 Posisi: ${row ? row.position.toFixed(1) : "0"}

📅 28 Hari
👆 Klik: ${row28 ? row28.clicks : 0}
👀 Tayangan: ${row28 ? row28.impressions : 0}
📈 CTR: ${row28 ? (row28.ctr * 100).toFixed(2) + "%" : "0%"}
🏆 Posisi: ${row28 ? row28.position.toFixed(1) : "0"}
`;
await fetch(
`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
chat_id: process.env.TELEGRAM_CHAT_ID,
text: report
})
}
);
    
    res.status(200).json({

      status: "SEO EZOID aktif",

      period: startDate + " sampai " + endDate,

     total: {

  clicks: row ? row.clicks : 0,

  impressions: row ? row.impressions : 0,

  ctr: row ? (row.ctr * 100).toFixed(2) + "%" : "0%",

  position: row ? row.position.toFixed(1) : "0"

}


    });


  } catch(error) {


    res.status(500).json({

      error: error.message

    });


  }

}
