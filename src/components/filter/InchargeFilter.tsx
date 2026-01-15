// src/components/filter/inchargeFilter.tsx
import React from "react";
import "./Inchargefilter.css";

export type inchargeFilterProps = {
  /** Currently selected incharge (controlled) */
  incharge: string;
  /** State setter from parent */
  setIncharge: (incharge: string) => void;
  /** Optional: custom incharges to show in dropdown */
  incharges?: string[];
};

const defaultincharges = ["Mujju", "Salman", "Meraj", "Nouman"];

const inchargeFilter: React.FC<inchargeFilterProps> = ({ incharge, setIncharge, incharges = defaultincharges }) => {
  return (
    <div className="incharge-filter">
      <select
        className="incharge-filter-select"
        value={incharge}
        onChange={(e) => setIncharge(e.target.value)}
      >
        {/* 👇 This acts as placeholder text inside the box */}
        <option value="" disabled selected={!incharge}>
          All Incharges
        </option>

        <option value="">All Incharges</option>
        {incharges.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
};

export default inchargeFilter;
