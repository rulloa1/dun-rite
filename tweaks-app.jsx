/* ============ DunRite Tweaks ============ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#f4a01e",
  "display": "archivo",
  "hero": "photo",
  "texture": true,
  "corners": "sharp"
}/*EDITMODE-END*/;

// accent hex -> { deep, on } supporting colors
const ACCENTS = {
  "#f4a01e": { deep: "#d97a06", on: "#1a1205" }, // safety amber
  "#ff5a1f": { deep: "#d6400c", on: "#1a0a03" }, // safety orange
  "#3b82c4": { deep: "#2563a0", on: "#ffffff" }, // steel blue
  "#b5532a": { deep: "#8f3d1c", on: "#ffffff" }, // rust / leather
};

function DunRiteTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const b = document.body;
    const a = ACCENTS[t.accent] || ACCENTS["#f4a01e"];
    b.style.setProperty("--accent", t.accent);
    b.style.setProperty("--accent-deep", a.deep);
    b.style.setProperty("--on-accent", a.on);
    b.setAttribute("data-display", t.display);
    b.setAttribute("data-hero", t.hero);
    b.setAttribute("data-texture", t.texture ? "on" : "off");
    b.setAttribute("data-corners", t.corners);
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand Accent" />
      <TweakColor
        label="Accent color"
        value={t.accent}
        options={["#f4a01e", "#ff5a1f", "#b5532a", "#3b82c4"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Typography" />
      <TweakRadio
        label="Headlines"
        value={t.display}
        options={["archivo", "oswald", "saira"]}
        onChange={(v) => setTweak("display", v)}
      />
      <TweakSection label="Hero & Surface" />
      <TweakRadio
        label="Hero photo"
        value={t.hero}
        options={["photo", "dark"]}
        onChange={(v) => setTweak("hero", v)}
      />
      <TweakToggle
        label="Blueprint texture"
        value={t.texture}
        onChange={(v) => setTweak("texture", v)}
      />
      <TweakRadio
        label="Corners"
        value={t.corners}
        options={["sharp", "soft"]}
        onChange={(v) => setTweak("corners", v)}
      />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const el = document.createElement("div");
  el.id = "tweaks-root";
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<DunRiteTweaks />);
})();
