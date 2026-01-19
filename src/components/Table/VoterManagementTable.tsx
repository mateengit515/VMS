import React, { useEffect, useState } from "react";
import "./VoterManagementTable.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  inchargeFilter?: string;
  voterList: { list: any[] };
  selectedColumns?: any[]; 
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
};

const INCHARGE_OPTIONS = ["NA","Mujju", "Salman", "Meraj", "Nouman"];
//const STATUS_OPTIONS = ["NA","Active", "Inactive", "Pending"];

const VoterManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  inchargeFilter = "",
  voterList,
  onInchargeChange,
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

  const handleInchargeChange = (epicNumber: string, newIncharge: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["epic_no"] === epicNumber ? { ...item, incharge: newIncharge } : item
      ),
    }));

    onInchargeChange?.(epicNumber, newIncharge);
  };

  // const handleStatusChange = (epicNumber: string, newStatus: string) => {
  //   setFilteredItems((prev) => ({
  //     list: prev.list.map((item) =>
  //       item["epic_no"] === epicNumber ? { ...item, status: newStatus } : item
  //     ),
  //   }));

  //   onStatusChange?.(epicNumber, newStatus);
  // };

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

                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.incharge}
                    onChange={(e) =>
                      handleInchargeChange(a["epic_no"], e.target.value)
                    }
                  >
                    {INCHARGE_OPTIONS.map((s) => (
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
              <td colSpan={7} style={{ textAlign: "center" }}>
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
