import { Route } from "react-router-dom";
import WardsList from "./WardsList";
import VoterManagement from "./components/VoterManagement/VoterManagement";
import DoorManagement from "./components/DoorManagement/DoorManagement";
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
    path="/voter-details/*" 
    element={
      <ProtectedRoute>
        <VoterManagement />
      </ProtectedRoute>
    } 
    key="voter-details" 
  />,
];

export default AppRoutes;
