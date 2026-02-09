// src/components/filter/VotedFilter.tsx
import React from "react";
import "./Inchargefilter.css";

export type VotedFilterProps = {
  /** Currently selected voted status (controlled) */
  voted: string;
  /** State setter from parent */
  setVoted: (voted: string) => void;
};

const VOTED_OPTIONS = ["Yes", "No"];

const VotedFilter: React.FC<VotedFilterProps> = ({ voted, setVoted }) => {
  return (
    <div className="incharge-filter">
      <select
        className="incharge-filter-select"
        value={voted}
        onChange={(e) => setVoted(e.target.value)}
      >
        {/* 👇 This acts as placeholder text inside the box */}
        <option value="" disabled>
          All Voted
        </option>

        <option value="">All Voted</option>
        {VOTED_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VotedFilter;
