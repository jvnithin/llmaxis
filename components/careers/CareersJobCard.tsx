import Image from "next/image";
import Link from "next/link";
import { careerDetailHref, type CareerRole } from "./data";

type CareersJobCardProps = {
  role: CareerRole;
};

export default function CareersJobCard({ role }: CareersJobCardProps) {
  const openingsLabel =
    role.openings === 1 ? "1 Opening" : `${role.openings} Openings`;

  return (
    <article className="careers-job-card">
      <div className="careers-job-body">
        <div className="careers-job-top">
          <span className="careers-job-status">
            Actively Hiring • {openingsLabel}
          </span>
          <span className="careers-job-meta">
            {role.location.toUpperCase()} / {role.type.toUpperCase()}
          </span>
        </div>

        <h2>{role.title}</h2>
        <p>{role.description}</p>

        <ul className="careers-job-tags" aria-label="Skills and focus areas">
          {role.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <Link href={careerDetailHref(role.id)} className="careers-job-cta">
        <span>View Details &amp; Apply</span>
        <Image
          src="/images/careers/9ad46.svg"
          alt=""
          width={10}
          height={10}
          unoptimized
        />
      </Link>
    </article>
  );
}
