import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function AnimatedRoute({ children }) {
  const container = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (container.current) {
      gsap.fromTo(
        container.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [location]);

  return (
    <div ref={container} className="animated-route">
      {children}
    </div>
  );
}
