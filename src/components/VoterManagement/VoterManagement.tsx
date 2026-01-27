import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./VoterManagement.css";
import SearchBar from "../searchBar/SearchBar";
import FilterComponent from "../filter/FilterComponent";
import VoterManagementTable from "../Table/VoterManagementTable";
import { toCamelCase } from "../../helpers/utils";
import { getAuthHeaders } from "../../helpers/authHelper";


const VoterManagement: React.FC = () => {
  const location = useLocation();
  const [voterList, setvoterList] = useState<any>({});
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({ name: "", value: "" });

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const pathDoorNumber = location.pathname.replace('/voter-details/', '').replace(/\/$/, '');
        const doorNo = pathDoorNumber || "3-4-217";
        console.log("Door number:", doorNo);
        
        const headers = await getAuthHeaders();
        const res = await axios.get(`https://api.mohsinbhai.com/api/vi/voters/door/${doorNo}`, {
          headers
        });
        
        console.log("✅ Loaded voter assignments:", res.data);
        setvoterList(res.data);

        if (res.data.list && res.data.list.length > 0) {
          const cols = Object.keys(res.data.list[0]).map((key) => ({
            name: toCamelCase(key), 
          }));
          setSelectedColumns(cols);
        }
      } catch (err) {
        console.error(" Error fetching assignments:", err);
      }
    };
    
    fetchVoters();
  }, [location.pathname]);

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
      </div>

      <VoterManagementTable
        query={query}
        filterQuery={filterQuery}
        voterList={voterList}
        selectedColumns={selectedColumns}
        
      />
    </div>
  );
};

export default VoterManagement;
