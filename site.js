/* SmartEarn AI — shared script. Loads after config.js on every page. */
(function () {
  "use strict";
  var C = BUSINESS_CONFIG, E = C.easypaisa;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var WA_BASE = C.whatsapp.url || ("https://wa.me/" + C.whatsapp.number);
  var W = function (m) { return WA_BASE + "?text=" + encodeURIComponent(m); };
  var rs = function (n) { return "Rs. " + Number(n).toLocaleString("en-US"); };

  /* ---------- Header + footer (same on every page) ---------- */
  var P = [["index.html","Home"],["services.html","Services"],["portfolio.html","Portfolio"],["order.html","Order CV"],["payment.html","Payment"],["contact.html","Contact"]];
  var cur = location.pathname.split("/").pop() || "index.html";
  var link = function (a) { return '<a href="' + a[0] + '"' + (a[0] === cur ? ' class="on" aria-current="page"' : "") + ">" + a[1] + "</a>"; };
  var hd = $("#hd"), ft = $("#ft");
  if (hd) hd.innerHTML = '<div class="w bar"><a class="logo" href="index.html">SmartEarn <b>AI</b></a><button id="mb" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nv">&#9776;</button><nav id="nv" aria-label="Main menu">' + P.map(link).join("") + "</nav></div>";
  if (ft) ft.innerHTML = '<div class="w"><p><b>' + C.name + "</b><br>" + C.tagline + "</p><p>" + P.map(link).join("") + '<a href="contact.html#privacy">Privacy Policy</a></p><p>&copy; ' + new Date().getFullYear() + " " + C.name + "</p></div>";

  /* ---------- Mobile menu ---------- */
  var mb = $("#mb");
  if (mb) mb.addEventListener("click", function () {
    var o = $("#nv").classList.toggle("open");
    mb.setAttribute("aria-expanded", o);
    mb.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  });

  /* ---------- WhatsApp buttons: data-wa="pre-filled message" ---------- */
  $$("[data-wa]").forEach(function (a) { a.href = W(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Prices: data-price="student" ---------- */
  $$("[data-price]").forEach(function (e) { e.textContent = rs(C.prices[e.dataset.price]); });

  /* ---------- Easypaisa details (separate from WhatsApp) ---------- */
  var ok = !!(E.number && E.accountHolder);
  $$("[data-ep]").forEach(function (e) { e.textContent = E[e.dataset.ep] || ""; });
  $$("[data-ep-ok]").forEach(function (e) { e.hidden = !ok; });
  $$("[data-ep-no]").forEach(function (e) { e.hidden = ok; });

  /* ---------- Contact placeholders: data-c="email" | "facebook" ---------- */
  $$("[data-c]").forEach(function (e) {
    var v = C[e.dataset.c];
    if (v) {
      e.href = (e.dataset.c === "email" ? "mailto:" : "") + v;
      e.textContent = v;
      if (e.dataset.c === "facebook") { e.target = "_blank"; e.rel = "noopener"; }
    } else {
      e.textContent = "Coming soon";
      e.removeAttribute("href");
    }
  });

  /* ---------- Portfolio sample previews: data-t="panel-id" ---------- */
  $$("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = $("#" + b.dataset.t), show = p.hidden;
      p.hidden = !show;
      b.setAttribute("aria-expanded", show);
      b.textContent = show ? "Hide Sample" : "Preview Sample";
    });
  });

  /* ---------- Order form (order.html only) ---------- */
  var f = $("#of");
  if (!f) return;

  // 1. Fill the CV Type dropdown from config.js
  var sel = $("#cv");
  sel.innerHTML = '<option value="">Select CV type</option>' + Object.keys(C.types).map(function (k) {
    return '<option value="' + k + '">' + C.types[k] + " — " + rs(C.prices[k]) + "</option>";
  }).join("");
  var t = new URLSearchParams(location.search).get("type"); // from services.html links
  if (t && C.types[t]) sel.value = t;

  // 2. Keep Education and Skills empty on load (also after Android back/reload restore)
  var clearFields = function () {
    ["edu", "sk"].forEach(function (i) {
      var e = $("#" + i);
      if (e) { e.setAttribute("autocomplete", "off"); e.value = ""; }
    });
  };
  clearFields();
  window.addEventListener("load", clearFields);
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) clearFields(); });

  // 3. Validation + WhatsApp order message
  var g = function (i) { return $("#" + i).value.trim(); };
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var R = {
      fn: g("fn").length < 3 && "Enter your full name (at least 3 letters).",
      ph: !/^(\+?92|0)3\d{9}$/.test(g("ph").replace(/[\s-]/g, "")) && "Enter a valid Pakistani mobile number, like 03XXXXXXXXX.",
      em: g("em") && !/^\S+@\S+\.\S+$/.test(g("em")) && "Enter a valid email or leave this empty.",
      city: !g("city") && "Enter your city.",
      cv: !g("cv") && "Select a CV type.",
      edu: !g("edu") && "Enter your education details.",
      sk: !g("sk") && "Enter your skills."
    }, first = null;
    for (var k in R) {
      var el = $("#" + k), bad = !!R[k];
      $("#e-" + k).textContent = R[k] || "";
      el.classList.toggle("bad", bad);
      el.setAttribute("aria-invalid", bad);
      if (bad && !first) first = el;
    }
    if (first) { first.focus(); return; }

    var m = "Hello SmartEarn AI! I want to order a CV.\n\n*ORDER SUMMARY*\n" +
      "Name: " + g("fn") + "\n" +
      "WhatsApp: " + g("ph") + "\n" +
      "Email: " + (g("em") || "-") + "\n" +
      "City: " + g("city") + "\n" +
      "CV Type: " + C.types[g("cv")] + " (" + rs(C.prices[g("cv")]) + ")\n" +
      "Education: " + g("edu") + "\n" +
      "Skills: " + g("sk") + "\n" +
      "Experience: " + (g("ex") || "None / fresher") + "\n" +
      "Languages: " + (g("lang") || "-") + "\n" +
      "Notes: " + (g("ins") || "-") + "\n\n" +
      "Please confirm my order and share the next steps.";

    // Confirmation screen first; the order is only placed when the customer sends it in WhatsApp
    var cf = $("#cf");
    $("#sum").textContent = m;
    $("#go").href = W(m);
    f.hidden = true;
    cf.hidden = false;
    cf.focus();
    cf.scrollIntoView({ behavior: "smooth" });
  });

  $("#ed").addEventListener("click", function () {
    $("#cf").hidden = true;
    f.hidden = false;
    f.scrollIntoView();
  });
})();
