import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MohsinLogo from "../../images/Mohsin.png";
import "./Dashboard.css";
import { useAuth } from "../../contexts/AuthContext";
import { getAuthHeaders } from "../../helpers/authHelper";

interface VotingStats {
  totalVoters: number;
  votedCount: number;
  notVotedCount: number;
  votedPercentage: number;
  notVotedPercentage: number;
}

const Dashboard: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const [stats, setStats] = useState<VotingStats>({
    totalVoters: 0,
    votedCount: 0,
    notVotedCount: 0,
    votedPercentage: 0,
    notVotedPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const res = await axios.get("https://api.mohsinbhai.com/api/vi/voters/voting-stats", {
          headers
        });
        
        console.log("✅ Loaded voting stats:", res.data);
        
        const total = res.data.totalVoters || 0;
        const voted = res.data.votedCount || 0;
        const notVoted = res.data.notVotedCount || (total - voted);
        
        setStats({
          totalVoters: total,
          votedCount: voted,
          notVotedCount: notVoted,
          votedPercentage: total > 0 ? (voted / total) * 100 : 0,
          notVotedPercentage: total > 0 ? (notVoted / total) * 100 : 0,
        });
      } catch (err) {
        console.error("❌ Error fetching voting stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={MohsinLogo} alt="Team Mohsin Bhai" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <h2 className="dashboard-title">Team Mohsin Bhai!</h2>
          </Link>
          <p className="dashboard-subtitle">Live Voting Dashboard</p>
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
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="dashboard-btn">Door Management</button>
          </Link>
          <button className="dashboard-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <hr className="header-divider" />

      {loading ? (
        <div className="loading-container">
          <p>Loading stats...</p>
        </div>
      ) : (
        <div className="stats-container">
          <div className="stat-card total-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-label">Total Voters</h3>
              <p className="stat-value">{stats.totalVoters.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card voted-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-label">Voted</h3>
              <p className="stat-value">{stats.votedCount.toLocaleString()}</p>
              <div className="percentage-bar">
                <div 
                  className="percentage-fill voted-fill" 
                  style={{ width: `${stats.votedPercentage}%` }}
                ></div>
              </div>
              <p className="stat-percentage">{stats.votedPercentage.toFixed(2)}%</p>
            </div>
          </div>

          <div className="stat-card not-voted-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-label">Not Voted</h3>
              <p className="stat-value">{stats.notVotedCount.toLocaleString()}</p>
              <div className="percentage-bar">
                <div 
                  className="percentage-fill not-voted-fill" 
                  style={{ width: `${stats.notVotedPercentage}%` }}
                ></div>
              </div>
              <p className="stat-percentage">{stats.notVotedPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
