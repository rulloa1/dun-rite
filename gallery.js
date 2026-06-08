/* ============ DunRite projects gallery (filter + lightbox) ============ */
(function () {
  "use strict";
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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
})();
