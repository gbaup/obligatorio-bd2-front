import { useEffect, useState } from "react";
import axios from "axios";

const ROLES = [
  { value: "PRESIDENTE", label: "Presidente" },
  { value: "SECRETARIO", label: "Secretario" },
  { value: "VOCAL", label: "Vocal" },
];

export default function GestionMiembrosMesaPanel() {
  const [miembros, setMiembros] = useState([]);
  const [ciBuscar, setCiBuscar] = useState("");
  const [ciudadano, setCiudadano] = useState(null);
  const [rol, setRol] = useState(ROLES[0].value);
  const [mensaje, setMensaje] = useState("");
  const [mesas, setMesas] = useState([]);
  const [mesaAsignada, setMesaAsignada] = useState("");
  const [organismo, setOrganismo] = useState("");

  const cargarMiembros = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/miembros-mesa`
    );
    setMiembros(res.data);
  };

  useEffect(() => {
    cargarMiembros();
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/mesas`)
      .then((res) => setMesas(res.data));
  }, []);

  const buscarCiudadano = async () => {
    setMensaje("");
    setCiudadano(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ciudadanos/${ciBuscar}`
      );
      setCiudadano(res.data);
    } catch {
      setMensaje("Ciudadano no encontrado");
    }
  };

  const asignarMiembro = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/miembro-mesa`,
      {
        ci_ciudadano: Number(ciBuscar),
        rol,
        organismo,
        mesa_asignada: mesaAsignada,
      }
    );
    setMensaje("Miembro de mesa asignado correctamente");
    setCiudadano(null);
    setCiBuscar("");
    setRol(ROLES[0].value);
    setOrganismo("");
    setMesaAsignada("");
    cargarMiembros();
  };

  const destituirMiembro = async (ci) => {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/miembros-mesa/${ci}`
    );
    setMensaje("Miembro de mesa destituido");
    cargarMiembros();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 24 }}>
      <h3>Gestión de Miembros de Mesa</h3>
      <h4>Miembros actuales:</h4>
      <ul
        style={{
          maxHeight: "180px",
          overflowY: "auto",
          padding: 0,
          marginBottom: "16px",
          border: "1px solid #eee",
          borderRadius: "8px",
          background: "#f8faff",
          listStyle: "none",
        }}
      >
        {miembros.map((m, idx) => (
          <li
            key={`${m.ci_ciudadano}-${m.rol}-${idx}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: idx !== miembros.length - 1 ? "1px solid #e0e7ff" : "none",
              margin: 0,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {m.nombres} {m.apellidos}
              </div>
              <div style={{ fontSize: 14, color: "#444" }}>
                <b>CI:</b> {m.ci_ciudadano} &nbsp;|&nbsp; <b>Rol:</b> {m.rol.charAt(0).toUpperCase() + m.rol.slice(1).toLowerCase()}
              </div>
              {m.organismo && (
                <div style={{ fontSize: 13, color: "#888" }}>
                  Organismo: {m.organismo}
                </div>
              )}
              {m.mesa_asignada && (
                <div style={{ fontSize: 13, color: "#888" }}>
                  Mesa asignada: {m.mesa_asignada}
                </div>
              )}
            </div>
            <button
              style={{
                marginLeft: 16,
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
              onClick={() => destituirMiembro(m.ci_ciudadano)}
              onMouseOver={e => {
                e.currentTarget.style.background = "#e53935";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#e53935";
              }}
            >
              Destituir
            </button>
          </li>
        ))}
      </ul>
      <h4>Asignar nuevo miembro de mesa</h4>
      <input
        type="text"
        placeholder="Cédula de Identidad"
        value={ciBuscar}
        onChange={(e) => setCiBuscar(e.target.value)}
      />
      <button onClick={buscarCiudadano}>Buscar</button>
      {ciudadano && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>
              {ciudadano.nombres} {ciudadano.apellidos}
            </b>{" "}
            (CI: {ciudadano.ci})
          </div>
          <label>
            Rol:
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ marginLeft: 8 }}>
            Organismo:
            <input
              type="text"
              value={organismo}
              onChange={(e) => setOrganismo(e.target.value)}
              placeholder="Organismo"
              required
            />
          </label>
          <label style={{ marginLeft: 8 }}>
            Mesa:
            <select
              value={mesaAsignada}
              onChange={(e) => setMesaAsignada(e.target.value)}
              required
            >
              <option value="">Seleccione una mesa</option>
              {mesas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  {mesa.id}
                </option>
              ))}
            </select>
          </label>
          <button style={{ marginLeft: 8 }} onClick={asignarMiembro}>
            Asignar como miembro de mesa
          </button>
        </div>
      )}
      {mensaje && <div style={{ marginTop: 12, color: "blue" }}>{mensaje}</div>}
    </div>
  );
}
