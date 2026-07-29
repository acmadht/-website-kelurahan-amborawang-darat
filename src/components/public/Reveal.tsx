"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0, enabled = true, className = "" }: { children: React.ReactNode; delay?: number; enabled?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} className={`${enabled ? "reveal" : ""} ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
