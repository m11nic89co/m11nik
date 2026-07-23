(function () {
  var SIZE = 64;
  var BACKGROUND = "#000000";
  var TEXT_COLOR = "#58a6ff";
  var FIRST_PART = "M11";
  var SECOND_PART = "Nik";
  var SWITCH_DELAY_MS = 1000;

  function buildIcon(text) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      SIZE +
      " " +
      SIZE +
      '">' +
      '<rect width="' +
      SIZE +
      '" height="' +
      SIZE +
      '" fill="' +
      BACKGROUND +
      '"/>' +
      '<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="Consolas, monospace" font-size="24" font-weight="700" fill="' +
      TEXT_COLOR +
      '">' +
      text +
      "</text></svg>";

    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function ensureIconLink() {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
    }

    return link;
  }

  function setFavicon(text) {
    ensureIconLink().href = buildIcon(text);
    window.__m11nikFaviconState = text;
  }

  setFavicon(FIRST_PART);
  window.setTimeout(function () {
    setFavicon(SECOND_PART);
  }, SWITCH_DELAY_MS);
})();
