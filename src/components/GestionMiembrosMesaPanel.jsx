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
          paddingRight: "8px",
          marginBottom: "16px",
          border: "1px solid #eee",
          borderRadius: "4px",
        }}
      >
        {miembros.map((m, idx) => (
          <li key={`${m.ci_ciudadano}-${m.rol}-${idx}`}>
            {m.nombres} {m.apellidos} (CI: {m.ci_ciudadano}) - Rol: {m.rol}
            <button
              style={{ marginLeft: 8, color: "red" }}
              onClick={() => destituirMiembro(m.ci_ciudadano)}
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
