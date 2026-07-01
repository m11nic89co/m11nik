(function () {
  var KEY = "m11nik_cookie_consent";
  var COOKIE_POLICY = "https://m11nik.gitverse.site/legal/cookies/index.html";
  var PRIVACY_POLICY = "https://m11nik.gitverse.site/legal/privacy/index.html";

  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(essential, analytics) {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        essential: !!essential,
        analytics: !!analytics,
        ts: new Date().toISOString()
      })
    );
    window.dispatchEvent(
      new CustomEvent("m11nik:consent", {
        detail: { essential: !!essential, analytics: !!analytics }
      })
    );
  }

  function removeBanner(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  if (readConsent()) {
    return;
  }

  var banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Уведомление о cookie");
  banner.innerHTML =
    '<div class="cookie-banner__inner container">' +
    "<p><strong>Cookie и персональные данные.</strong> " +
    "Необходимые технологии (localStorage) запоминают ваш выбор. " +
    "По кнопке «Принять» может подключаться <strong>Яндекс.Метрика</strong> (статистика, серверы в РФ). " +
    "Google Analytics и иные зарубежные счётчики <strong>не используются</strong>. " +
    'Подробнее — <a href="' +
    COOKIE_POLICY +
    '">Политика cookie</a>, <a href="' +
    PRIVACY_POLICY +
    '">Политика ПДн</a>.</p>' +
    '<div class="cookie-banner__actions">' +
    '<button type="button" class="btn cookie-banner__accept">Принять</button>' +
    '<button type="button" class="btn cookie-banner__essential">Только необходимые</button>' +
    "</div></div>";

  document.body.appendChild(banner);

  banner.querySelector(".cookie-banner__accept").addEventListener("click", function () {
    writeConsent(true, true);
    removeBanner(banner);
  });

  banner.querySelector(".cookie-banner__essential").addEventListener("click", function () {
    writeConsent(true, false);
    removeBanner(banner);
  });
})();
