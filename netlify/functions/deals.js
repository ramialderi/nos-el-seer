// netlify/functions/deals.js
// نسخة الـ API بصيغة Netlify Functions.
// بترد على /.netlify/functions/deals — وملف netlify.toml بيعيد توجيه
// /api/deals لنفس المكان عشان الموقع يقدر يستدعي /api/deals عاديًا.

const deals = require("../../data/deals.json");

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const { country, category } = params;

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };

  if (country && !deals[country]) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: `لا توجد بيانات لهذا البلد: ${country}`,
        available_countries: Object.keys(deals)
      })
    };
  }

  let result = country ? { [country]: deals[country] } : deals;

  if (category) {
    const filtered = {};
    for (const c in result) {
      if (result[c] && result[c][category]) {
        filtered[c] = { [category]: result[c][category] };
      }
    }
    result = filtered;
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      updated_note: "بيانات مُجهّزة يدويًا حاليًا — لم تُربط بعد بمصدر تحديث تلقائي",
      available_countries: Object.keys(deals),
      data: result
    })
  };
};
