import React from 'react';
import { Link } from 'react-router-dom';


const wardsList = [
  { name: 'ward65', path: '/ward65' },
   { name: 'ward66', path: '/ward66' },

];

const WardsList: React.FC = () => {
  return (
    <div className="hdc-depots-container">
      <h2>HDC Depots</h2>
      <ul>
        {wardsList.map((ward) => (
          <li key={ward.name}>
            <Link to={ward.path}>{ward.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WardsList;
