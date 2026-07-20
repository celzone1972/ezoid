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


    res.status(200).json({

      status: "SEO EZOID aktif",

      data: response.data

    });


  } catch(error) {


    res.status(500).json({

      error: error.message

    });


  }

}
