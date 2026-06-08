/* =====================================================================
   DunRite — "THE BUILD" scroll experience engine
   Lenis smooth scroll + GSAP ScrollTrigger
   ===================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = window.gsap && window.ScrollTrigger;

  /* ---------- reel data: each clip is a DISTINCT kind of work, not one project ---------- */
  var STAGES = [
    { num: "01", kick: "Foundations / Slabs & Flatwork", title: "Poured Dead-Level",
      cap: "Footers dug, forms set, and slabs finished by hand on raw Florida ground — the base everything else stands on." },
    { num: "02", kick: "Concrete / At Scale", title: "The Pour",
      cap: "Thousands of yards placed, screeded, and finished at golden hour. The kind of flatwork that holds for decades." },
    { num: "03", kick: "Masonry / Block & Walls", title: "Walls That Stand",
      cap: "Engineered block laid and topped to spec — square, plumb, weather-tight, and built to last." },
    { num: "04", kick: "Shells / Turnkey Packages", title: "Full Shell, One Crew",
      cap: "Complete shell packages handled end-to-end: framed, decked, and delivered standing strong." },
    { num: "05", kick: "Developments / Community Scale", title: "Built for Builders",
      cap: "Large-scale concrete for whole neighborhoods, clubhouses, and amenity centers across ten counties." }
  ];
  var N = STAGES.length;

  /* ---------- preloader ---------- */
  function runPreloader(done) {
    var pre = document.getElementById("pre");
    var num = document.getElementById("preNum");
    var bar = document.getElementById("preBar");
    var logo = document.getElementById("preLogo");
    if (!pre) { done(); return; }

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      pre.style.display = "none";
      done();
    }

    if (reduced || !hasGSAP) {
      pre.style.display = "none";
      done();
      return;
    }

    // backstop: timers run even if rAF is throttled (e.g. unfocused preview),
    // so the page is NEVER left locked behind a stalled preloader.
    var backstop = setTimeout(function () {
      if (logo) { logo.style.opacity = 1; logo.style.transform = "none"; }
      finish();
    }, 3200);

    gsap.to(logo, { opacity: 1, y: 0, duration: .7, ease: "power3.out" });
    var obj = { v: 0 };
    gsap.to(obj, {
      v: 100, duration: 1.9, ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.round(obj.v);
        num.textContent = v;
        bar.style.width = v + "%";
      },
      onComplete: function () {
        gsap.to(pre, {
          yPercent: -100, duration: 1.0, ease: "power4.inOut", delay: .15,
          onStart: function () { pre.classList.add("hide"); },
          onComplete: function () { clearTimeout(backstop); finish(); }
        });
      }
    });
  }

  /* ---------- hero intro ---------- */
  function heroIntro() {
    if (reduced || !hasGSAP) {
      document.querySelectorAll("[data-hero-line],[data-hero-rv]").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from("[data-hero-line]", { yPercent: 115, duration: 1.1, stagger: .12 }, 0)
      .from("[data-hero-rv]", { opacity: 0, y: 24, duration: .9, stagger: .12 }, .35);
    // visibility backstop (in case the ticker is throttled before focus)
    setTimeout(function () {
      document.querySelectorAll("[data-hero-line],[data-hero-rv]").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
    }, 2600);
  }

  /* ---------- main scroll setup ---------- */
  function setupScroll() {
    if (!hasGSAP) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Lenis smooth scroll */
    var lenis = null;
    if (window.Lenis && !reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: .09 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* top scroll progress bar */
    var sb = document.getElementById("scrollbar");
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) { if (sb) sb.style.width = (self.progress * 100).toFixed(2) + "%"; }
    });

    /* hero parallax */
    var heroBg = document.getElementById("heroBg");
    if (heroBg && !reduced) {
      gsap.to(heroBg, {
        yPercent: 22, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    /* statement words reveal */
    var stmt = document.getElementById("statement");
    if (stmt) {
      var html = stmt.innerHTML;
      // wrap words (preserve <em>)
      var tmp = document.createElement("div"); tmp.innerHTML = html;
      function wrapNode(node, out) {
        node.childNodes.forEach(function (c) {
          if (c.nodeType === 3) {
            c.textContent.split(/(\s+)/).forEach(function (w) {
              if (w.trim()) { var s = document.createElement("span"); s.className = "word"; s.textContent = w; out.appendChild(s); }
              else out.appendChild(document.createTextNode(w));
            });
          } else {
            var clone = c.cloneNode(false);
            if (c.tagName === "EM") clone.classList.add ? null : null;
            wrapNode(c, clone); out.appendChild(clone);
          }
        });
      }
      var holder = document.createElement("span");
      wrapNode(tmp, holder);
      stmt.innerHTML = holder.innerHTML;
      var words = stmt.querySelectorAll(".word");
      if (!reduced) {
        gsap.to(words, {
          opacity: 1, ease: "none", stagger: .5,
          scrollTrigger: { trigger: stmt, start: "top 78%", end: "bottom 55%", scrub: true }
        });
      } else { words.forEach(function (w) { w.style.opacity = 1; }); }
    }

    /* ============ THE BUILD — pinned timelapse ============ */
    var frames = gsap.utils.toArray("#frames .frame");
    var imgs = frames.map(function (f) { return f.querySelector("video, img"); });
    var vids = frames.map(function (f) { return f.querySelector("video"); });
    function playOnly(i) {
      vids.forEach(function (v, k) {
        if (!v) return;
        if (k === i) { v.playbackRate = (window.__vrate || 0.6); var p = v.play(); if (p && p.catch) p.catch(function(){}); }
        else { try { v.pause(); } catch (e) {} }
      });
    }
    var bnum = document.getElementById("bnum");
    var bkick = document.getElementById("bkick");
    var btitle = document.getElementById("btitle");
    var bcap = document.getElementById("bcap");
    var clipN = document.getElementById("clipN");
    var meter = document.getElementById("meter");
    var railTk = gsap.utils.toArray("#rail .tk");
    var ui = document.querySelector(".build-ui .wrap");
    var curStage = 0;

    function pad(n) { return n < 10 ? "00" + n : n < 100 ? "0" + n : "" + n; }

    function setStage(i) {
      if (i === curStage) return;
      curStage = i;
      var s = STAGES[i];
      bnum.textContent = s.num;
      if (clipN) clipN.textContent = s.num;
      bkick.textContent = s.kick;
      btitle.textContent = s.title;
      bcap.textContent = s.cap;
      railTk.forEach(function (t, k) { t.classList.toggle("on", k === i); });
      playOnly(i);
      if (!reduced) {
        gsap.fromTo(ui, { y: 26, opacity: .25 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out", overwrite: true });
        gsap.fromTo(bnum, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .6, ease: "power3.out", overwrite: true });
      }
    }

    if (reduced) {
      // static: show last frame, full progress
      frames.forEach(function (f, i) { f.style.opacity = i === 0 ? 1 : 0; });
      if (meter) meter.style.width = "0%";
    } else {
      // crossfade timeline scrubbed across the pin
      // pace (per-stage scroll length, %) is live-tweakable via window.__pace
      if (window.__pace == null) window.__pace = 300;
      var buildEnd = function () { return "+=" + (N * (window.__pace || 300)) + "%"; };
      var segs = N - 1; // transitions
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#build",
          start: "top top",
          end: buildEnd,
          invalidateOnRefresh: true,
          scrub: 1.1,
          pin: "#buildPin",
          anticipatePin: 1,
          onUpdate: function (self) {
            var p = self.progress;
            if (meter) meter.style.width = Math.round(p * 100) + "%";
            var idx = Math.min(N - 1, Math.floor(p * N + 0.0001));
            setStage(idx);
          }
        }
      });
      // ken-burns the first frame in
      gsap.to(imgs[0], { scale: 1.0, ease: "none",
        scrollTrigger: { trigger: "#build", start: "top top", end: buildEnd, invalidateOnRefresh: true, scrub: .8 } });
      for (var i = 1; i < N; i++) {
        var pos = (i - 1) / segs;
        tl.to(frames[i], { opacity: 1, duration: 1 / segs, ease: "power1.inOut" }, pos)
          .fromTo(imgs[i], { scale: 1.16 }, { scale: 1.0, duration: 1 / segs, ease: "none" }, pos);
      }
      playOnly(0); // start the first clip immediately
    }

    /* ============ STATS count-up ============ */
    var counters = gsap.utils.toArray("#stats [data-to]");
    counters.forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-to"));
      ScrollTrigger.create({
        trigger: "#stats", start: "top 72%", once: true,
        onEnter: function () {
          if (reduced) { el.textContent = to; return; }
          var o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.8, ease: "power2.out",
            onUpdate: function () { el.textContent = Math.round(o.v); } });
        }
      });
    });

    /* ============ HORIZONTAL capabilities ============ */
    var track = document.getElementById("capTrack");
    if (track && !reduced) {
      var getX = function () { return -(track.scrollWidth - window.innerWidth); };
      gsap.to(track, {
        x: getX, ease: "none",
        scrollTrigger: {
          trigger: "#cap", start: "top top",
          end: function () { return "+=" + (track.scrollWidth - window.innerWidth + window.innerHeight); },
          scrub: 1, pin: ".cap-pin", anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    }

    /* generic reveals for .rv elements (creed, testimonials, etc.) */
    var rvEls = gsap.utils.toArray(".rv");
    if (rvEls.length) {
      if (reduced) {
        rvEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      } else {
        ScrollTrigger.batch(rvEls, {
          start: "top 86%",
          onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .12, overwrite: true });
          }
        });
        // safety: if a section never triggers, don't leave it hidden
        setTimeout(function () {
          rvEls.forEach(function (el) {
            if (getComputedStyle(el).opacity === "0" &&
                el.getBoundingClientRect().top < window.innerHeight) {
              gsap.to(el, { opacity: 1, y: 0, duration: .6 });
            }
          });
        }, 1200);
      }
    }

    /* generic reveals (cards already inside pinned track animate via hover) */
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    setTimeout(function () { ScrollTrigger.refresh(); }, 400);
  }

  /* ---------- video playback speed (slowed for cinematic feel; tweakable) ---------- */
  if (window.__vrate == null) window.__vrate = 0.6;
  function applyVideoRate() {
    document.querySelectorAll("video").forEach(function (v) {
      try { v.playbackRate = window.__vrate; } catch (e) {}
    });
  }
  window.applyVideoRate = applyVideoRate;
  document.querySelectorAll("video").forEach(function (v) {
    v.addEventListener("loadedmetadata", function () { try { v.playbackRate = window.__vrate; } catch (e) {} });
    v.addEventListener("play", function () { try { v.playbackRate = window.__vrate; } catch (e) {} });
  });
  applyVideoRate();

  /* ---------- boot ---------- */
  if (reduced) document.body.classList.add("reduced");
  document.body.classList.add("lock");
  runPreloader(function () {
    document.body.classList.remove("lock");
    heroIntro();
    setupScroll();
    applyVideoRate();
  });
})();
