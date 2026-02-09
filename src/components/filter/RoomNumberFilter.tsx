// src/components/filter/RoomNumberFilter.tsx
import React from "react";
import "./Inchargefilter.css";

export type RoomNumberFilterProps = {
  /** Currently selected room number (controlled) */
  roomNumber: string;
  /** State setter from parent */
  setRoomNumber: (roomNumber: string) => void;
};

const ROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

const RoomNumberFilter: React.FC<RoomNumberFilterProps> = ({ roomNumber, setRoomNumber }) => {
  return (
    <div className="incharge-filter">
      <select
        className="incharge-filter-select"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      >
        {/* 👇 This acts as placeholder text inside the box */}
        <option value="" disabled>
          All Rooms
        </option>

        <option value="">All Rooms</option>
        {ROOM_OPTIONS.map((room) => (
          <option key={room} value={room}>
            Room {room}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoomNumberFilter;
