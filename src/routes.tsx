import { Route } from "react-router-dom";
import WardsList from "./WardsList";
import VoterManagement from "./components/VoterManagement/VoterManagement";

const AppRoutes = [
  <Route path="/" element={<WardsList />} key="root" />,
   <Route path="/ward65" element={<VoterManagement/>} />,
   <Route path="/ward66" element={<VoterManagement/>} />,
];

export default AppRoutes;
