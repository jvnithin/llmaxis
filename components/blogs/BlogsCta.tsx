import Link from "next/link";

export default function BlogsCta() {
  return (
    <section className="blogs-cta" aria-labelledby="blogs-cta-title">
      <div className="blogs-cta-glow" aria-hidden="true" />
      <div className="blogs-cta-copy">
        <p className="blogs-cta-kicker">Free 1-on-1 architecture advisory</p>
        <h2 id="blogs-cta-title">
          <span>Unsure where to start? Get</span>
          <span>a tailored AI Career &</span>
          <span>Systems Learning</span>
          <span>Roadmap.</span>
        </h2>
        <p>
          Speak directly with a Senior AI Architect to map out your engineering background against 2026
          <br />
          enterprise AI hiring benchmarks.
        </p>
      </div>
      <Link href="/contact">Get Free AI Career Consultation →</Link>
    </section>
  );
}
