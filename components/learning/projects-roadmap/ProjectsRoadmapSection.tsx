"use client";

import { useCallback, useMemo, useState } from "react";
import CapstoneCard from "./CapstoneCard";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectProgress from "./ProjectProgress";
import ProjectStageTabs from "./ProjectStageTabs";
import {
  CAPSTONE_AS_PROJECT,
  ROADMAP_STAGES,
  type ProjectStageId,
  type RoadmapProject,
} from "./data";
import "./projects-roadmap.css";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="pr-stage-chevron"
      viewBox="0 0 24 24"
      width="42"
      height="42"
      fill="none"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path
          d="M15 4.5L7.5 12l7.5 7.5"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 4.5l7.5 7.5L9 19.5"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function ProjectsRoadmapSection() {
  const [activeId, setActiveId] = useState<ProjectStageId>("beginner");
  const [selectedProject, setSelectedProject] = useState<RoadmapProject | null>(null);

  const activeIndex = useMemo(
    () => Math.max(0, ROADMAP_STAGES.findIndex((item) => item.id === activeId)),
    [activeId],
  );
  const stage = ROADMAP_STAGES[activeIndex] ?? ROADMAP_STAGES[0];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < ROADMAP_STAGES.length - 1;
  const prevStage = canGoPrev ? ROADMAP_STAGES[activeIndex - 1] : null;
  const nextStage = canGoNext ? ROADMAP_STAGES[activeIndex + 1] : null;

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setActiveId(ROADMAP_STAGES[activeIndex - 1].id);
  }, [activeIndex, canGoPrev]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    setActiveId(ROADMAP_STAGES[activeIndex + 1].id);
  }, [activeIndex, canGoNext]);

  const openProject = useCallback((project: RoadmapProject) => {
    setSelectedProject(project);
  }, []);

  return (
    <section className="projects-roadmap" id="projects-roadmap" aria-labelledby="projects-roadmap-title">
      <div className="pr-shell">
        <header className="pr-header">
          <p className="pr-eyebrow">
            <span className="pr-eyebrow-dot" aria-hidden="true" />
            Curriculum Roadmap
          </p>
          <h2 id="projects-roadmap-title">Projects You Build With Us</h2>
          <p className="pr-subtitle">
            12 progressive hands-on projects + 1 enterprise-grade capstone,
            <br />
            engineered week by week.
          </p>
          <ProjectStageTabs stages={ROADMAP_STAGES} activeId={activeId} onChange={setActiveId} />
        </header>

        <div className="pr-stage-wrap">
          <button
            type="button"
            className="pr-stage-nav pr-stage-nav-prev"
            aria-label={prevStage ? `Previous stage: ${prevStage.tabLabel}` : "Previous stage"}
            disabled={!canGoPrev}
            onClick={goPrev}
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="pr-stage" role="tabpanel" aria-label={stage.stageLabel}>
            {stage.isCapstone ? (
              <CapstoneCard onOpen={() => openProject(CAPSTONE_AS_PROJECT)} />
            ) : (
              <div className="pr-grid">
                {stage.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={openProject}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="pr-stage-nav pr-stage-nav-next"
            aria-label={nextStage ? `Next stage: ${nextStage.tabLabel}` : "Next stage"}
            disabled={!canGoNext}
            onClick={goNext}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <ProjectProgress
          stageLabel={stage.stageLabel}
          rangeLabel={stage.rangeLabel}
          activeThrough={stage.activeThrough}
        />
      </div>

      {selectedProject ? (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </section>
  );
}
