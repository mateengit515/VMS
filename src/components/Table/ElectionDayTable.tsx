import React, { useEffect, useState } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';
import "../Table/Table.css";

type Props = {
  query?: string;
  voterList: { list: any[] };
  selectedColumns?: any[];
  votedFilter?: string;
  roomNumberFilter?: string;
  onFilterChange?: (filteredData: any[]) => void;
};

const VOTED_OPTIONS = ["Yes", "No"];

const ElectionDayTable: React.FC<Props> = ({
  query = "",
  voterList,
  votedFilter = "",
  roomNumberFilter = "",
  onFilterChange,
}) => {
  const [filteredItems, setFilteredItems] = useState<{ list: any[] }>({ list: [] });

  useEffect(() => {
    if (!voterList || !Array.isArray(voterList.list)) return;

    const q = query.toLowerCase();

    const filtered = voterList.list.filter((item: any) => {
      const allValues = [
        item["serialNo"] || item["serial_no"],
        item["name"],
        item["doorNo"] || item["door_no"],
        item["incharge"],
        item["room_no"] || item["roomNo"],
        item["voted"],
      ]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase());

      const matchesQuery = q === "" ? true : allValues.some((v) => v.includes(q));
      const matchesVoted = votedFilter === "" ? true : item["voted"] === votedFilter;
      const matchesRoom = roomNumberFilter === "" ? true : 
        (item["room_no"] || item["roomNo"]) === roomNumberFilter;

      return matchesQuery && matchesVoted && matchesRoom;
    });

    setFilteredItems({ list: filtered });
    onFilterChange?.(filtered);
  }, [query, voterList, votedFilter, roomNumberFilter, onFilterChange]);

  const handleVotedChange = async (serialNo: string, newVoted: string) => {
    setFilteredItems((prev) => ({
      list: prev.list.map((item) =>
        (item["serialNo"] || item["serial_no"]) === serialNo ? { ...item, voted: newVoted } : item
      ),
    }));

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      await fetch("https://api.mohsinbhai.com/api/vi/voters/update-voted", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ serialNo: serialNo, voted: newVoted }),
      });
      console.log("✅ Voted status updated successfully");
    } catch (error) {
      console.error("Failed to update voted status:", error);
    }
  };

  return (
    <div className="table-container">
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Voted</th>
            <th>Name</th>
            <th>Door No</th>
            <th>Incharge</th>
            <th>Room Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.list.length > 0 ? (
            filteredItems.list.map((a, i) => (
              <tr key={i}>
                <td>{a["serialNo"] || a["serial_no"]}</td>
                <td className="status-cell">
                  <select
                    className="status-dropdown"
                    value={a.voted || "No"}
                    onChange={(e) =>
                      handleVotedChange(a["serialNo"] || a["serial_no"], e.target.value)
                    }
                  >
                    {VOTED_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{a["name"]}</td>
                <td>{a["doorNo"] || a["door_no"]}</td>
                <td>{a["incharge"]}</td>
                <td>{a["room_no"] || a["roomNo"]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionDayTable;
