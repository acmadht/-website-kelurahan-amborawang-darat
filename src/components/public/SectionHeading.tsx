export default function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="section-heading">
      <span className="eyebrow" style={light ? { color: "#7dc4ff" } : undefined}>{eyebrow}</span>
      <h2 className={`section-title ${light ? "light" : ""}`}>{title}</h2>
      {description ? <p className={`section-copy ${light ? "light" : ""}`}>{description}</p> : null}
    </div>
  );
}
