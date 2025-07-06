import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterCiudadano from "./pages/RegisterCiudadano";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import MiembroMesaPanel from "./pages/MiembroMesaPanel";
import ResultadosPanel from "./pages/ResultadosPanel";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<RegisterCiudadano />} />
        <Route path="/panel" element={<UserPanel user={user} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route
          path="/miembro-mesa"
          element={<MiembroMesaPanel user={user} />}
        />
        <Route path="/resultados" element={<ResultadosPanel user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;