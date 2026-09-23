// scraper/scrape.js
//
// روبوت فحص يفتح صفحة عروض كل متجر بمتصفح آلي حقيقي (Playwright)،
// يدور على نسب الخصم حسب "المحدد" (selector) المعرّف بملف
// stores.config.js، ويحدّث data/deals.json تلقائيًا بالأرقام الفعلية.
//
// تشغيل يدوي (من جهازك، بعد npm install):
//   node scraper/scrape.js
//
// تشغيل تلقائي: عبر GitHub Actions (.github/workflows/scrape.yml)
// كل فترة زمنية محددة.
//
// ⚠️ قبل التشغيل الفعلي: راجع stores.config.js وتأكد كل "selector"
// معبّى بمحدد حقيقي (مو TODO_SELECTOR) — وراجع شروط استخدام كل موقع
// (robots.txt / Terms of Service) قبل ما تفعّل الفحص عليه بشكل دوري.

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const CONFIG_PATH = path.join(__dirname, "stores.config.js");
const DEALS_PATH = path.join(__dirname, "..", "data", "deals.json");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function loadDeals() {
  return JSON.parse(fs.readFileSync(DEALS_PATH, "utf8"));
}

function saveDeals(deals) {
  fs.writeFileSync(DEALS_PATH, JSON.stringify(deals, null, 2), "utf8");
}

// يدور جوا نصوص العناصر عن أعلى نسبة خصم مذكورة (مثلاً "-50%" أو "خصم 50%")
function extractMaxPercent(texts) {
  let max = null;
  for (const t of texts) {
    const match = t.match(/(\d{1,3}(?:\.\d+)?)\s*%/);
    if (match) {
      const val = Math.round(parseFloat(match[1]));
      if (val > 0 && val <= 100 && (max === null || val > max)) max = val;
    }
  }
  return max;
}

async function scrapeStore(browser, store) {
  if (store.selector === "TODO_SELECTOR") {
    console.warn(`⏭️  تخطّي "${store.name}" — لسا ما تحدد الـ selector الصحيح.`);
    return null;
  }

  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  try {
    await page.goto(store.dealsUrl, { waitUntil: "networkidle", timeout: 30000 });
    // مهلة إضافية بسيطة للمواقع اللي بترندر بالـ JS بعد التحميل الأول
    await page.waitForTimeout(2000);

    const texts = await page.$$eval(store.selector, (els) =>
      els.map((el) => el.textContent || "")
    );

    const percent = extractMaxPercent(texts);
    if (percent === null) {
      console.warn(`⚠️  "${store.name}" — ما لقيت أي نسبة خصم بالمحدد المعطى.`);
      return null;
    }

    console.log(`✅ "${store.name}" — أعلى خصم موجود: ${percent}%`);
    return percent;
  } catch (err) {
    console.error(`❌ "${store.name}" — فشل الفحص: ${err.message}`);
    return null;
  } finally {
    await context.close();
  }
}

async function main() {
  const stores = require(CONFIG_PATH);
  const deals = loadDeals();
  const browser = await chromium.launch({ headless: true });

  let changed = 0;

  for (const store of stores) {
    const percent = await scrapeStore(browser, store);

    if (percent !== null) {
      const section = deals[store.country] && deals[store.country][store.category];
      const entry = section && section.find((d) => d.name === store.name);

      if (!entry) {
        console.warn(
          `⚠️  "${store.name}" موجود بـ stores.config.js بس مو موجود بـ deals.json (${store.country} / ${store.category}) — تأكد من تطابق الأسماء.`
        );
        continue;
      }

      const newOff = `${percent}%`;
      if (entry.off !== newOff) {
        entry.off = newOff;
        entry.last_scraped = new Date().toISOString();
        changed++;
      }
    }

    // مهلة أدب بين كل طلب وتاني — تقليل الضغط على السيرفرات المستهدفة
    await new Promise((r) => setTimeout(r, 1500));
  }

  await browser.close();

  if (changed > 0) {
    saveDeals(deals);
    console.log(`\n💾 تم تحديث ${changed} متجر بـ data/deals.json`);
  } else {
    console.log("\nℹ️  ما في أي تحديث جديد هالمرة.");
  }
}

main().catch((err) => {
  console.error("فشل الروبوت بالكامل:", err);
  process.exit(1);
});
