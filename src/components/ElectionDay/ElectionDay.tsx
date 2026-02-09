import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from 'react-csv';
import MohsinLogo from "../../images/Mohsin.png";
import "./ElectionDay.css";
import SearchBar from "../searchBar/SearchBar";
import ElectionDayTable from "../Table/ElectionDayTable";
import VotedFilter from "../filter/VotedFilter";
import RoomNumberFilter from "../filter/RoomNumberFilter";
import { toCamelCase } from "../../helpers/utils";
import { useAuth } from "../../contexts/AuthContext";
import { getAuthHeaders } from "../../helpers/authHelper";


const ElectionDay: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [voterList, setvoterList] = useState<any>({});
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [votedFilter, setVotedFilter] = useState("");
  const [roomNumberFilter, setRoomNumberFilter] = useState("");
  const [filteredVoterList, setFilteredVoterList] = useState<any[]>([]);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await axios.get("https://api.mohsinbhai.com/api/vi/voters/with-house-order", {
          headers
        });
        
        console.log("✅ Loaded all voters data:", res.data);
        
        // Handle both array and object responses
        const dataList = Array.isArray(res.data) ? res.data : (res.data.list || []);
        setvoterList({ list: dataList });

        if (dataList.length > 0) {
          const cols = Object.keys(dataList[0]).map((key) => ({
            name: toCamelCase(key), 
          }));
          setSelectedColumns(cols);
        }
      } catch (err) {
        console.error("❌ Error fetching all voters data:", err);
      }
    };
    
    fetchVoters();
  }, []);

  const csvHeaders = [
    { label: "Serial No", key: "serialNo" },
    { label: "Voted", key: "voted" },
    { label: "Name", key: "name" },
    { label: "Door No", key: "doorNo" },
    { label: "Incharge", key: "incharge" },
    { label: "Room Number", key: "room_no" }
  ];

  // Transform data to ensure all fields are present for CSV export
  const csvData = filteredVoterList.map(voter => ({
    serialNo: voter.serialNo || voter.serial_no,
    voted: voter.voted || "No",
    name: voter.name,
    doorNo: voter.doorNo || voter.door_no,
    incharge: voter.incharge,
    room_no: voter.room_no || voter.roomNo
  }));

  return (
    <div className="asset-assignment-page">
      <header className="asset-header">
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={MohsinLogo} alt="Team Mohsin Bhai" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <h2 className="asset-title">Team Mohsin Bhai!</h2>
          </Link>
          <p className="asset-subtitle">Election Day Management</p>
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
          <CSVLink 
            data={csvData}
            headers={csvHeaders}
            filename={`election-day-${new Date().toISOString().split('T')[0]}.csv`}
            className="assign-btn"
            style={{ textDecoration: 'none' }}
          >
            Export CSV
          </CSVLink>
          <button className="assign-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <hr className="header-divider" />

      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{ 
            padding: '8px 16px', 
            backgroundColor: '#f3f4f6', 
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ← Back to Door Management
          </button>
        </Link>
      </div>

      <div className="filters">
        <SearchBar query={query} setQuery={setQuery} />
        <VotedFilter voted={votedFilter} setVoted={setVotedFilter} />
        <RoomNumberFilter roomNumber={roomNumberFilter} setRoomNumber={setRoomNumberFilter} />
      </div>

      <ElectionDayTable
        query={query}
        voterList={voterList}
        selectedColumns={selectedColumns}
        votedFilter={votedFilter}
        roomNumberFilter={roomNumberFilter}
        onFilterChange={setFilteredVoterList}
      />
    </div>
  );
};

export default ElectionDay;
