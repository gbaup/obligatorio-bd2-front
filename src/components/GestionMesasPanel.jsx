import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionMesasPanel() {
  const [mesas, setMesas] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [nuevoCircuito, setNuevoCircuito] = useState("");

  const cargarMesas = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/mesas`);
    setMesas(res.data);
  };

  const cargarCircuitos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/circuitos`);
    setCircuitos(res.data);
  };

  useEffect(() => {
    cargarMesas();
    cargarCircuitos();
  }, []);

  const handleCrearMesa = async (e) => {
    e.preventDefault();
    if (!nuevoCircuito) return;
    await axios.post(`${import.meta.env.VITE_BASE_URL}/mesas`, {
      id_circuito: parseInt(nuevoCircuito, 10),
    });
    setNuevoCircuito("");
    cargarMesas();
  };

  const handleEliminarMesa = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/mesas/${id}`);
    cargarMesas();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 24, marginTop: 24, borderRadius: 12 }}>
      <h3 style={{ textAlign: "center", color: "#2d5be3", marginBottom: 18 }}>Gestión de Mesas</h3>
      <form onSubmit={handleCrearMesa} style={{ marginBottom: 18, display: "flex", justifyContent: "center", gap: 12 }}>
        <select
          value={nuevoCircuito}
          onChange={(e) => setNuevoCircuito(e.target.value)}
          required
          style={{
            width: 320,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        >
          <option value="">Seleccione un circuito</option>
          {circuitos.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} - {c.localidad} ({c.direccion})
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            background: "#2d5be3",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 22px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
            minWidth: 120,
          }}
        >
          Crear Mesa
        </button>
      </form>
      <div
        style={{
          maxHeight: 220,
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 8,
          background: "#f8faff",
        }}
      >
        {mesas.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>No hay mesas registradas.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mesas.map((mesa) => (
              <div
                key={mesa.id}
                style={{
                  background: "#f1f5ff",
                  borderRadius: 8,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #e0e7ff",
                  fontSize: 16,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700 }}>
                    Mesa #{mesa.id}
                  </span>
                  <span style={{ marginLeft: 12 }}>
                    <b>Circuito:</b> {mesa.id_circuito}
                  </span>
                  <span style={{ marginLeft: 12 }}>
                    <b>Abierta:</b>{" "}
                    <span style={{ color: mesa.abierto ? "green" : "red", fontWeight: 600 }}>
                      {mesa.abierto ? "Sí" : "No"}
                    </span>
                  </span>
                </div>
                <button
                  style={{
                    background: "#fff",
                    color: "#e53935",
                    border: "2px solid #e53935",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "7px 18px",
                    cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(229,57,53,0.07)",
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                  }}
                  onClick={() => handleEliminarMesa(mesa.id)}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#e53935";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#e53935";
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}