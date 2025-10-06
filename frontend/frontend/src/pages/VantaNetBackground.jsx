import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // Vanta needs three.js

export default function VantaNetBackground() {
  const containerRef = useRef(null);
  const [vanta, setVanta] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // dynamic import keeps your bundle small & avoids SSR issues
    import("vanta/dist/vanta.net.min").then((module) => {
      if (cancelled) return;
      const NET = module.default;

      const effect = NET({
        el:angle2-bg-container,
        THREE,                 // pass THREE in
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        points: 10.0,
        maxDistance: 20.0,
        spacing: 15.0,
        showDots: false,
        backgroundAlpha: 1.0,
        // Colors from your link converted to hex ints (0xRRGGBB):
        // backgroundColor=1646948 -> 0x192164
        // color=11604372        -> 0xB11194
        backgroundColor: 0x192164,
        color: 0xB11194,
      });

      setVanta(effect);
    });

    return () => {
      cancelled = true;
      if (vanta) vanta.destroy();
    };
  }, []); // run once

  return <div ref={containerRef} className="vanta-bg" />;
}
