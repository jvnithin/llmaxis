export default function ProjectProgress({
  stageLabel,
  rangeLabel,
  activeThrough,
}: {
  stageLabel: string;
  rangeLabel: string;
  activeThrough: number;
}) {
  const nodes = Array.from({ length: 13 }, (_, index) => index + 1);
  const progressPct = ((Math.max(activeThrough, 1) - 1) / 12) * 100;

  return (
    <div className="pr-progress">
      <div className="pr-progress-meta">
        <p className="pr-progress-stage">{stageLabel}</p>
        <div className="pr-progress-hint">
          <span className="pr-progress-scroll">
            Scroll down to progress through projects
            <span aria-hidden="true"> ↓</span>
          </span>
          <span className="pr-progress-range">{rangeLabel}</span>
        </div>
      </div>

      <div className="pr-stepper" aria-hidden="true">
        <div className="pr-stepper-nodes">
          <div className="pr-stepper-rail">
            <div className="pr-stepper-track" />
            <div className="pr-stepper-fill" style={{ width: `${progressPct}%` }} />
          </div>
          {nodes.map((node) => {
            const active = node <= activeThrough;
            const isCapstone = node === 13;
            return (
              <span
                key={node}
                className={[
                  "pr-step",
                  active ? "is-active" : "",
                  isCapstone ? "is-capstone" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCapstone ? "★" : node}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
