(function () {
  var SIZE = 64;
  var BACKGROUND = "#000000";
  var INVERTED_BACKGROUND = "#ffffff";
  var INVERTED_TEXT_COLOR = "#ffffff";
  var TEXT_COLOR = "#58a6ff";
  var FIRST_PART = "M11";
  var SECOND_PART = "Nik";
  var SWITCH_DELAY_MS = 1000;
  var parts = [FIRST_PART, SECOND_PART];
  var currentIndex = 0;

  function getIconColors(text) {
    if (text === FIRST_PART) {
      return {
        background: BACKGROUND,
        text: INVERTED_TEXT_COLOR
      };
    }

    return {
      background: INVERTED_BACKGROUND,
      text: TEXT_COLOR
    };
  }

  function buildIcon(text) {
    var colors = getIconColors(text);
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
      colors.background +
      '"/>' +
      '<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="Consolas, monospace" font-size="24" font-weight="700" fill="' +
      colors.text +
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

  setFavicon(parts[currentIndex]);
  window.setInterval(function () {
    currentIndex = (currentIndex + 1) % parts.length;
    setFavicon(parts[currentIndex]);
  }, SWITCH_DELAY_MS);
})();
