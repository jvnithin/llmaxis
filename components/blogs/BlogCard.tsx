import Link from "next/link";
import type { BlogGuide } from "./data";

export default function BlogCard({ guide }: { guide: BlogGuide }) {
  const card = (
    <>
      <img className="blog-cover" src={encodeURI(guide.image)} alt="" />
      <div className="blog-card-body">
        <h2>{guide.title}</h2>
        <p>{guide.subtitle}</p>
      </div>
    </>
  );

  if (!guide.href) {
    return <article className="blog-card">{card}</article>;
  }

  return (
    <Link className="blog-card" href={guide.href}>
      {card}
    </Link>
  );
}
