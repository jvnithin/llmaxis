"use client";

import { useState } from "react";
import PartnershipModal from "./PartnershipModal";

export default function PartnerWithUsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="button button-secondary" onClick={() => setOpen(true)}>
        Partner with us
      </button>
      {open ? <PartnershipModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
