export default function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-hero"><div className="container"><span className="eyebrow" style={{ color: "#7dc4ff" }}>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>;
}
