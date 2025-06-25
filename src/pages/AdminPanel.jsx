import { useEffect, useState } from "react";
import AgregarPapeletaForm from "./AgregarPapeletasForm";
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/elecciones")
      .then((res) => setElecciones(res.data));
  }, []);

  // Cuando cambia la elección seleccionada, carga sus papeletas
  useEffect(() => {
    if (seleccionada) {
      axios
        .get(
          `http://localhost:3000/papeletas/validas?id_eleccion=${seleccionada.id}`
        )
        .then((res) => setPapeletas(res.data))
        .catch(() => setPapeletas([]));
    } else {
      setPapeletas([]);
    }
  }, [seleccionada]);

  const handleCrear = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/elecciones", nueva);
    setElecciones([...elecciones, res.data]);
    setNueva({ fecha: "", tipo: TIPOS_ELECCION[0].value });
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
                `http://localhost:3000/elecciones/${seleccionada.id}/fecha`,
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
              </div>
            ))}
            <div>
              <h4>Agregar papeleta a esta elección:</h4>
              <AgregarPapeletaForm
                idEleccion={seleccionada.id}
                onPapeletaAgregada={async () => {
                  const res = await axios.get(
                    `http://localhost:3000/papeletas/validas?id_eleccion=${seleccionada.id}`
                  );
                  setPapeletas(res.data);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
