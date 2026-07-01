(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var nav = header.querySelector(".nav");
  if (!nav) return;

  if (!nav.id) {
    nav.id = "site-nav";
  }

  var toggle = header.querySelector(".nav-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Открыть меню");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.innerHTML =
      '<span class="nav-toggle__bar" aria-hidden="true"></span>' +
      '<span class="nav-toggle__bar" aria-hidden="true"></span>' +
      '<span class="nav-toggle__bar" aria-hidden="true"></span>';
    nav.parentNode.insertBefore(toggle, nav);
  }

  function setOpen(open) {
    header.classList.toggle("site-header--nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("site-header--nav-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 769px)").matches) {
      setOpen(false);
    }
  });
})();
