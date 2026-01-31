import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthSession } from 'aws-amplify/auth';
import "./Table.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  inchargeFilter?: string;
  statusFilter?: string;
  visitedFilter?: string;
  doorList: { list: any[] };
  selectedColumns?: any[]; 
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
};

const INCHARGE_OPTIONS = ["NA","Mujju", "Salman", "Meraj", "Nouman", "Omair"];
const STATUS_OPTIONS = [
  { value: "green", label: "Green", color: "#10b981" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "red", label: "Red", color: "#ef4444" }
];
const VISITED_OPTIONS = ["Yes", "No"];

const DoorManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  inchargeFilter = "",
  statusFilter = "",
  visitedFilter = "",
  doorList,
  onInchargeChange,
}) => {
  const [filteredItems, setFilteredItems] = useState<{ list: any[] }>({ list: [] });

  useEffect(() => {
    console .log("Door List in Table:", doorList);
    if (!doorList || !Array.isArray(doorList)) return;

    const q = query.toLowerCase();
    const fVal = filterQuery.value.toLowerCase();
    const rVal = inchargeFilter.toLowerCase();
    const sVal = statusFilter.toLowerCase();
    const vVal = visitedFilter.toLowerCase();

    const filtered = doorList.filter((item: any) => {
      const allValues = [
      
        item["doorNo"],
        item["incharge"],
        item["houseTotal"],
        
      ]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase());

      const matchesQuery = q === "" ? true : allValues.some((v) => v.includes(q));
      const matchesStatus = fVal === "" ? true : item.status.toLowerCase() === fVal;
      const matchesIncharge= rVal === "" ? true : item.incharge.toLowerCase() === rVal;
      const matchesStatusFilter = sVal === "" ? true : (item.status || "").toLowerCase() === sVal;
      const matchesVisitedFilter = vVal === "" ? true : (item.visited || "").toLowerCase() === vVal;

      return matchesQuery && matchesStatus && matchesIncharge && matchesStatusFilter && matchesVisitedFilter;
    });

    setFilteredItems({ list: filtered });
  }, [query, filterQuery, inchargeFilter, statusFilter, visitedFilter, doorList]);

  const handleInchargeChange = async (doorNo: string, newIncharge: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["doorNo"] === doorNo ? { ...item, incharge: newIncharge } : item
      ),
    }));

    // API call to update incharge in DB
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/voters/update-incharge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ doorNo: doorNo, incharge: newIncharge }),
      });
    } catch (error) {
      console.error("Failed to update incharge:", error);
    }

    onInchargeChange?.(doorNo, newIncharge);
  };

  const handleStatusChange = async (doorNo: string, newStatus: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["doorNo"] === doorNo ? { ...item, status: newStatus } : item
      ),
    }));

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/doors/update-status", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ doorNo: doorNo, status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleVisitedChange = async (doorNo: string, newVisited: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["doorNo"] === doorNo ? { ...item, visited: newVisited } : item
      ),
    }));

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/doors/update-visited", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ doorNo: doorNo, visited: newVisited }),
      });
    } catch (error) {
      console.error("Failed to update visited:", error);
    }
  };

  const handleCommentsBlur = async (doorNo: string, comments: string) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/doors/update-comments", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ doorNo: doorNo, comments: comments }),
      });
    } catch (error) {
      console.error("Failed to update comments:", error);
    }
  };

  const handleCommentsChange = (doorNo: string, newComments: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["doorNo"] === doorNo ? { ...item, comments: newComments } : item
      ),
    }));
  };

  return (
    <div className="table-container">
      <table className="assignments-table">
        <thead>
          <tr>
          
             <th>Door No.</th>
             <th>Incharge</th>
            <th>House Total</th>
            <th>Status</th>
            <th>Visited</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.list.length > 0 ? (
            filteredItems.list.map((a, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/voter-details/${a["doorNo"]}`} className="door-link">
                    {a["doorNo"]}
                  </Link>
                </td>

                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.incharge}
                    onChange={(e) =>
                      handleInchargeChange(a["doorNo"], e.target.value)
                    }
                  >
                    {INCHARGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{a["houseTotal"]}</td>
                <td className="status-cell">
                  <select
                    className="color-status-dropdown"
                    value={a.status || "green"}
                    onChange={(e) =>
                      handleStatusChange(a["doorNo"], e.target.value)
                    }
                    style={{
                      backgroundColor: STATUS_OPTIONS.find(opt => opt.value === (a.status || "green"))?.color,
                      color: "#fff",
                      fontWeight: 600
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.visited || "No"}
                    onChange={(e) =>
                      handleVisitedChange(a["doorNo"], e.target.value)
                    }
                  >
                    {VISITED_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <textarea
                    className="comments-textarea"
                    value={a.comments || ""}
                    onChange={(e) => handleCommentsChange(a["doorNo"], e.target.value)}
                    onBlur={(e) => handleCommentsBlur(a["doorNo"], e.target.value)}
                    placeholder="Add comments..."
                    rows={2}
                  />
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No assignments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoorManagementTable;
