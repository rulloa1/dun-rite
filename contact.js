/* ============ DunRite quote form ============ */
(function () {
  "use strict";
  var form = document.getElementById("quoteForm");
  if (!form) return;
  var steps = Array.prototype.slice.call(document.querySelectorAll(".fstep"));
  var stepTabs = Array.prototype.slice.call(document.querySelectorAll("#steps .st"));
  var nextBtn = document.getElementById("nextBtn");
  var backBtn = document.getElementById("backBtn");
  var submitBtn = document.getElementById("submitBtn");
  var actions = document.getElementById("actions");
  var success = document.getElementById("success");
  var recap = document.getElementById("recap");
  var cur = 0;
  var selectedTypes = [];

  /* chips (multi-select) */
  var chips = Array.prototype.slice.call(document.querySelectorAll("#typeChips .chip"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      c.classList.toggle("sel");
      var v = c.getAttribute("data-val");
      var i = selectedTypes.indexOf(v);
      if (i >= 0) selectedTypes.splice(i, 1); else selectedTypes.push(v);
      var fld = document.getElementById("typeChips").closest(".field");
      if (selectedTypes.length) fld.classList.remove("err");
    });
  });

  function showStep(n) {
    cur = n;
    steps.forEach(function (s, i) { s.classList.toggle("on", i === n); });
    stepTabs.forEach(function (t, i) {
      t.classList.toggle("active", i === n);
      t.classList.toggle("done", i < n);
    });
    backBtn.style.display = n === 0 ? "none" : "inline-flex";
    nextBtn.style.display = n === steps.length - 1 ? "none" : "inline-flex";
    submitBtn.style.display = n === steps.length - 1 ? "inline-flex" : "none";
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validPhone(v) { return (v.replace(/[^0-9]/g, "").length >= 10); }

  function validateStep(n) {
    var ok = true;
    var stepEl = steps[n];
    stepEl.querySelectorAll("[data-required]").forEach(function (el) {
      var fld = el.closest(".field");
      var v = (el.value || "").trim();
      var bad = !v;
      if (!bad && el.hasAttribute("data-email")) bad = !validEmail(v);
      if (!bad && el.hasAttribute("data-phone")) bad = !validPhone(v);
      fld.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    var chipWrap = stepEl.querySelector("[data-required-chips]");
    if (chipWrap) {
      var fld = chipWrap.closest(".field");
      var bad = selectedTypes.length === 0;
      fld.classList.toggle("err", bad);
      if (bad) ok = false;
    }
    return ok;
  }

  /* clear error on input */
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () {
      var fld = el.closest(".field");
      if (fld) fld.classList.remove("err");
    });
  });

  nextBtn.addEventListener("click", function () {
    if (validateStep(cur)) showStep(Math.min(cur + 1, steps.length - 1));
  });
  backBtn.addEventListener("click", function () { showStep(Math.max(cur - 1, 0)); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(cur)) return;
    var data = new FormData(form);
    var rows = [
      ["Name", data.get("name")],
      ["Company", data.get("company") || "—"],
      ["Email", data.get("email")],
      ["Phone", data.get("phone")],
      ["Work", selectedTypes.join(", ")],
      ["County", data.get("county")],
      ["Budget", data.get("budget")],
      ["Timeline", data.get("timeline")],
    ];
    recap.innerHTML = rows.map(function (r) {
      return '<div class="r"><b>' + r[0] + "</b><span>" + (r[1] || "—") + "</span></div>";
    }).join("");
    steps.forEach(function (s) { s.classList.remove("on"); });
    actions.style.display = "none";
    document.getElementById("steps").style.display = "none";
    success.classList.add("on");
    success.scrollIntoView ? null : null; // avoid scrollIntoView per guidelines
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  });

  showStep(0);
})();
