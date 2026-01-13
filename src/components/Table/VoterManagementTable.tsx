import React, { useEffect, useState } from "react";
import "./VoterManagementTable.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  inchargeFilter?: string;
  voterList: { list: any[] };
  selectedColumns?: any[]; 
  onStatusChange?: (epicNumber: string, newStatus: string) => void;
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
};

const INCHARGE_OPTIONS = ["NA","Mujju", "Salman", "Meraj", "Nouman"];
const STATUS_OPTIONS = ["NA","Active", "Inactive", "Pending"];

const VoterManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  inchargeFilter = "",
  voterList,
  onStatusChange,
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
        item["S.No"],
        item["WardNumber"],
        item["PART_NO"],
        item["SL_NO_IN_PART"],
        item["NAME"],
        item["EPIC_No"],
        item["GENDER"],
        item["AGE"],
        item["MOBILE_NO"],
        item["HOUSE_No"],
        item["ADDRESS"],
        item["INCHARGE"],
        
      ]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase());

      const matchesQuery = q === "" ? true : allValues.some((v) => v.includes(q));
      const matchesStatus = fVal === "" ? true : item.status.toLowerCase() === fVal;
      const matchesIncharge= rVal === "" ? true : item.INCHARGE.toLowerCase() === rVal;

      return matchesQuery && matchesStatus && matchesIncharge;
    });

    setFilteredItems({ list: filtered });
  }, [query, filterQuery, inchargeFilter, voterList]);

  const handleInchargeChange = (epicNumber: string, newIncharge: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["EPIC_No"] === epicNumber ? { ...item, INCHARGE: newIncharge } : item
      ),
    }));

    onInchargeChange?.(epicNumber, newIncharge);
  };

  const handleStatusChange = (epicNumber: string, newStatus: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        item["EPIC_No"] === epicNumber ? { ...item, status: newStatus } : item
      ),
    }));

    onStatusChange?.(epicNumber, newStatus);
  };

  return (
    <div className="table-container">
      <table className="assignments-table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>WardNumber</th>
            <th>PartNo</th>
            <th>SL-PartNo</th>
            <th>Name</th>
            <th>EpicNo</th>
             <th>Incharge</th>
            <th>HouseNo</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Status</th>
            <th>MobileNo</th>
           

          </tr>
        </thead>
        <tbody>
          {filteredItems.list.length > 0 ? (
            filteredItems.list.map((a, i) => (
              <tr key={i}>
                <td>{a["S.No"]}</td>
                <td>{a["WardNumber"]}</td>
                <td>{a["PART_NO"]}</td>
                <td>{a["SL_NO_IN_PART"]}</td>
                <td>{a["NAME"]}</td>
                <td>{a["EPIC_No"]}</td>
               <td className="status-cell">
                  <select
                    className={`status-dropdown ${a.INCHARGE
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    value={a.INCHARGE}
                    onChange={(e) =>
                      handleInchargeChange(a["EPIC_No"], e.target.value)
                    }
                  >
                    {INCHARGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{a["HOUSE_No"]}</td>
                <td>{a["GENDER"]}</td>
                <td>{a["AGE"]}</td>
                 <td className="status-cell">
                  <select
                    className={`status-dropdown ${a.STATUS
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    value={a.status}
                    onChange={(e) =>
                      handleStatusChange(a["asset-number"], e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{a["MOBILE_NO"]}</td>

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
