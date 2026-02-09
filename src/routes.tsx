import { Route } from "react-router-dom";
import VoterManagement from "./components/VoterManagement/VoterManagement";
import DoorManagement from "./components/DoorManagement/DoorManagement";
import ElectionDay from "./components/ElectionDay/ElectionDay";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const AppRoutes = [
  <Route path="/login" element={<Login />} key="login" />,
  <Route 
    path="/" 
    element={
      <ProtectedRoute>
        <DoorManagement />
      </ProtectedRoute>
    } 
    key="root" 
  />,
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
    key="dashboard" 
  />,
  <Route 
    path="/voter-details/*" 
    element={
      <ProtectedRoute>
        <VoterManagement />
      </ProtectedRoute>
    } 
    key="voter-details" 
  />,
  <Route 
    path="/election-day/*" 
    element={
      <ProtectedRoute>
        <ElectionDay />
      </ProtectedRoute>
    } 
    key="election-day" 
  />,
];

export default AppRoutes;
