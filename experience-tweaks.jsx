/* ============ DunRite — "The Build" Tweaks ============ */
const EXP_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1684cc",
  "footage": "cinematic",
  "grain": true,
  "pace": "cinematic",
  "vspeed": "slow"
}/*EDITMODE-END*/;

// accent hex -> { deep, on }
const EXP_ACCENTS = {
  "#1684cc": { deep: "#0e5fa0", on: "#04121f" }, // DunRite logo blue
  "#2456c8": { deep: "#163c92", on: "#040b1e" }, // deep cobalt
  "#19a0a8": { deep: "#0e7177", on: "#041413" }, // teal
  "#eaa83b": { deep: "#c8820f", on: "#1a1205" }  // safety amber (original)
};

const EXP_PACE = { brisk: 170, cinematic: 300, epic: 500 };
const EXP_FG = { cinematic: 0.3, natural: 0 };
const EXP_VSPEED = { slow: 0.6, normal: 1 };

function ExperienceTweaks() {
  const [t, setTweak] = useTweaks(EXP_TWEAK_DEFAULTS);

  React.useEffect(() => {
    const b = document.body;
    const a = EXP_ACCENTS[t.accent] || EXP_ACCENTS["#1684cc"];
    // accent drives every gold/accent token across the experience
    b.style.setProperty("--gold", t.accent);
    b.style.setProperty("--gold-deep", a.deep);
    b.style.setProperty("--on-gold", a.on);
    // footage look
    b.style.setProperty("--fg-gray", String(EXP_FG[t.footage] != null ? EXP_FG[t.footage] : 0.3));
    // grain
    b.setAttribute("data-grain", t.grain ? "on" : "off");
    // build pace (live) — recompute pinned scroll lengths
    window.__pace = EXP_PACE[t.pace] || 300;
    if (window.ScrollTrigger) {
      try { window.ScrollTrigger.refresh(true); } catch (e) {}
    }
    // video playback speed (live)
    window.__vrate = EXP_VSPEED[t.vspeed] != null ? EXP_VSPEED[t.vspeed] : 0.6;
    if (window.applyVideoRate) window.applyVideoRate();
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand Accent" />
      <TweakColor
        label="Accent color"
        value={t.accent}
        options={["#1684cc", "#2456c8", "#19a0a8", "#eaa83b"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Footage" />
      <TweakRadio
        label="Look"
        value={t.footage}
        options={["cinematic", "natural"]}
        onChange={(v) => setTweak("footage", v)}
      />
      <TweakRadio
        label="Build pace"
        value={t.pace}
        options={["brisk", "cinematic", "epic"]}
        onChange={(v) => setTweak("pace", v)}
      />
      <TweakRadio
        label="Video speed"
        value={t.vspeed}
        options={["slow", "normal"]}
        onChange={(v) => setTweak("vspeed", v)}
      />
      <TweakSection label="Atmosphere" />
      <TweakToggle
        label="Film grain & vignette"
        value={t.grain}
        onChange={(v) => setTweak("grain", v)}
      />
    </TweaksPanel>
  );
}

(function mountExpTweaks() {
  const el = document.createElement("div");
  el.id = "exp-tweaks-root";
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<ExperienceTweaks />);
})();
