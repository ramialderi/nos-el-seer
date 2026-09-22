# نص السعر — موقع تنزيلات 50% في الدول العربية

موقع يعرض تخفيضات من متاجر عربية معروفة، مبوبة حسب البلد والقسم (مواقع عامة،
أزياء وملابس، إلكترونيات وأخرى)، مع **API بسيط** جاهز للربط المستقبلي ببوت
تليجرام أو أي نظام ذكاء اصطناعي.

## بنية المشروع

```
.
├── index.html            الموقع نفسه (الواجهة اللي يشوفها الزائر)
├── data/
│   └── deals.json          كل بيانات المتاجر والعروض — هنا تضيف/تعدل المتاجر
├── netlify/
│   └── functions/
│       └── deals.js          الـ API لمنصة Netlify (المستخدمة حاليًا: noselseer.netlify.app)
├── netlify.toml              إعدادات Netlify (بتحول /api/deals لمجلد الدوال تلقائيًا)
├── functions/
│   └── api/
│       └── deals.js           نفس الـ API بصيغة Cloudflare Pages (بديل)
├── api/
│   └── deals.js               نفس الـ API بصيغة Vercel (بديل)
├── package.json
└── README.md              هذا الملف
```

> الموقع (`index.html`) بيتواصل مع `/api/deals` بغض النظر عن أي منصة —
> ما تحتاج تحذف أي مجلد، كل منصة بتستخدم مجلدها وبتتجاهل الباقي.

## كيف تضيف أو تعدّل متجر

افتح `data/deals.json` مباشرة وعدّل حسب البلد والقسم. الشكل:

```json
"مصر": {
  "أزياء وملابس": [
    { "name": "اسم المتجر", "desc": "وصف قصير عن العروض", "off": "50%" }
  ]
}
```

ما تحتاج تلمس أي كود تاني — الموقع والـ API بيقروا من هالملف مباشرة.

## التشغيل محليًا (اختياري، للتجربة قبل النشر)

يحتاج [Node.js](https://nodejs.org) و[Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel
vercel dev
```

رح يفتحلك الموقع على `http://localhost:3000` مع اشتغال الـ API فعليًا.

> ملاحظة: إذا فتحت `index.html` مباشرة كملف (بدون سيرفر)، الموقع رح يشتغل
> برضو لكن ببيانات احتياطية مخزّنة داخل الكود نفسه (`FALLBACK_DATA`)، مش
> من `deals.json` — عشان هيك لازم تشغّله عبر `vercel dev` أو بعد النشر
> عشان يقرأ من الـ API الحقيقي.

## النشر على Netlify (المنصة المستخدمة حاليًا)

الموقع شغّال أصلاً على `noselseer.netlify.app` — لكن لو نُشر بسحب وإفلات
ملف واحد فقط، الـ API (مجلد `netlify/functions`) ما بيكون انفعل بعد. عشان
يشتغل الـ API، لازم تربط الموقع بمستودع Git (بدل رفع ملف واحد يدويًا):

1. من لوحة تحكم الموقع بـ Netlify، روح لـ "Site configuration" ثم
   "Build & deploy" ثم "Link repository" (أو أنشئ موقع جديد واختار
   "Import an existing project" واربطه بنفس مستودع GitHub).
2. اترك "Build command" فاضي، و"Publish directory" حطّه نقطة (`.`).
3. احفظ وانتظر يعيد النشر — Netlify بيكتشف تلقائيًا مجلد
   `netlify/functions` وملف `netlify.toml` ويفعّل الـ API.

### اختبار الـ API بعد الربط

```
GET https://noselseer.netlify.app/api/deals
GET https://noselseer.netlify.app/api/deals?country=مصر
GET https://noselseer.netlify.app/api/deals?country=مصر&category=أزياء وملابس
```

## بدائل: Cloudflare Pages أو Vercel

نفس المشروع فيه نسخ الـ API بصيغة Cloudflare (مجلد `functions/`) وVercel
(مجلد `api/`) لو حبيت تجرب منصة تانية لاحقًا — بدون أي تعديل إضافي.

## الخطوة الجاية: ربط بوت تليجرام (لاحقًا)

الفكرة العامة (بدون كود بعد، بس التصور):

1. تنشئ بوت عبر [@BotFather](https://t.me/BotFather) على تليجرام وتاخذ توكن.
2. تضيف endpoint جديد بمجلد `api/` (مثلاً `api/telegram-webhook.js`) يستقبل
   رسائل المستخدمين من تليجرام.
3. هالـ endpoint بيستدعي نفس منطق `api/deals.js` داخليًا، ويرد على المستخدم
   بعروض بلده.
4. تربط رابط الـ webhook بحساب البوت عبر Telegram Bot API.

هاي خطوة منفصلة نجهزها وقت ما تكون جاهز — البنية الحالية مصمّمة أصلاً
لتستوعبها بدون ما نعيد بناء أي شي من الصفر.
