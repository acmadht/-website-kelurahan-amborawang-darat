"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { HeroSlide, SiteSettings } from "@/types";

export default function HeroSlider({ slides, settings }: { slides: HeroSlide[]; settings: SiteSettings }) {
  const activeSlides = useMemo(() => slides.filter((slide) => slide.isActive), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= activeSlides.length) setIndex(0);
  }, [activeSlides.length, index]);

  useEffect(() => {
    if (!settings.heroAutoplay || activeSlides.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % activeSlides.length), Math.max(4000, settings.heroInterval || 7000));
    return () => window.clearInterval(timer);
  }, [activeSlides.length, settings.heroAutoplay, settings.heroInterval]);

  if (!activeSlides.length) return null;
  return (
    <section className="hero">
      {activeSlides.map((slide, slideIndex) => (
        <div key={slide.id ?? slide.title} className={`hero-slide ${slideIndex === index ? "active" : ""}`} aria-hidden={slideIndex !== index}>
          <Image
            src={slide.imageUrl || "/images/hero-1.svg"}
            alt={`Foto Banner - ${slide.title}`}
            fill
            style={{ objectFit: "cover" }}
            priority={slideIndex === 0}
            unoptimized
          />
        </div>
      ))}
      <div className="hero-overlay" /><div className="hero-pattern" />
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="hero-kicker">Website Resmi {settings.villageName}</span>
          <h1>{activeSlides[index]?.title}</h1>
          <p>{activeSlides[index]?.subtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={activeSlides[index]?.primaryButtonUrl || "/layanan"}>{activeSlides[index]?.primaryButtonText || "Lihat Layanan"} →</Link>
            {activeSlides[index]?.secondaryButtonText ? <Link className="btn btn-secondary" href={activeSlides[index]?.secondaryButtonUrl || "/kontak"}>{activeSlides[index]?.secondaryButtonText}</Link> : null}
          </div>
        </div>
      </div>
      <div className="hero-dots">{activeSlides.map((slide, slideIndex) => <button key={slide.id ?? slideIndex} className={`hero-dot ${slideIndex === index ? "active" : ""}`} onClick={() => setIndex(slideIndex)} aria-label={`Tampilkan banner ${slideIndex + 1}`} />)}</div>
    </section>
  );
}
