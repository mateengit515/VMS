// src/components/filter/VisitedFilter.tsx
import React from "react";
import "./Inchargefilter.css";

export type VisitedFilterProps = {
  /** Currently selected visited status (controlled) */
  visited: string;
  /** State setter from parent */
  setVisited: (visited: string) => void;
};

const VISITED_OPTIONS = ["Yes", "No"];

const VisitedFilter: React.FC<VisitedFilterProps> = ({ visited, setVisited }) => {
  return (
    <div className="incharge-filter">
      <select
        className="incharge-filter-select"
        value={visited}
        onChange={(e) => setVisited(e.target.value)}
      >
        {/* 👇 This acts as placeholder text inside the box */}
        <option value="" disabled>
          All Visited
        </option>

        <option value="">All Visited</option>
        {VISITED_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VisitedFilter;
