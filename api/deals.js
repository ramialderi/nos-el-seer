// api/deals.js
// نقطة API بسيطة تُرجع بيانات المتاجر والتخفيضات كـ JSON.
// تعمل تلقائيًا على Vercel بدون أي إعداد إضافي (كل ملف داخل مجلد /api يصبح endpoint).
//
// أمثلة استخدام بعد النشر:
//   GET /api/deals                     -> كل البلدان
//   GET /api/deals?country=مصر          -> بلد واحد فقط
//   GET /api/deals?country=مصر&category=أزياء وملابس  -> قسم واحد من بلد واحد
//
// هاي نقطة الدخول اللي رح يستخدمها بوت تليجرام أو أي نظام ذكاء اصطناعي مستقبلاً.

const deals = require("../data/deals.json");

module.exports = (req, res) => {
  // يسمح لأي موقع/بوت يستدعي الـ API (يمكن تقييده لاحقًا لنطاقات محددة)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const { country, category } = req.query || {};

  if (country && !deals[country]) {
    res.status(404).json({
      error: `لا توجد بيانات لهذا البلد: ${country}`,
      available_countries: Object.keys(deals)
    });
    return;
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

  res.status(200).json({
    updated_note: "بيانات مُجهّزة يدويًا حاليًا — لم تُربط بعد بمصدر تحديث تلقائي",
    available_countries: Object.keys(deals),
    data: result
  });
};
