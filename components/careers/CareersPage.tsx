"use client";

import { useMemo, useState } from "react";
import CareersFilters from "./CareersFilters";
import CareersHero from "./CareersHero";
import CareersJobCard from "./CareersJobCard";
import CareersSpontaneousCta from "./CareersSpontaneousCta";
import {
  filterCareerRoles,
  type CareerDepartment,
} from "./data";
import "./careers.css";

export default function CareersPage() {
  const [department, setDepartment] = useState<CareerDepartment>("all");
  const roles = useMemo(() => filterCareerRoles(department), [department]);

  return (
    <main className="careers-page">
      <div className="careers-shell">
        <CareersHero />
        <CareersFilters active={department} onChange={setDepartment} />

        {roles.length > 0 ? (
          <div className="careers-grid">
            {roles.map((role) => (
              <CareersJobCard key={role.id} role={role} />
            ))}
          </div>
        ) : (
          <div className="careers-empty">
            <h2>No open roles in this department right now</h2>
            <p>Check back soon, or send a general application below.</p>
          </div>
        )}

        <CareersSpontaneousCta />
      </div>
    </main>
  );
}
