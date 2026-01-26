import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoorManagement.css";
import SearchBar from "../searchBar/SearchBar";
import FilterComponent from "../filter/FilterComponent";
import InchargeFilter from "../filter/InchargeFilter";
import DoorManagementTable from "../Table/DoorManagementTable";
import { toCamelCase } from "../../helpers/utils";
import { useAuth } from "../../contexts/AuthContext";
import { getAuthHeaders } from "../../helpers/authHelper";


const DoorManagement: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [doorList, setdoorList] = useState<any>({});
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [inchargeFilter, setInchargeFilter] = useState("");
  const [filterQuery, setFilterQuery] = useState({ name: "", value: "" });

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await axios.get("http://localhost:8080/api/vi/voters/door-summary", {
          headers
        });
        console.log("✅ Loaded Door assignments:", res.data);
        setdoorList(res.data);

        if (res.data.list && res.data.list.length > 0) {
          const cols = Object.keys(res.data.list[0]).map((key) => ({
            name: toCamelCase(key), 
          }));
          setSelectedColumns(cols);
        }
      } catch (err) {
        console.error(" Error fetching Door Details:", err);
      }
    };
    
    fetchDoors();
  }, []);

  return (
    <div className="asset-assignment-page">
      <header className="asset-header">
        <div>
          <h2 className="asset-title">Voter Management System</h2>
          <p className="asset-subtitle">Manage Votes allocation</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {userInfo && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{userInfo.username}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                {userInfo.role === 'admin' ? 'Administrator' : 'Incharge'}
              </p>
            </div>
          )}
          <button className="assign-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <hr className="header-divider" />

      <div className="filters">
        <SearchBar query={query} setQuery={setQuery} />
        <FilterComponent setFilterQuery={setFilterQuery} />
        <InchargeFilter incharge={inchargeFilter} setIncharge={setInchargeFilter} />
      </div>

      <DoorManagementTable
        query={query}
        filterQuery={filterQuery}
        inchargeFilter={inchargeFilter}
        doorList={doorList}
        selectedColumns={selectedColumns}
        
      />
    </div>
  );
};

export default DoorManagement;
