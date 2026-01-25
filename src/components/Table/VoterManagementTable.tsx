import React, { useEffect, useState } from "react";
import "./Table.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  inchargeFilter?: string;
  voterList: { list: any[] };
  selectedColumns?: any[]; 
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
  onStatusChange?: (epicNumber: string, newStatus: string) => void;
  onVotedChange?: (epicNumber: string, newVoted: string) => void;
};

const INCHARGE_OPTIONS = ["NA","Mujju", "Salman", "Meraj", "Nouman"];
const STATUS_OPTIONS = ["NA", "Available"];
const VOTED_OPTIONS = ["No", "Yes"];

const VoterManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  inchargeFilter = "",
  voterList,
  onInchargeChange,
  onStatusChange,
  onVotedChange,
}) => {
  const [filteredItems, setFilteredItems] = useState<{ list: any[] }>({ list: [] });

  useEffect(() => {
    if (!voterList || !Array.isArray(voterList.list)) return;

    const q = query.toLowerCase();
    const fVal = filterQuery.value.toLowerCase();
    const rVal = inchargeFilter.toLowerCase();

    const filtered = voterList.list.filter((item: any) => {
      const allValues = [
        item["serial_no"],
        item["name"],
        item["epic_no"],
        item["sex"],
        item["age"],
        item["door_no"],
        item["incharge"],
        item["contact_number"],
        
      ]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase());

      const matchesQuery = q === "" ? true : allValues.some((v) => v.includes(q));
      const matchesStatus = fVal === "" ? true : item.status.toLowerCase() === fVal;
      const matchesIncharge= rVal === "" ? true : item.incharge.toLowerCase() === rVal;

      return matchesQuery && matchesStatus && matchesIncharge;
    });

    setFilteredItems({ list: filtered });
  }, [query, filterQuery, inchargeFilter, voterList]);

  const handleInchargeChange = async (epicNo: string, newIncharge: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNo ? { ...item, incharge: newIncharge } : item
      ),
    }));

    // API call to update incharge in DB
    try {
      await fetch("http://localhost:8080/api/vi/voters/update-incharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epic_no: epicNo, incharge: newIncharge }),
      });
    } catch (error) {
      console.error("Failed to update incharge:", error);
    }

    onInchargeChange?.(epicNo, newIncharge);
  };

  const handleStatusChange = async (epicNo: string, newStatus: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNo ? { ...item, status: newStatus } : item
      ),
    }));

    // API call to update status in DB
    try {
      await fetch("http://localhost:8080/api/vi/voters/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epic_no: epicNo, status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }

    onStatusChange?.(epicNo, newStatus);
  };

  const handleVotedChange = async (epicNo: string, newVoted: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNo ? { ...item, voted: newVoted } : item
      ),
    }));

    // API call to update voted status in DB
    try {
      await fetch("http://localhost:8080/api/vi/voters/update-voted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epic_no: epicNo, voted: newVoted }),
      });
    } catch (error) {
      console.error("Failed to update voted status:", error);
    }

    onVotedChange?.(epicNo, newVoted);
  };

  return (
    <div className="table-container">
      <table className="assignments-table">
        <thead>
          <tr>
            <th>SLNo.</th>
            <th>Name</th>
            <th>EPIC No.</th>
            <th>Sex</th>
            <th>Age</th>
             <th>Door No.</th>
             <th>Incharge</th>
            <th>Status</th>
            <th>Voted</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.list.length > 0 ? (
            filteredItems.list.map((a, i) => (
              <tr key={i}>
                <td>{a["serial_no"]}</td>
                <td>{a["name"]}</td>
                <td>{a["epic_no"]}</td>
                <td>{a["sex"]}</td>
                <td>{a["age"]}</td>
                <td>{a["door_no"]}</td>
                <td>{a["incharge"]}</td>
                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.status || "NA"}
                    onChange={(e) =>
                      handleStatusChange(a["epic_no"], e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.voted || "No"}
                    onChange={(e) =>
                      handleVotedChange(a["epic_no"], e.target.value)
                    }
                  >
                    {VOTED_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{a["contact_number"]}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} style={{ textAlign: "center" }}>
                No assignments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoterManagementTable;
