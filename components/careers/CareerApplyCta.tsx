"use client";

import { useState } from "react";
import CareerApplyModal from "./CareerApplyModal";

type CareerApplyCtaProps = {
  roleTitle: string;
};

export default function CareerApplyCta({ roleTitle }: CareerApplyCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="career-detail-apply" aria-label="Apply for this role">
        <div className="career-detail-apply-copy">
          <p className="career-detail-apply-kicker">Ready to join?</p>
          <h2>Apply for {roleTitle}</h2>
          <p>
            Share your profile and we&apos;ll route your application to the hiring
            team for this role.
          </p>
        </div>
        <button
          type="button"
          className="career-detail-apply-btn"
          onClick={() => setOpen(true)}
        >
          Apply
        </button>
      </div>

      <CareerApplyModal
        open={open}
        roleTitle={roleTitle}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
