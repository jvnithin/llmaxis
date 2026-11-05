import Link from "next/link";
import CareerApplyCta from "./CareerApplyCta";
import type { CareerRole } from "./data";
import type { CareerJobDetail, CareerJdBlock } from "./jd-data";
import "./careers.css";

type CareerDetailViewProps = {
  detail: CareerJobDetail;
  role: CareerRole;
};

function JdBlock({ block }: { block: CareerJdBlock }) {
  if (block.type === "paragraphs") {
    return (
      <section className="career-jd-section">
        {block.title ? <h2>{block.title}</h2> : null}
        {block.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    );
  }

  if (block.type === "list") {
    return (
      <section className="career-jd-section">
        <h2>{block.title}</h2>
        <ul className="career-jd-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="career-jd-section">
      <h2>{block.title}</h2>
      <div className="career-jd-groups">
        {block.groups.map((group) => (
          <div key={group.title} className="career-jd-group">
            <h3>{group.title}</h3>
            <ul className="career-jd-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CareerDetailView({ detail, role }: CareerDetailViewProps) {
  const openingsLabel =
    role.openings === 1 ? "1 Opening" : `${role.openings} Openings`;

  return (
    <main className="careers-page career-detail-page">
      <div className="careers-shell career-detail-shell">
        <nav className="career-detail-crumb" aria-label="Breadcrumb">
          <Link href="/careers">Careers</Link>
          <span aria-hidden="true">/</span>
          <span>{role.title}</span>
        </nav>

        <header className="career-detail-hero">
          <div className="career-detail-hero-top">
            <span className="careers-job-status">
              Actively Hiring • {openingsLabel}
            </span>
            <span className="careers-job-meta">
              {role.location.toUpperCase()} / {role.type.toUpperCase()}
            </span>
          </div>

          <h1>{detail.fullTitle}</h1>
          <p className="career-detail-summary">{detail.summary}</p>

          <ul className="careers-job-tags career-detail-tags" aria-label="Focus areas">
            {role.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <dl className="career-detail-facts">
            <div>
              <dt>Department</dt>
              <dd>{detail.departmentLabel}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{detail.experience}</dd>
            </div>
            <div>
              <dt>Employment</dt>
              <dd>{detail.employmentType}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{detail.locationDetail}</dd>
            </div>
          </dl>
        </header>

        <article className="career-detail-card">
          <section className="career-jd-section">
            <h2>Role Overview</h2>
            {detail.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          {detail.blocks.map((block) => (
            <JdBlock
              key={`${block.type}-${"title" in block ? block.title : "body"}`}
              block={block}
            />
          ))}

          {detail.idealCandidate ? (
            <section className="career-jd-section career-jd-ideal">
              <h2>Ideal Candidate</h2>
              <p>{detail.idealCandidate}</p>
            </section>
          ) : null}
        </article>

        <CareerApplyCta roleTitle={role.title} />
      </div>
    </main>
  );
}
