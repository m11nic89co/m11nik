(function () {
  var CONSENT_KEY = "m11nik_cookie_consent";

  function analyticsAllowed() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      return !!JSON.parse(raw).analytics;
    } catch (e) {
      return false;
    }
  }

  function counterId() {
    var id = window.M11NIK_METRIKA_ID;
    return typeof id === "number" && id > 0 ? id : 0;
  }

  function loadMetrika() {
    var id = counterId();
    if (!id || !analyticsAllowed() || window.__m11nikMetrikaLoaded) return;
    window.__m11nikMetrikaLoaded = true;

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    window.ym(id, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
  }

  window.M11NikLoadMetrika = loadMetrika;

  if (analyticsAllowed()) {
    loadMetrika();
  }

  window.addEventListener("m11nik:consent", function (ev) {
    if (ev.detail && ev.detail.analytics) {
      loadMetrika();
    }
  });
})();
