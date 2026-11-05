"use client";

type ExploreSurpriseCtaProps = {
  onSurprise: () => void;
};

export default function ExploreSurpriseCta({ onSurprise }: ExploreSurpriseCtaProps) {
  return (
    <section className="explore-surprise">
      <div className="explore-shell">
        <div className="explore-surprise-banner">
          <div className="explore-surprise-copy">
            <p className="explore-surprise-badge">Instant Discovery</p>
            <h2>Are you feeling confused?</h2>
            <p>
              Not sure where to start? Let us pick the perfect production-tested prompt for
              your current goal. No account required.
            </p>
          </div>
          <button type="button" className="explore-surprise-btn" onClick={onSurprise}>
            Surprise me
          </button>
        </div>
      </div>
    </section>
  );
}
