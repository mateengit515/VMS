import React, { useEffect, useState } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';
import "./Table.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  statusFilter?: string;
  voterList: { list: any[] };
  selectedColumns?: any[]; 
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
  onStatusChange?: (epicNumber: string, newStatus: string) => void;
};

const STATUS_OPTIONS = [
  { value: "NA", label: "NA", color: "#6b7280" },
  { value: "Available", label: "Available", color: "#22c55e" }
];

const VoterManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  statusFilter = "",
  voterList,
  onStatusChange,
}) => {
  const [filteredItems, setFilteredItems] = useState<{ list: any[] }>({ list: [] });
  const [editingContact, setEditingContact] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!voterList || !Array.isArray(voterList.list)) return;

    const q = query.toLowerCase();
    const sVal = statusFilter.toLowerCase();

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
      const matchesStatusFilter = sVal === "" ? true : (item.status || "na").toLowerCase() === sVal;

      return matchesQuery && matchesStatusFilter;
    });

    setFilteredItems({ list: filtered });
  }, [query, filterQuery, statusFilter, voterList]);

  const handleStatusChange = async (epicNo: string, newStatus: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNo ? { ...item, status: newStatus } : item
      ),
    }));

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/voters/update-status", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ epic_no: epicNo, status: newStatus }),
      });
      console.log("✅ Status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
    }

    onStatusChange?.(epicNo, newStatus);
  };

  const handleContactChange = (epicNo: string, value: string) => {
    // Only allow numeric input, max 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setEditingContact(prev => ({ ...prev, [epicNo]: numericValue }));
  };

  const handleContactBlur = async (epicNo: string, contactNumber: string) => {
    // If empty or unchanged, just clear editing state
    if (!contactNumber || contactNumber === voterList.list.find(item => item["epic_no"] === epicNo)?.["contact_number"]) {
      delete editingContact[epicNo];
      setEditingContact({ ...editingContact });
      return;
    }

    // Validate 10 digits
    if (contactNumber.length !== 10) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    // Update local state
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNo ? { ...item, contact_number: contactNumber } : item
      ),
    }));

    // API call to update contact number in DB
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("http://localhost:8080/api/vi/voters/update-contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ epic_no: epicNo, contact_number: contactNumber }),
      });
      console.log("✅ Contact number updated successfully");
    } catch (error) {
      console.error("Failed to update contact number:", error);
    }

    // Clear editing state after successful update
    delete editingContact[epicNo];
    setEditingContact({ ...editingContact });
  };

  return (
    <div className="table-container">
      <table className="assignments-table">
        <thead>
          <tr>
            <th>SLNo.</th>
            <th>Name</th>
            <th>Status</th>
            <th>Contact Number</th>
            <th>EPIC No.</th>
            <th>Sex</th>
            <th>Age</th>
             <th>Door No.</th>
             <th>Incharge</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.list.length > 0 ? (
            filteredItems.list.map((a, i) => (
              <tr key={i}>
                <td>{a["serial_no"]}</td>
                <td>{a["name"]}</td>
                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.status || "NA"}
                    style={{ 
                      backgroundColor: STATUS_OPTIONS.find(s => s.value === (a.status || "NA"))?.color || "#6b7280", 
                      color: "white",
                      fontWeight: 600
                    }}
                    onChange={(e) =>
                      handleStatusChange(a["epic_no"], e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="contact-input"
                    value={editingContact[a["epic_no"]] !== undefined ? editingContact[a["epic_no"]] : a["contact_number"] || ""}
                    onChange={(e) => handleContactChange(a["epic_no"], e.target.value)}
                    onBlur={(e) => {
                      if (editingContact[a["epic_no"]] !== undefined && editingContact[a["epic_no"]] !== a["contact_number"]) {
                        handleContactBlur(a["epic_no"], e.target.value);
                      }
                    }}
                    placeholder="Enter 10 digits"
                    maxLength={10}
                  />
                </td>
                <td>{a["epic_no"]}</td>
                <td>{a["sex"]}</td>
                <td>{a["age"]}</td>
                <td>{a["door_no"]}</td>
                <td>{a["incharge"]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
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
