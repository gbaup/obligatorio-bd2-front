import { useEffect, useState } from "react";
import AgregarPapeletaForm from "../components/AgregarPapeletasForm";
import EditarPapeletaModal from "../components/EditarPapeletaModal";
import axios from "axios";

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
          `${import.meta.env.VITE_BASE_URL}/papeletas/validas?id_eleccion=${
            seleccionada.id
          }`
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
      `${import.meta.env.VITE_BASE_URL}/papeletas/validas?id_eleccion=${
        seleccionada.id
      }`
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
    <div>
      <h2>Panel de Administración</h2>
      <h3>Elegir elección existente</h3>
      <div>
        {elecciones.map((e) => (
          <div key={e.id} style={{ marginBottom: 4 }}>
            <button onClick={() => setSeleccionada(e)}>
              {e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1)} -{" "}
              {formatFecha(e.fecha)}
            </button>
          </div>
        ))}
      </div>
      <h3>Crear nueva elección</h3>
      <form onSubmit={handleCrear}>
        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
          required
        />
        <select
          value={nueva.tipo}
          onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
          required
        >
          {TIPOS_ELECCION.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="submit">Crear</button>
      </form>
      {seleccionada && (
        <div>
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
                `${import.meta.env.VITE_BASE_URL}/elecciones/${
                  seleccionada.id
                }/fecha`,
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
          >
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              required
            />
            <button type="submit">Actualizar fecha</button>
          </form>
          <h4>Papeletas de esta elección:</h4>
          <div>
            {papeletas.length === 0 && <div>No hay papeletas registradas.</div>}
            {papeletas.map((p) => (
              <div key={p.id}>
                {p.color} - {p.tipo}
                <button
                  style={{ marginLeft: 8 }}
                  onClick={async () => {
                    const detalles = await obtenerDetallesPapeleta(p);
                    setEditando(detalles);
                  }}
                >
                  Editar
                </button>
                <button
                  style={{ marginLeft: 8, color: "red" }}
                  onClick={() => handleBorrar(p.id)}
                >
                  Borrar
                </button>
              </div>
            ))}
            <div>
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
  );
}
