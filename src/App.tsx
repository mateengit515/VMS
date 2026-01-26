import { BrowserRouter, Routes } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {AppRoutes}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
