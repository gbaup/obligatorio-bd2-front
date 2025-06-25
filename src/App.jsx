import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import RegisterCiudadano from './pages/RegisterCiudadano'
import UserPanel from './pages/UserPanel'
import AdminPanel from './pages/AdminPanel';
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Login</Link> | <Link to="/register">Registro Ciudadano</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<RegisterCiudadano />} />
        <Route path="/panel" element={<UserPanel user={user} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App