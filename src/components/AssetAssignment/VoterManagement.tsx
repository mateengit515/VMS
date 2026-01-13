import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VoterManagement.css";
import SearchBar from "../searchBar/SearchBar";
import FilterComponent from "../filter/FilterComponent";
import InchargeFilter from "../filter/InchargeFilter";
import VoterManagementTable from "../Table/VoterManagementTable";
import { toCamelCase } from "../../helpers/utils";


const VoterManagement: React.FC = () => {
  const [assignmentList, setAssignmentList] = useState<any>({});
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [inchargeFilter, setinchargeFilter] = useState("");
  const [filterQuery, setFilterQuery] = useState({ name: "", value: "" });

  useEffect(() => {
    axios
      .get("/asset-assignments.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("✅ Loaded asset assignments:", res.data);
        setAssignmentList(res.data);

        if (res.data.list && res.data.list.length > 0) {
          const cols = Object.keys(res.data.list[0]).map((key) => ({
            name: toCamelCase(key), 
          }));
          setSelectedColumns(cols);
        }
      })
      .catch((err) => console.error(" Error fetching assignments:", err));
  }, []);

  return (
    <div className="asset-assignment-page">
      <header className="asset-header">
        <div>
          <h2 className="asset-title">Voter Management System</h2>
          <p className="asset-subtitle">Manage Votes allocation</p>
        </div>
        <button className="assign-btn">+ Assign Now</button>
      </header>

      <hr className="header-divider" />

      <div className="filters">
        <SearchBar query={query} setQuery={setQuery} />
        <FilterComponent setFilterQuery={setFilterQuery} />
        <InchargeFilter incharge={inchargeFilter} setIncharge={setinchargeFilter} />
      </div>

      <VoterManagementTable
        query={query}
        filterQuery={filterQuery}
        inchargeFilter={inchargeFilter}
        voterList={assignmentList}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export default VoterManagement;
