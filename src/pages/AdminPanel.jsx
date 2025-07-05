import { useEffect, useState } from "react";
import AgregarPapeletaForm from "../components/AgregarPapeletasForm";
import EditarPapeletaModal from "../components/EditarPapeletaModal";
import HabilitarVotantePanel from "../components/HabilitarVotantePanel";
import GestionMiembrosMesaPanel from "../components/GestionMiembrosMesaPanel";
import GestionMesasPanel from "../components/GestionMesasPanel";
import GestionCircuitos from "../components/GestionCircuitos";
import axios from "axios";
import Header from "../components/Header";

const TIPOS_ELECCION = [
  { value: "nacional", label: "Nacional" },
  { value: "departamental", label: "Departamental" },
  { value: "municipal", label: "Municipal" },
];

function formatFecha(fecha) {
  if (!fecha) return "";
  const soloFecha = fecha.split("T")[0];
  const [year, month, day] = soloFecha.split("-");
  return `${day}/${month}/${year}`;
}

export default function AdminPanel({ user }) {
  const [elecciones, setElecciones] = useState([]);
  const [nueva, setNueva] = useState({
    fecha: "",
    tipo: TIPOS_ELECCION[0].value,
  });
  const [seleccionada, setSeleccionada] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [papeletas, setPapeletas] = useState([]);
  const [editando, setEditando] = useState(null);

  const [candidatos, setCandidatos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [organos, setOrganos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/elecciones`)
      .then((res) => setElecciones(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/ciudadanos/candidatos`)
      .then((res) => setCandidatos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/partidos`)
      .then((res) => setPartidos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/organos`)
      .then((res) => setOrganos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/departamentos`)
      .then((res) => setDepartamentos(res.data));
  }, []);

  useEffect(() => {
    if (seleccionada) {
      axios
        .get(
          `${import.meta.env.VITE_BASE_URL}/papeletas/validas?id_eleccion=${seleccionada.id}`
        )
        .then((res) => setPapeletas(res.data))
        .catch(() => setPapeletas([]));
    } else {
      setPapeletas([]);
    }
  }, [seleccionada]);

  const handleCrear = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/elecciones`,
      nueva
    );
    setElecciones([...elecciones, res.data]);
    setNueva({ fecha: "", tipo: TIPOS_ELECCION[0].value });
  };

  const handleBorrar = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/papeletas/${id}`);
    setPapeletas(papeletas.filter((p) => p.id !== id));
  };

  const recargarPapeletas = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/papeletas/validas?id_eleccion=${seleccionada.id}`
    );
    setPapeletas(res.data);
  };

  const obtenerDetallesPapeleta = async (p) => {
    let detalles = {};
    if (p.tipo === "lista") {
      detalles = await axios
        .get(`${import.meta.env.VITE_BASE_URL}/papeletas/lista/${p.id}`)
        .then((r) => r.data?.[0] || {});
    } else if (p.tipo === "plebiscito") {
      detalles = await axios
        .get(`${import.meta.env.VITE_BASE_URL}/papeletas/plebiscito/${p.id}`)
        .then((r) => r.data || {});
    } else if (p.tipo === "formula") {
      detalles = await axios
        .get(`${import.meta.env.VITE_BASE_URL}/papeletas/formula/${p.id}`)
        .then((r) => r.data || {});
    }
    return { ...p, ...detalles };
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Header />
      <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2>Panel de Administración</h2>
        <h3>Elegir elección existente</h3>
        <div style={{ marginBottom: 18 }}>
          <select
            style={{
              width: "100%",
              maxWidth: 350,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              marginBottom: 10,
            }}
            value={seleccionada ? seleccionada.id : ""}
            onChange={e => {
              const eleccion = elecciones.find(el => el.id === Number(e.target.value));
              setSeleccionada(eleccion || null);
            }}
          >
            <option value="">Seleccione una elección</option>
            {elecciones.map((e) => (
              <option key={e.id} value={e.id}>
                {e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1)} - {formatFecha(e.fecha)}
              </option>
            ))}
          </select>
        </div>
        <h3>Crear nueva elección</h3>
        <form onSubmit={handleCrear} style={{ maxWidth: 350, margin: "0 auto" }}>
          <input
            type="date"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <select
            value={nueva.tipo}
            onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          >
            {TIPOS_ELECCION.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" style={{ width: "100%" }}>Crear</button>
        </form>
        {seleccionada && (
          <div style={{ marginTop: 32 }}>
            <h4>Elección seleccionada:</h4>
            <p>
              {seleccionada.tipo.charAt(0).toUpperCase() +
                seleccionada.tipo.slice(1)}{" "}
              - {formatFecha(seleccionada.fecha)}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await axios.patch(
                  `${import.meta.env.VITE_BASE_URL}/elecciones/${seleccionada.id}/fecha`,
                  {
                    fecha: nuevaFecha,
                  }
                );
                setElecciones(
                  elecciones.map((e) =>
                    e.id === seleccionada.id ? { ...e, fecha: nuevaFecha } : e
                  )
                );
                setSeleccionada({ ...seleccionada, fecha: nuevaFecha });
                setNuevaFecha("");
              }}
              style={{ maxWidth: 350, margin: "0 auto" }}
            >
              <input
                type="date"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 8 }}
              />
              <button type="submit" style={{ width: "100%" }}>Actualizar fecha</button>
            </form>
            <h4 style={{ marginTop: 24 }}>Papeletas de esta elección:</h4>
            <div>
              {papeletas.length === 0 && <div>No hay papeletas registradas.</div>}
              {papeletas.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#f1f5ff",
                  borderRadius: 8,
                  padding: "14px 18px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  border: "1px solid #e0e7ff",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>
                    {p.color.charAt(0).toUpperCase() + p.color.slice(1)}
                  </span>
                  <span
                    style={{
                      marginLeft: 12,
                      padding: "2px 10px",
                      borderRadius: 12,
                      background: "#e9e9f7",
                      color: "#222",
                      fontWeight: 600,
                      fontSize: 14,
                      textTransform: "capitalize",
                    }}
                  >
                    {p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)}
                  </span>
                </div>
                <span>
                  <button
                    style={{
                      marginRight: 8,
                      background: "#2d5be3",
                      color: "#fff",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: "7px 18px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
                    }}
                    onClick={async () => {
                      const detalles = await obtenerDetallesPapeleta(p);
                      setEditando(detalles);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    style={{
                      background: "#e53935",
                      color: "#fff",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: "7px 18px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 1px 4px rgba(229,57,53,0.07)",
                    }}
                    onClick={() => handleBorrar(p.id)}
                  >
                    Borrar
                  </button>
                </span>
              </div>
            ))}
              <div style={{ marginTop: 18 }}>
                <h4>Agregar papeleta a esta elección:</h4>
                <AgregarPapeletaForm
                  idEleccion={seleccionada.id}
                  onPapeletaAgregada={recargarPapeletas}
                />
              </div>
              {editando && (
                <EditarPapeletaModal
                  papeleta={editando}
                  onClose={() => setEditando(null)}
                  onSaved={recargarPapeletas}
                  candidatos={candidatos}
                  partidos={partidos}
                  organos={organos}
                  departamentos={departamentos}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="card" style={{ maxWidth: 700, margin: "32px auto 0 auto" }}>
        <HabilitarVotantePanel />
      </div>
      <div className="card" style={{ maxWidth: 700, margin: "32px auto 0 auto" }}>
        <GestionMiembrosMesaPanel />
      </div>
      <div className="card" style={{ maxWidth: 700, margin: "32px auto 0 auto" }}>
        <GestionMesasPanel />
      </div>
      <div className="card" style={{ maxWidth: 700, margin: "32px auto 0 auto" }}>
        <GestionCircuitos />
      </div>
    </div>
  );
}