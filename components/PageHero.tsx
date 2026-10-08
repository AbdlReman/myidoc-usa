import Link from "next/link";

type Props = { eyebrow: string; title: string; crumb: string };

export default function PageHero({ eyebrow, title, crumb }: Props) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow page-hero__eyebrow">{eyebrow}</div>
        <h1 className="page-hero__title">{title}</h1>
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{crumb}</span>
        </nav>
      </div>
    </section>
  );
}
