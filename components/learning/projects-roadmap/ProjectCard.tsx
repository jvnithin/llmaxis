import type { RoadmapProject } from "./data";

type ProjectCardProps = {
  project: RoadmapProject;
  onOpen: (project: RoadmapProject) => void;
};

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      className="pr-card pr-card-action"
      onClick={() => onOpen(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div className="pr-card-body">
        <div className="pr-card-meta">
          <span className="pr-card-number">{project.number}</span>
          <span className="pr-card-level">{project.level}</span>
        </div>
        <h3 className="pr-card-title">{project.title}</h3>
        <p className="pr-card-copy">{project.description}</p>
      </div>
      <div className="pr-card-skills">
        <p className="pr-card-skills-label">Focus skills:</p>
        <div className="pr-card-tags">
          {project.skills.map((skill) => (
            <span className="pr-card-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
