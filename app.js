/* ============ DunRite homepage interactions ============ */
(function () {
  "use strict";

  /* ---- mobile drawer ---- */
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  var drawerClose = document.getElementById("drawerClose");
  function openDrawer() { drawer.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { drawer.classList.remove("open"); document.body.style.overflow = ""; }
  if (burger) burger.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("[data-close]").forEach(function (a) {
    a.addEventListener("click", closeDrawer);
  });

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- animated counters ---- */
  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var dur = 1500, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }
  var ticker = document.querySelector(".ticker");
  if (ticker) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); io2.disconnect(); } });
    }, { threshold: 0.4 });
    io2.observe(ticker);
  }

  /* ---- portfolio filter ---- */
  var filterWrap = document.getElementById("filters");
  var tiles = Array.prototype.slice.call(document.querySelectorAll("#grid .tile"));
  if (filterWrap) {
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filterWrap.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-f");
      tiles.forEach(function (t) {
        var show = f === "all" || t.getAttribute("data-cat") === f;
        t.classList.toggle("hide", !show);
      });
    });
  }

  /* ---- lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  tiles.forEach(function (t) {
    t.addEventListener("click", function () {
      lbImg.src = t.getAttribute("data-img");
      lbImg.alt = t.getAttribute("data-title") || "";
      lbCap.textContent = (t.getAttribute("data-title") || "") + " — " + (t.getAttribute("data-sub") || "");
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  function closeLb() { lightbox.classList.remove("open"); document.body.style.overflow = ""; }
  if (lbClose) lbClose.addEventListener("click", closeLb);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeLb(); closeDrawer(); } });

  /* ---- testimonials slider ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".testi-item"));
  var dotsWrap = document.getElementById("tDots");
  var idx = 0, timer = null;
  items.forEach(function (_, i) {
    var d = document.createElement("i");
    if (i === 0) d.classList.add("on");
    d.addEventListener("click", function () { go(i); reset(); });
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);
  function go(n) {
    idx = (n + items.length) % items.length;
    items.forEach(function (it, i) { it.classList.toggle("active", i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle("on", i === idx); });
  }
  function reset() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
  var tNext = document.getElementById("tNext");
  var tPrev = document.getElementById("tPrev");
  if (tNext) tNext.addEventListener("click", function () { go(idx + 1); reset(); });
  if (tPrev) tPrev.addEventListener("click", function () { go(idx - 1); reset(); });
  reset();
})();
