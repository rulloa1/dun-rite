/* ============ DunRite shared header + footer (injected) ============ */
(function () {
  "use strict";
  var LOGO = (window.__resources && window.__resources.logo) || "https://www.dunriteconstructiongroup.com/wp-content/uploads/2025/09/Dunrite-Logo_invert-e1758651959544.png";
  var page = document.body.getAttribute("data-page") || "";

  var links = [
    { k: "about", t: "About", h: "about.html" },
    { k: "services", t: "Services", h: "services.html" },
    { k: "projects", t: "Projects", h: "projects.html" },
    { k: "contact", t: "Contact", h: "contact.html" },
  ];
  function navHTML(cls) {
    return links.map(function (l) {
      return '<a class="' + cls + (l.k === page ? " current" : "") + '" href="' + l.h + '"' + (l.k === page ? ' aria-current="page"' : "") + '>' + l.t + "</a>";
    }).join("");
  }

  var header =
    '<div class="utility"><div class="wrap">' +
    '<a href="tel:3525884050"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>(352) 588-4050</a>' +
    '<a class="u-hide" href="mailto:bids@dunriteconstruct.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>bids@dunriteconstruct.com</a>' +
    '<span class="sep"></span><span class="hours u-hide">MON\u2013FRI \u00b7 8:00\u20135:00</span>' +
    '<a class="crosslink u-hide" href="drc/index.html">Need remodeling? Visit DRC Homes \u2192</a>' +
    "</div></div>" +
    '<header class="header"><div class="wrap">' +
    '<a class="brand" href="the-build.html" aria-label="DunRite Construction Group"><img src="' + LOGO + '" alt="DunRite Construction Group" /></a>' +
    '<nav class="nav">' + navHTML("") + "</nav><span class=\"spacer\"></span>" +
    '<div class="cta-wrap"><a class="phone" href="tel:3525884050">(352) 588-4050</a>' +
    '<a class="btn btn-accent" href="contact.html">Get a Quote <span class="arr">\u2192</span></a></div>' +
    '<button class="burger" id="burger" aria-label="Open menu"><span></span></button>' +
    "</div></header>" +
    '<div class="drawer" id="drawer"><div class="d-top"><img src="' + LOGO + '" alt="DunRite" />' +
    '<button class="close" id="drawerClose" aria-label="Close menu">\u00d7</button></div>' +
    '<nav>' + navHTML("") + '</nav>' +
    '<div class="d-cta"><a class="btn btn-accent" href="tel:3525884050">Call (352) 588-4050</a>' +
    '<a class="btn btn-ghost" href="contact.html">Get a Free Quote</a></div></div>';

  var footer =
    '<footer class="footer"><div class="wrap"><div class="foot-grid">' +
    '<div class="f-brand"><img src="' + LOGO + '" alt="DunRite Construction Group" />' +
    "<p>A Florida-based shell and concrete contractor with over 25 years of experience. From slabs to full shells, we're the one-call partner for developers, builders, and homeowners who demand it done right.</p>" +
    '<div class="areas" style="margin-top:22px;"><span>Citrus</span><span>Hernando</span><span>Hillsborough</span><span>Lake</span><span>Manatee</span><span>Marion</span><span>Pasco</span><span>Pinellas</span><span>Polk</span><span>Sumter</span></div></div>' +
    '<div><h5>Quick Links</h5><ul><li><a href="about.html">About</a></li><li><a href="services.html">Services</a></li><li><a href="projects.html">Past Projects</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>' +
    '<div><h5>Services</h5><ul><li><a href="services.html">Full Shell Packages</a></li><li><a href="services.html">Custom Home Shells</a></li><li><a href="services.html">Developer Concrete</a></li><li><a href="services.html">Slabs &amp; Block Walls</a></li><li><a href="services.html">Decorative Concrete</a></li></ul></div>' +
    '<div><h5>Contact Info</h5><div class="ci">' +
    '<div class="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>12412 Curley St,<br />San Antonio, FL 33576</span></div>' +
    '<div class="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:3525884050">(352) 588-4050</a></div>' +
    '<div class="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg><a href="mailto:bids@dunriteconstruct.com">bids@dunriteconstruct.com</a></div>' +
    '<div class="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Mon\u2013Fri \u00b7 8:00 AM \u2013 5:00 PM</span></div>' +
    "</div></div></div>" +
    '<div class="foot-bottom"><span>DunRite Construction Group, LLC \u00a9 2026 \u00b7 All Rights Reserved</span>' +
    '<div class="socials">' +
    '<a href="https://www.instagram.com/concrete_cowboys_fl/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' +
    '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>' +
    '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.3 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9z"/></svg></a>' +
    "</div></div></div></footer>";

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  /* drawer */
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  var drawerClose = document.getElementById("drawerClose");
  function closeDrawer() { if (drawer) { drawer.classList.remove("open"); document.body.style.overflow = ""; } }
  if (burger) burger.addEventListener("click", function () { drawer.classList.add("open"); document.body.style.overflow = "hidden"; });
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawer) drawer.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", closeDrawer); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  /* scroll reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* counters */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io3.disconnect();
        var target = parseInt(el.getAttribute("data-count"), 10), start = null, dur = 1500;
        function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target); if (p < 1) requestAnimationFrame(step); else el.textContent = target; }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    io3.observe(el);
  });
})();
