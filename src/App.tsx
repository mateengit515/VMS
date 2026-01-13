import { BrowserRouter, Routes } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {AppRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
