"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, enabled = true }: { value: number; enabled?: boolean }) {
  const [display, setDisplay] = useState(enabled ? 0 : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) { setDisplay(value); return; }
    const element = ref.current;
    if (!element) return;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const duration = 1200;
      const start = performance.now();
      const run = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      observer.disconnect();
    }, { threshold: .4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, value]);

  return <span ref={ref}>{new Intl.NumberFormat("id-ID").format(display)}</span>;
}
