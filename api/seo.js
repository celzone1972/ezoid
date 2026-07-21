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


    const response = await searchconsole.searchanalytics.query({

      siteUrl: "https://ezoid.vercel.app/",

      requestBody: {

        startDate: "2026-07-01",

        endDate: "2026-07-20",

        rowLimit: 10

      }

    });


    const row = response.data.rows ? response.data.rows[0] : null;


    res.status(200).json({

      status: "SEO EZOID aktif",

      period: "2026-07-01 sampai 2026-07-20",

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
