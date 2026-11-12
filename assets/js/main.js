/* ============================================================
   DIDAS — comportamento do site (multi-página, front-end)
   Cada bloco é guardado: roda só se os elementos existem na página.
   Envio do formulário é STUB (M3 liga ao PHP).
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var STORE = "didas_desafios";

  function readSel() {
    try { return JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { return []; }
  }
  function writeSel(arr) {
    try { localStorage.setItem(STORE, JSON.stringify(arr)); } catch (e) { /* storage indisponível: segue sem persistir */ }
  }

  /* ---------- ano no rodapé ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav ativa pela página atual ---------- */
  var current = location.pathname.split("/").pop() || "index.html";
  if (current === "") current = "index.html";
  $$(".nav a, .drawer a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === current) a.setAttribute("aria-current", "page");
  });

  /* ---------- menu mobile (drawer) ---------- */
  var toggle = $(".nav-toggle");
  var drawer = $("#drawer");
  if (toggle && drawer) {
    var closeMenu = function () { toggle.setAttribute("aria-expanded", "false"); drawer.hidden = true; };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      drawer.hidden = open;
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { closeMenu(); toggle.focus(); }
    });
  }

  /* ---------- reveal de entrada (1x) ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var rObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { rObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- PÁGINA DESAFIO: ledger -> frase + storage ---------- */
  var ledger = $$(".ledger-row");
  var echo = $("#challenge-echo");
  if (ledger.length) {
    var selected = readSel();

    var updateEcho = function () {
      if (!echo) return;
      if (!selected.length) { echo.textContent = "Selecione um cenário acima para começar."; return; }
      var lower = selected.map(function (s) { return s.toLowerCase(); });
      var lista = lower.length === 1 ? lower[0] : lower.slice(0, -1).join(", ") + " e " + lower[lower.length - 1];
      echo.innerHTML = "Seu próximo passo pode começar por organizar <b>" + lista + "</b>.";
    };

    ledger.forEach(function (row) {
      var val = row.getAttribute("data-challenge");
      row.setAttribute("aria-pressed", String(selected.indexOf(val) !== -1));
      row.addEventListener("click", function () {
        var i = selected.indexOf(val);
        if (i === -1) selected.push(val); else selected.splice(i, 1);
        row.setAttribute("aria-pressed", String(i === -1));
        writeSel(selected);
        updateEcho();
      });
    });
    updateEcho();
  }

  /* ---------- abas do painel demo ---------- */
  var tabs = $$(".tab");
  if (tabs.length) {
    var activateTab = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) { panel.classList.toggle("is-active", on); panel.hidden = !on; }
      });
    };
    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () { activateTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var next;
        if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
        else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        else return;
        e.preventDefault();
        tabs[next].focus();
        activateTab(tabs[next]);
      });
    });
  }

  /* ---------- etapas (processo) ---------- */
  $$(".step-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      var step = btn.closest(".step");
      if (step) step.setAttribute("data-open", String(!open));
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = open;
    });
  });

  /* ---------- WhatsApp ---------- */
  // TODO: cliente — número oficial (só dígitos, com DDI). Ex.: 5511999999999
  var WHATSAPP_NUMERO = "";
  var WHATSAPP_MSG = "Olá! Conheci a DIDAS pelo site e quero entender como um projeto de Power BI pode ajudar na gestão do meu negócio.";
  // fonte única: preenchendo WHATSAPP_NUMERO, o rodapé de todas as páginas e o botão passam a usá-lo
  var waText = $("#wa-text");
  if (waText && WHATSAPP_NUMERO) waText.textContent = WHATSAPP_NUMERO;
  var waBtn = $("#whatsapp-btn");
  if (waBtn) {
    if (WHATSAPP_NUMERO) {
      waBtn.href = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(WHATSAPP_MSG);
    } else {
      waBtn.addEventListener("click", function (e) { e.preventDefault(); alert("Número de WhatsApp ainda não configurado. (TODO: cliente)"); });
    }
  }

  /* ---------- PÁGINA CONTATO: formulário ---------- */
  var form = $("#lead-form");
  if (!form) return;

  // pré-marca desafios vindos da página "O desafio"
  var carried = readSel();
  if (carried.length) {
    $$("input[name='desafio']", form).forEach(function (chk) {
      if (carried.indexOf(chk.value) !== -1) chk.checked = true;
    });
  }

  var summary = $("#form-errors");
  var contatoErr = form.querySelector(".err-contato");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showErr(name, msg) {
    var el = form.querySelector(".err[data-for='" + name + "']");
    var fields = $$("[name='" + name + "']", form);
    if (el) { el.textContent = msg; el.classList.add("show"); }
    fields.forEach(function (f) { f.setAttribute("aria-invalid", "true"); if (el && el.id) f.setAttribute("aria-describedby", el.id); });
    var wrap = fields[0] && fields[0].closest(".field");
    if (wrap) wrap.classList.add("invalid");
  }
  function clearErr(name) {
    var el = form.querySelector(".err[data-for='" + name + "']");
    var fields = $$("[name='" + name + "']", form);
    if (el) el.classList.remove("show");
    fields.forEach(function (f) { f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby"); });
    var wrap = fields[0] && fields[0].closest(".field");
    if (wrap) wrap.classList.remove("invalid");
  }
  function markContato(on) {
    [form.email, form.whatsapp].forEach(function (f) {
      if (on) { f.setAttribute("aria-invalid", "true"); if (contatoErr && contatoErr.id) f.setAttribute("aria-describedby", contatoErr.id); }
      else { f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby"); }
    });
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.website && form.website.value) { return; } // honeypot

    var nome = form.nome.value.trim();
    var empresa = form.empresa.value.trim();
    var email = form.email.value.trim();
    var whats = form.whatsapp.value.trim();
    var consent = form.consent.checked;
    var desafios = $$("input[name='desafio']", form).filter(function (c) { return c.checked; });

    ["nome", "empresa", "desafio", "consent"].forEach(clearErr);
    if (contatoErr) contatoErr.classList.remove("show");
    markContato(false);

    var errors = [];
    if (!nome) { showErr("nome", "Informe seu nome."); errors.push("Informe seu nome."); }
    if (!empresa) { showErr("empresa", "Informe empresa ou segmento."); errors.push("Informe empresa ou segmento."); }
    if (!email && !whats) {
      if (contatoErr) { contatoErr.textContent = "Informe ao menos e-mail ou WhatsApp."; contatoErr.classList.add("show"); }
      markContato(true); errors.push("Informe ao menos e-mail ou WhatsApp.");
    } else if (email && !isEmail(email)) {
      if (contatoErr) { contatoErr.textContent = "E-mail inválido."; contatoErr.classList.add("show"); }
      markContato(true); errors.push("E-mail inválido.");
    }
    if (!desafios.length) { showErr("desafio", "Selecione ao menos um desafio."); errors.push("Selecione ao menos um desafio."); }
    if (!consent) { showErr("consent", "Precisamos da sua autorização para o contato."); errors.push("Precisamos da sua autorização para o contato."); }

    if (errors.length) {
      if (summary) {
        summary.innerHTML = "<strong>Revise " + errors.length + (errors.length === 1 ? " campo" : " campos") + ":</strong><ul>" +
          errors.map(function (m) { return "<li>" + m + "</li>"; }).join("") + "</ul>";
        summary.hidden = false;
        summary.focus();
      }
      return;
    }
    if (summary) summary.hidden = true;

    // TODO: M3 — trocar este stub por fetch POST para api/submit-lead.php
    try { localStorage.removeItem(STORE); } catch (e) {}
    var success = $("#form-success");
    form.querySelector("button[type='submit']").disabled = true;
    if (success) {
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
      success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
  });

  $$("#lead-form input, #lead-form select").forEach(function (el) {
    el.addEventListener("input", function () {
      if (el.name) clearErr(el.name);
      if (el.name === "email" || el.name === "whatsapp") {
        if (contatoErr) contatoErr.classList.remove("show");
        markContato(false);
      }
    });
  });
})();
