import type { ProjectStageId, RoadmapStage } from "./data";

export default function ProjectStageTabs({
  stages,
  activeId,
  onChange,
}: {
  stages: RoadmapStage[];
  activeId: ProjectStageId;
  onChange: (id: ProjectStageId) => void;
}) {
  return (
    <div className="pr-tabs" role="tablist" aria-label="Project stage switcher">
      {stages.map((stage) => {
        const active = stage.id === activeId;
        return (
          <button
            key={stage.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={active ? "pr-tab is-active" : "pr-tab"}
            onClick={() => onChange(stage.id)}
          >
            {stage.isCapstone ? (
              <span className="pr-tab-star" aria-hidden="true">
                ★
              </span>
            ) : null}
            {stage.tabLabel}
          </button>
        );
      })}
    </div>
  );
}
