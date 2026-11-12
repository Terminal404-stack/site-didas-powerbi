/* Painel admin DIDAS — interações do FRONT (mock, sem backend). */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ano */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* nav ativa da sidebar pela página atual */
  var current = (location.pathname.split("/").pop() || "index.html");
  $$(".sb-nav a").forEach(function (a) {
    if (a.getAttribute("href") === current) a.setAttribute("aria-current", "page");
  });

  /* sidebar mobile */
  var toggle = $(".sb-toggle");
  var sidebar = $(".sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".sb-nav a", sidebar).forEach(function (a) {
      a.addEventListener("click", function () { sidebar.classList.remove("open"); });
    });
  }

  /* filtros por status */
  function applyFilter(val) {
    $$("tr.lead").forEach(function (row) {
      row.hidden = !(val === "todos" || row.getAttribute("data-status") === val);
    });
  }
  $$(".filter").forEach(function (f) {
    f.addEventListener("click", function () {
      $$(".filter").forEach(function (x) { x.classList.remove("is-active"); });
      f.classList.add("is-active");
      applyFilter(f.getAttribute("data-filter"));
    });
  });

  /* busca */
  var search = $("#search");
  if (search) {
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      $$("tr.lead").forEach(function (row) {
        var hay = (row.getAttribute("data-nome") + " " + row.getAttribute("data-empresa")).toLowerCase();
        row.hidden = q && hay.indexOf(q) === -1;
      });
    });
  }

  /* drawer de detalhe */
  var drawer = $("#drawer");
  var overlay = $("#drawer-overlay");
  function fill(id, val) { var el = $(id, drawer); if (el) el.textContent = val || "—"; }
  function openDrawer(row) {
    if (!drawer) return;
    fill("#d-nome", row.getAttribute("data-nome"));
    fill("#d-empresa", row.getAttribute("data-empresa"));
    fill("#d-contato", row.getAttribute("data-contato"));
    fill("#d-desafios", row.getAttribute("data-desafios"));
    fill("#d-organiza", row.getAttribute("data-organiza"));
    fill("#d-mensagem", row.getAttribute("data-mensagem"));
    fill("#d-origem", row.getAttribute("data-origem"));
    fill("#d-data", row.getAttribute("data-data"));
    var st = $("#d-status", drawer);
    if (st) { st.className = "badge " + (row.getAttribute("data-status") || "novo"); st.textContent = row.getAttribute("data-status") || "novo"; }
    overlay.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    var c = $(".drawer-close", drawer); if (c) c.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true;
  }
  $$("tr.lead").forEach(function (row) {
    row.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      openDrawer(row);
    });
  });
  if (overlay) overlay.addEventListener("click", closeDrawer);
  $$(".drawer-close").forEach(function (b) { b.addEventListener("click", closeDrawer); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
})();
