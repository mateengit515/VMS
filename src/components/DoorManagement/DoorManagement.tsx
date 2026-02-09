import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from 'react-csv';
import MohsinLogo from "../../images/Mohsin.png";
import "./DoorManagement.css";
import SearchBar from "../searchBar/SearchBar";
import FilterComponent from "../filter/FilterComponent";
import InchargeFilter from "../filter/InchargeFilter";
import StatusFilter from "../filter/StatusFilter";
import VisitedFilter from "../filter/VisitedFilter";
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
  const [statusFilter, setStatusFilter] = useState("");
  const [visitedFilter, setVisitedFilter] = useState("");
  const [filterQuery, setFilterQuery] = useState({ name: "", value: "" });
  const [filteredDoorList, setFilteredDoorList] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDoors = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await axios.get("https://api.mohsinbhai.com/api/vi/doors", {
          headers
        });
        
        if (isMounted) {
          console.log("✅ Loaded Door assignments:", res.data);
          setdoorList(res.data);

          if (res.data.list && res.data.list.length > 0) {
            const cols = Object.keys(res.data.list[0]).map((key) => ({
              name: toCamelCase(key), 
            }));
            setSelectedColumns(cols);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(" Error fetching Door Details:", err);
        }
      }
    };
    
    fetchDoors();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const csvHeaders = [
    { label: "Door No", key: "doorNo" },
    { label: "Incharge", key: "incharge" },
    { label: "House Total", key: "houseTotal" },
    { label: "Voters Available", key: "availableCount" },
    { label: "Status", key: "status" },
    { label: "Visited", key: "visited" },
    { label: "Comments", key: "comments" }
  ];

  return (
    <div className="asset-assignment-page">
      <header className="asset-header">
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={MohsinLogo} alt="Team Mohsin Bhai" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <h2 className="asset-title">Team Mohsin Bhai!</h2>
          </Link>
          <p className="asset-subtitle">Manage Votes Allocation</p>
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
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="assign-btn">Dashboard</button>
          </Link>
          <CSVLink 
            data={filteredDoorList}
            headers={csvHeaders}
            filename={`doors-${new Date().toISOString().split('T')[0]}.csv`}
            className="assign-btn"
            style={{ textDecoration: 'none' }}
          >
            Export CSV
          </CSVLink>
          <button className="assign-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <hr className="header-divider" />

      <div className="filters">
        <SearchBar query={query} setQuery={setQuery} />
        {userInfo?.role === 'admin' && (
          <>
            <FilterComponent setFilterQuery={setFilterQuery} />
            <InchargeFilter incharge={inchargeFilter} setIncharge={setInchargeFilter} />
            <StatusFilter status={statusFilter} setStatus={setStatusFilter} />
            <VisitedFilter visited={visitedFilter} setVisited={setVisitedFilter} />
          </>
        )}
      </div>

      <DoorManagementTable
        query={query}
        filterQuery={filterQuery}
        inchargeFilter={inchargeFilter}
        statusFilter={statusFilter}
        visitedFilter={visitedFilter}
        doorList={doorList}
        selectedColumns={selectedColumns}
        userRole={userInfo?.role}
        onFilterChange={setFilteredDoorList}
        
      />
    </div>
  );
};

export default DoorManagement;
