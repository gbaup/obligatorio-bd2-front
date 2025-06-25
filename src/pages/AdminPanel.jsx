import { useEffect, useState } from "react";
import axios from "axios";

const TIPOS_ELECCION = [
  { value: "nacional", label: "Nacional" },
  { value: "departamental", label: "Departamental" },
  { value: "municipal", label: "Municipal" },
];

function formatFecha(fecha) {
  if (!fecha) return "";
  // Si viene en formato completo, tomar solo la parte de la fecha
  const soloFecha = fecha.split("T")[0];
  const [year, month, day] = soloFecha.split("-");
  return `${day}/${month}/${year}`;
}

export default function AdminPanel({ user }) {
  const [elecciones, setElecciones] = useState([]);
  const [nueva, setNueva] = useState({ fecha: "", tipo: TIPOS_ELECCION[0].value });
  const [seleccionada, setSeleccionada] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/elecciones").then(res => setElecciones(res.data));
  }, []);

  const handleCrear = async e => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/elecciones", nueva);
    setElecciones([...elecciones, res.data]);
    setNueva({ fecha: "", tipo: TIPOS_ELECCION[0].value });
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <h3>Elegir elección existente</h3>
      <ul>
        {elecciones.map(e => (
          <li key={e.id}>
            <button onClick={() => setSeleccionada(e)}>
              {e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1)} - {formatFecha(e.fecha)}
            </button>
          </li>
        ))}
      </ul>
      <h3>Crear nueva elección</h3>
      <form onSubmit={handleCrear}>
        <input
          type="date"
          value={nueva.fecha}
          onChange={e => setNueva({ ...nueva, fecha: e.target.value })}
          required
        />
        <select
          value={nueva.tipo}
          onChange={e => setNueva({ ...nueva, tipo: e.target.value })}
          required
        >
          {TIPOS_ELECCION.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button type="submit">Crear</button>
      </form>
      {seleccionada && (
        <div>
            <h4>Elección seleccionada:</h4>
            <p>
            {seleccionada.tipo.charAt(0).toUpperCase() + seleccionada.tipo.slice(1)} - {formatFecha(seleccionada.fecha)}
            </p>
            <form
            onSubmit={async e => {
                e.preventDefault();
                await axios.patch(`http://localhost:3000/elecciones/${seleccionada.id}/fecha`, {
                    fecha: nuevaFecha,
                });
                setElecciones(elecciones.map(e =>
                e.id === seleccionada.id ? { ...e, fecha: nuevaFecha } : e
                ));
                setSeleccionada({ ...seleccionada, fecha: nuevaFecha });
                setNuevaFecha("");
            }}
            >
            <input
                type="date"
                value={nuevaFecha}
                onChange={e => setNuevaFecha(e.target.value)}
                required
            />
            <button type="submit">Actualizar fecha</button>
            </form>
        </div>
        )}
    </div>
  );
}