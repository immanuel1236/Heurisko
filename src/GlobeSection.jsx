import React, { useState, useRef } from "react";
import GlobeScene from "./GlobeScene.tsx";

// Lazy-loaded so Three.js and the 7MB geography file never load until this
// section actually mounts — the rest of the app pays nothing for the globe
// existing. Wrapped in Suspense with a plain, honest loading state below.
const LazyGlobeScene = React.lazy(() => import("./GlobeScene.tsx"));

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function GlobeSection({ onLocationPick, c, fonts }) {
  const [enabled, setEnabled] = useState(false); // load-on-demand, not on page load
  const [autoRotate, setAutoRotate] = useState(!prefersReducedMotion);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [detail, setDetail] = useState("countries");
  const [location, setLocation] = useState(null);
  const [visible, setVisible] = useState(true);
  const [webglFailed, setWebglFailed] = useState(false);
  const containerRef = useRef(null);

  // Pause rendering (not just hide) when the globe scrolls off-screen or the
  // tab is backgrounded — a real cost-control requirement, not cosmetic.
  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(containerRef.current);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [enabled]);

  React.useEffect(() => {
    if (!enabled) return;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglFailed(true);
    } catch (e) {
      setWebglFailed(true);
    }
  }, [enabled]);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    if (onLocationPick) onLocationPick(loc);
  };

  const latitudeLabel = location ? `${Math.abs(location.latitude).toFixed(2)}° ${location.latitude >= 0 ? "N" : "S"}` : "—";
  const longitudeLabel = location ? `${Math.abs(location.longitude).toFixed(2)}° ${location.longitude >= 0 ? "E" : "W"}` : "—";

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: c.ink, marginBottom: 3 }}>Browse the globe</p>
          <p style={{ fontSize: 12.5, color: c.gray600 }}>Drag to rotate, scroll to zoom, click a place to search there. Entirely optional — typing above works the same.</p>
        </div>
        {!enabled && (
          <button
            onClick={() => setEnabled(true)}
            style={{ fontSize: 13, fontWeight: 600, color: c.navy, background: c.navyTint, border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}
          >
            Load interactive globe
          </button>
        )}
      </div>

      {!enabled ? (
        <div style={{ height: 240, borderRadius: 16, background: c.cream, border: `1px dashed ${c.gray300}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 12.5, color: c.gray600 }}>Not loaded yet — click "Load interactive globe" above. Nothing downloads until you do.</p>
        </div>
      ) : webglFailed ? (
        <div style={{ height: 240, borderRadius: 16, background: c.cream, border: `1px solid ${c.gray300}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12.5, color: c.gray600 }}>Your browser doesn't support WebGL, so the 3D globe can't run here — the location search fields above work exactly the same without it.</p>
        </div>
      ) : (
        <div ref={containerRef}>
          <React.Suspense fallback={
            <div style={{ height: 380, borderRadius: 16, background: c.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12.5, color: "#C6CEDA" }}>Loading globe…</span>
            </div>
          }>
            <div style={{ position: "relative", height: 380, borderRadius: 16, overflow: "hidden", background: c.navy }}>
              <LazyGlobeScene
                autoRotate={autoRotate}
                showAtmosphere={showAtmosphere}
                onLocationSelect={handleLocationSelect}
                onDetailChange={setDetail}
                paused={!visible}
              />
              <div style={{ position: "absolute", top: 14, right: 16, textAlign: "right", fontFamily: "monospace", fontSize: 10.5, letterSpacing: "0.08em", color: "#C9FFF1", pointerEvents: "none" }}>
                <div>LAT {latitudeLabel}</div>
                <div>LON {longitudeLabel}</div>
              </div>
              <div style={{ position: "absolute", bottom: 14, left: 16, display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, background: "rgba(3,17,25,0.55)", backdropFilter: "blur(6px)", fontFamily: "monospace", fontSize: 10, color: "#C9FFF1" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.gold, display: "inline-block" }} />
                {detail === "states" ? "State boundaries active" : "Zoom in for state boundaries"}
              </div>
              {location && (
                <div style={{ position: "absolute", bottom: 14, right: 16, background: c.paper, borderRadius: 10, padding: "10px 14px", maxWidth: 220 }}>
                  <p style={{ fontSize: 10, color: c.gray600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{location.type}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{location.name}</p>
                  {location.country && <p style={{ fontSize: 11, color: c.gray600 }}>{location.country}</p>}
                </div>
              )}
            </div>
          </React.Suspense>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setAutoRotate((v) => !v)}
              aria-pressed={autoRotate}
              style={{ fontSize: 12, fontWeight: 600, color: autoRotate ? c.navy : c.gray600, background: autoRotate ? c.navyTint : c.paper, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "6px 14px", cursor: "pointer" }}
            >
              Auto-rotate {autoRotate ? "on" : "off"}
            </button>
            <button
              onClick={() => setShowAtmosphere((v) => !v)}
              aria-pressed={showAtmosphere}
              style={{ fontSize: 12, fontWeight: 600, color: showAtmosphere ? c.navy : c.gray600, background: showAtmosphere ? c.navyTint : c.paper, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "6px 14px", cursor: "pointer" }}
            >
              Atmosphere {showAtmosphere ? "on" : "off"}
            </button>
          </div>
          {location && (
            <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 8 }}>
              Selected "{location.name}" — the location field above has been filled in for you; adjust it freely before searching.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
