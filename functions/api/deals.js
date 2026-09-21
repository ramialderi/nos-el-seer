// functions/api/deals.js
// نسخة الـ API بصيغة Cloudflare Pages Functions.
// أي ملف داخل مجلد /functions يتحول تلقائيًا لـ endpoint بنفس مساره:
// هذا الملف بيصير متاح على الرابط: your-site.pages.dev/api/deals
//
// أمثلة استخدام بعد النشر:
//   GET /api/deals
//   GET /api/deals?country=مصر
//   GET /api/deals?country=مصر&category=أزياء وملابس

import deals from "../../data/deals.json";

function corsHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country");
  const category = url.searchParams.get("category");

  if (country && !deals[country]) {
    return new Response(
      JSON.stringify({
        error: `لا توجد بيانات لهذا البلد: ${country}`,
        available_countries: Object.keys(deals)
      }),
      { status: 404, headers: corsHeaders() }
    );
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

  return new Response(
    JSON.stringify({
      updated_note: "بيانات مُجهّزة يدويًا حاليًا — لم تُربط بعد بمصدر تحديث تلقائي",
      available_countries: Object.keys(deals),
      data: result
    }),
    { headers: corsHeaders() }
  );
}
