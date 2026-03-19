const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  await page.goto('file:///E:/lp/solar-18.03/index.html');
  await page.waitForTimeout(800);

  const read = async (label) => {
    const data = await page.evaluate(() => {
      const section = document.querySelector('[data-parallax-section]');
      const bg = document.querySelector('[data-parallax-bg]');
      const shade = document.querySelector('[data-parallax-shade]');
      const glow = document.querySelector('[data-parallax-glow]');
      const grid = document.querySelector('[data-parallax-grid]');
      const rect = section.getBoundingClientRect();
      return {
        sectionTop: rect.top,
        sectionHeight: rect.height,
        bgTransform: getComputedStyle(bg).transform,
        shadeTransform: getComputedStyle(shade).transform,
        glowTransform: getComputedStyle(glow).transform,
        gridTransform: getComputedStyle(grid).transform,
      };
    });
    console.log(label, JSON.stringify(data, null, 2));
  };

  await read('initial');
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(300);
  await read('after1200');
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(300);
  await read('after2100');
  await browser.close();
})();
