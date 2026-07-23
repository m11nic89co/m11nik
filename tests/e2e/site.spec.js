const { expect, test } = require("@playwright/test");

const sitemapPaths = [
  "/",
  "/services/index.html",
  "/services/web/index.html",
  "/services/database/index.html",
  "/services/support/index.html",
  "/contacts/index.html",
  "/legal/index.html",
  "/legal/privacy/index.html",
  "/legal/cookies/index.html"
];

test.describe("site e2e", () => {
  for (const path of sitemapPaths) {
    test(`loads ${path} @seo`, async ({ page, request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);

      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/M11Nik/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/m11nik\.gitverse\.site\//);
    });
  }

  test("desktop navigation and main flows work", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only scenario");

    await page.goto("/");

    await page.getByRole("link", { name: "Услуги" }).click();
    await expect(page).toHaveURL(/\/services\/index\.html$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Услуги");
    await expect(page.getByRole("link", { name: "Веб-приложения" })).toHaveAttribute("href", "./web/index.html");
    await expect(page.getByRole("link", { name: "Базы данных" })).toHaveAttribute("href", "./database/index.html");
    await expect(page.getByRole("link", { name: "Сопровождение ПО" })).toHaveAttribute("href", "./support/index.html");

    await page.getByRole("link", { name: "Контакты" }).click();
    await expect(page).toHaveURL(/\/contacts\/index\.html$/);
    await expect(page.getByRole("link", { name: "89615246078@mail.ru" })).toHaveAttribute("href", "mailto:89615246078@mail.ru");
    await expect(page.getByRole("link", { name: "+7 961 524-60-78" })).toHaveAttribute("href", "tel:+79615246078");

    await page.locator("header").getByRole("link", { name: "Правовая информация" }).click();
    await expect(page).toHaveURL(/\/legal\/index\.html$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Правовая информация");

    await page.locator("header").getByRole("link", { name: "Главная" }).click();
    await expect(page).toHaveURL("/");
  });

  test("service cards and faq are interactive", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Базы данных" }).click();
    await expect(page).toHaveURL(/\/services\/database\/index\.html$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Базы данных");

    await page.goto("/");
    const details = page.locator("details").first();
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
  });

  test("cookie consent persists", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("m11nik_cookie_consent"));
    await page.reload();

    const banner = page.locator(".cookie-banner");
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: "Только необходимые" }).click();
    await expect(banner).toBeHidden();

    await page.reload();
    await expect(page.locator(".cookie-banner")).toHaveCount(0);
  });

  test("site logo has a typing caret after Nik", async ({ page }) => {
    await page.goto("/");

    const logo = page.locator(".logo");
    const caretLocator = logo.locator(".logo-caret");
    await expect(logo).toContainText("M11Nik");
    await expect(logo.locator("span").first()).toHaveText("Nik");
    await expect(caretLocator).toHaveCount(1);

    const caret = await caretLocator.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        display: styles.display,
        height: styles.height,
        marginLeft: styles.marginLeft,
        previousText: element.previousSibling.textContent,
        width: styles.width
      };
    });

    expect(caret.backgroundColor).toBe("rgb(230, 237, 243)");
    expect(caret.display).toBe("inline-block");
    expect(parseFloat(caret.height)).toBeGreaterThan(12);
    expect(parseFloat(caret.marginLeft)).toBeGreaterThan(0);
    expect(caret.previousText).toBe("Nik");
    expect(parseFloat(caret.width)).toBeGreaterThanOrEqual(1);
    expect(parseFloat(caret.width)).toBeLessThanOrEqual(2);

    await expect.poll(async () => caretLocator.evaluate((element) => element.classList.contains("logo-caret--hidden"))).toBe(false);
    await expect.poll(async () => caretLocator.evaluate((element) => element.classList.contains("logo-caret--hidden"))).toBe(true);
  });

  test("brand icon loops from M11 to Nik", async ({ page }) => {
    await page.goto("/");

    const readIconSvg = async () => {
      const icon = await page.locator('link[rel="icon"]').getAttribute("href");
      expect(icon).toContain("data:image/svg+xml");
      return decodeURIComponent(icon.split(",")[1]);
    };

    const waitForIconPart = async (part) => {
      let matchedSvg = "";
      await expect.poll(async () => {
        const svg = await readIconSvg();
        if (svg.includes(">" + part + "<")) {
          matchedSvg = svg;
        }

        return matchedSvg;
      }).toContain(">" + part + "<");
      return matchedSvg;
    };

    const firstSvg = await waitForIconPart("M11");
    expect(firstSvg).toContain('<rect width="64" height="64" fill="#000000"');
    expect(firstSvg).toContain('fill="#ffffff"');
    expect(firstSvg).toContain(">M11<");
    expect(firstSvg).not.toContain(">Nik<");

    const secondSvg = await waitForIconPart("Nik");
    expect(secondSvg).toContain('<rect width="64" height="64" fill="#ffffff"');
    expect(secondSvg).toContain('fill="#58a6ff"');
    expect(secondSvg).toContain(">Nik<");
    expect(secondSvg).not.toContain(">M11<");

    const thirdSvg = await waitForIconPart("M11");
    expect(thirdSvg).toContain('<rect width="64" height="64" fill="#000000"');
    expect(thirdSvg).toContain('fill="#ffffff"');
    expect(thirdSvg).toContain(">M11<");
    expect(thirdSvg).not.toContain(">Nik<");
  });

  test("internal links and service resources are healthy @seo", async ({ page, request }) => {
    const seenPaths = new Set();

    for (const path of sitemapPaths) {
      await page.goto(path);
      const links = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.href).filter((href) => href.startsWith(location.origin))
      );

      for (const href of links) {
        seenPaths.add(new URL(href).pathname);
      }
    }

    for (const path of seenPaths) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }

    await expect((await request.get("/portfolio/index.html")).status()).toBe(404);
    await expect((await request.get("/home.html")).status()).toBe(404);
  });

  test("robots and sitemap are available @seo", async ({ request }) => {
    await expect((await request.get("/robots.txt")).status()).toBe(200);
    const sitemap = await request.get("/sitemap.txt");
    expect(sitemap.status()).toBe(200);
    await expect(sitemap.text()).resolves.not.toContain("/portfolio/");
    await expect(sitemap.text()).resolves.not.toContain("/home.html");
  });
});

test.describe("mobile e2e", () => {
  test("mobile menu opens, navigates, and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only scenario");

    await page.goto("/");
    await expect(page.locator(".nav-toggle")).toBeVisible();
    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");

    await page.locator(".nav-toggle").click();
    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".nav")).toBeVisible();

    await page.locator("header").getByRole("link", { name: "Контакты" }).click();
    await expect(page).toHaveURL(/\/contacts\/index\.html$/);
    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate((html) => html.clientWidth));
  });
});
