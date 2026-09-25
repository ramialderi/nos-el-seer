// scraper/stores.config.js
//
// كل عنصر هون بيمثّل متجر واحد. الحقول:
//   country / category / name  -> لازم تطابق بالضبط الأسماء الموجودة
//                                  بملف data/deals.json عشان الروبوت
//                                  يعرف وين يحدّث الرقم.
//   dealsUrl                   -> رابط صفحة العروض/التخفيضات بالمتجر
//                                  (مو الصفحة الرئيسية).
//   selector                   -> "محدد" CSS يوضّح للروبوت وين يدور
//                                  على نسبة الخصم بالصفحة.
//                                  ⚠️ القيم هلق TODO placeholder —
//                                  لازم نفتح كل صفحة سوا ونحدد
//                                  المحدد الصحيح الفعلي قبل ما تشتغل.
//   renderJs                   -> true لو الموقع SPA (يحتاج متصفح آلي
//                                  فعلي، مو مجرد تحميل HTML خام).
//
// طريقة إيجاد "المحدد" الصحيح لموقع معين:
//   1. افتح صفحة العروض بالمتجر على كروم.
//   2. اضغط كليك يمين على أي رقم نسبة خصم (مثلاً "-50%") واختار
//      "Inspect" / "فحص العنصر".
//   3. بتلاقي بأدوات المطوّر العنصر متحدد، وجنبه اسم الكلاس (class)
//      تبعه — هاد هو اللي نحطه بمكان "TODO_SELECTOR".

module.exports = [
  {
    country: "مصر",
    category: "مواقع عامة",
    name: "نون مصر",
    dealsUrl: "https://www.noon.com/egypt-en/deals/",
    selector: "TODO_SELECTOR", // مثال متوقع: [class*="discount"]
    renderJs: true
  },
  {
    country: "مصر",
    category: "مواقع عامة",
    name: "جوميا مصر",
    dealsUrl: "https://www.jumia.com.eg/flash-sales/",
    selector: ".bdg._dsct", // ✅ مؤكد من الموقع الحي: <div class="bdg _dsct _sm">57%</div>
    renderJs: true
  },
  {
    country: "السعودية",
    category: "إلكترونيات وأخرى",
    name: "إكسترا",
    dealsUrl: "https://www.extra.com/en-sa/search/?q=clerance%3Arelevance%3Atype%3APRODUCT&text=clerance&pg=1&pageSize=24&sort=relevance",
    selector: ".save-percent-tag", // ✅ مؤكد من الموقع الحي: <section class="save-percent-tag top-right-tag">36.4% Off</section>
    renderJs: true
  },
  {
    country: "الإمارات",
    category: "أزياء وملابس",
    name: "نمشي",
    dealsUrl: "https://www.namshi.com/uae-en/sale/",
    selector: "TODO_SELECTOR",
    renderJs: true
  },
  {
    country: "المغرب",
    category: "مواقع عامة",
    name: "جوميا المغرب",
    dealsUrl: "https://www.jumia.ma/flash-sales/",
    // ✅ نفس منصة جوميا مصر (نفس الشركة، نفس نظام العرض) — أعدنا استخدام
    // نفس الـ selector المؤكد من هناك، احتمال كبير يشتغل بدون فحص يدوي.
    // لو طلع ⚠️ أول تشغيل، بس وقتها نحتاج نفحصه يدويًا مثل الباقي.
    selector: ".bdg._dsct",
    renderJs: true
  },
  {
    country: "مصر",
    category: "أزياء وملابس",
    name: "سنتربوينت مصر",
    dealsUrl: "https://www.centrepointstores.com/eg/sale",
    selector: "TODO_SELECTOR",
    renderJs: true
  },
  {
    country: "السعودية",
    category: "مواقع عامة",
    name: "جرير",
    dealsUrl: "https://www.jarir.com/sa-en/offers",
    selector: "TODO_SELECTOR", // ⚠️ جرير بيعرض مبلغ التوفير بالريال مو نسبة % — السكربت الحالي ما بيقدر يقرأه، تخطّيناه مؤقتًا
    renderJs: true
  },
  {
    country: "الإمارات",
    category: "إلكترونيات وأخرى",
    name: "شرف دي جي",
    dealsUrl: "https://www.sharafdg.com/offers",
    selector: ".onsale", // ✅ مؤكد من الموقع الحي: <div class="onsale h-16"> 26% OFF </div>
    renderJs: true
  }

  // أضف باقي المتاجر هون بنفس الشكل — أهم شي country/category/name
  // يطابقوا بالحرف اللي بملف data/deals.json.
];
