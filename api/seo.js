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

    const report = `
📊 SEO EZOID REPORT

📅 Periode: ${startDate} sampai ${endDate}

👆 Klik: ${row ? row.clicks : 0}

👀 Tayangan: ${row ? row.impressions : 0}

📈 CTR: ${row ? (row.ctr * 100).toFixed(2) + "%" : "0%"}

🏆 Posisi Rata-rata: ${row ? row.position.toFixed(1) : "0"}
`;

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
