import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthSession } from 'aws-amplify/auth';
import "./Table.css";

type Props = {
  query?: string;
  filterQuery?: { name: string; value: string };
  inchargeFilter?: string;
  doorList: { list: any[] };
  selectedColumns?: any[]; 
  onInchargeChange?: (epicNumber: string, newIncharge: string) => void;
};

const INCHARGE_OPTIONS = ["NA","Mujju", "Salman", "Meraj", "Nouman"];
//const STATUS_OPTIONS = ["NA","Active", "Inactive", "Pending"];

const DoorManagementTable: React.FC<Props> = ({
  query = "",
  filterQuery = { name: "", value: "" },
  inchargeFilter = "",
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

      return matchesQuery && matchesStatus && matchesIncharge;
    });

    setFilteredItems({ list: filtered });
  }, [query, filterQuery, inchargeFilter, doorList]);

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
          
             <th>Door No.</th>
             <th>Incharge</th>
            <th>House Total</th>
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

export default DoorManagementTable;
