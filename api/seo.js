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

        dimensions: [
          "query"
        ],

        rowLimit: 10

      }

    });


    const rows = response.data.rows || [];


    const keywords = rows.map(item => ({

      keyword: item.keys[0],

      clicks: item.clicks,

      impressions: item.impressions,

      ctr: (item.ctr * 100).toFixed(2) + "%",

      position: item.position.toFixed(1)

    }));


    res.status(200).json({

      status: "SEO EZOID aktif",

      period: "2026-07-01 sampai 2026-07-20",

      total: {

        clicks: response.data.rows
          ? rows.reduce((a,b)=>a+b.clicks,0)
          : 0,

        impressions: response.data.rows
          ? rows.reduce((a,b)=>a+b.impressions,0)
          : 0

      },

      keywords

    });


  } catch(error) {


    res.status(500).json({

      error: error.message

    });


  }

}
