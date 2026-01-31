// src/components/filter/StatusFilter.tsx
import React from "react";
import "./Inchargefilter.css";

export type StatusFilterProps = {
  /** Currently selected status (controlled) */
  status: string;
  /** State setter from parent */
  setStatus: (status: string) => void;
};

const STATUS_OPTIONS = ["green", "orange", "red"];

const StatusFilter: React.FC<StatusFilterProps> = ({ status, setStatus }) => {
  return (
    <div className="incharge-filter">
      <select
        className="incharge-filter-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="" disabled>
          All Status
        </option>

        <option value="">All Status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilter;
