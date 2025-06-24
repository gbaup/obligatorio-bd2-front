import { useState, useEffect } from "react";
import VerificarCircuito from "./VerificarCircuito";
import axios from "axios";

export default function UserPanel({ user }) {
  const [verificado, setVerificado] = useState(false);
  const [esObservado, setEsObservado] = useState(false);
  const [papeletas, setPapeletas] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [seleccion, setSeleccion] = useState({});
  const [error, setError] = useState("");
  const [votoEnviado, setVotoEnviado] = useState(null);

  useEffect(() => {
    if (verificado) {
      const idEleccion = 11;
      axios
        .get(`http://localhost:3000/papeletas/validas?id_eleccion=${idEleccion}`)
        .then(async res => {
          setPapeletas(res.data);

          const detallesObj = {};
          for (const p of res.data) {
            let det = null;
            if (p.tipo === "lista") {
              det = await axios.get(`http://localhost:3000/papeletas/lista/${p.id}`).then(r => r.data);
            } else if (p.tipo === "plebiscito") {
              det = await axios.get(`http://localhost:3000/papeletas/plebiscito/${p.id}`).then(r => r.data);
            } else if (p.tipo === "formula") {
              det = await axios.get(`http://localhost:3000/papeletas/formula/${p.id}`).then(r => r.data);
            }
            detallesObj[p.id] = det;
          }
          setDetalles(detallesObj);
        })
        .catch(() => setPapeletas([]));
    }
  }, [verificado]);

  const validarSeleccion = () => {
    const seleccionados = Object.entries(seleccion).filter(([id, val]) => val);
    if (seleccionados.length === 0) return "blanco";
    const listas = papeletas.filter(p => p.tipo === "lista" && seleccion[p.id]);
    const partidos = new Set(listas.map(l => detalles[l.id]?.partido));
    if (partidos.size > 1) return "anulado";
    return "valido";
  };

  const handleSeleccion = (id) => {
    setSeleccion(sel => ({ ...sel, [id]: !sel[id] }));
  };

  const handleVotar = async () => {
    const estado = validarSeleccion();
    if (estado === "anulado") {
      setError("No puede seleccionar listas de partidos distintos.");
      return;
    }
    setError("");
    const idPapeletas = Object.entries(seleccion)
      .filter(([id, val]) => val)
      .map(([id]) => Number(id));
    const payload = {
      ci_ciudadano: user.ci,
      id_papeletas: idPapeletas,
      id_circuito_votado: user.circuitoAsignado.id,
      id_circuito_asignado: user.circuitoAsignado.id,
      fecha_hora: new Date().toISOString(),
    };
    const res = await axios.post("http://localhost:3000/votos", payload);
    setVotoEnviado(res.data);
  };

  if (!user) return null;

  if (votoEnviado) {
    return (
      <div>
        <h2>Su voto fue registrado con éxito.</h2>
        <p>Tipo de voto: <b>{votoEnviado.estado}</b></p>
      </div>
    );
  }

  switch (user.rol) {
    case 'CIUDADANO':
      if (!verificado) {
        return (
          <VerificarCircuito
            circuitoAsignado={user.circuitoAsignado}
            onVerificar={({ circuitoIngresado, esObservado }) => {
              setVerificado(true);
              setEsObservado(esObservado);
            }}
          />
        );
      }
      return (
        <div>
          Bienvenido, ciudadano<br />
          {esObservado
            ? <span style={{ color: "orange" }}>Voto observado: requiere validación del presidente</span>
            : <span style={{ color: "green" }}>Circuito verificado correctamente</span>
          }
          <h3>Papeletas válidas:</h3>
          <form onSubmit={e => { e.preventDefault(); handleVotar(); }}>
            <ul>
              {papeletas.map(p => (
                <li key={p.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!seleccion[p.id]}
                      onChange={() => handleSeleccion(p.id)}
                    />
                    {p.color} - {p.tipo}
                  </label>
                  <div>
                    {p.tipo === "lista" && detalles[p.id] && Array.isArray(detalles[p.id]) && (
                      <ul>
                        {detalles[p.id].map((l, idx) => (
                          <li key={idx}>
                            Candidato: {l.nombres} {l.apellidos}, Partido: {l.partido}, Órgano: {l.organo}, Departamento: {l.departamento}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.tipo === "plebiscito" && detalles[p.id] && (
                      <span>
                        {detalles[p.id].valor}: {detalles[p.id].descripcion}
                      </span>
                    )}
                    {p.tipo === "formula" && detalles[p.id] && (
                      <span>
                        Lema: {detalles[p.id].lema}, Presidente: {detalles[p.id].presidente}, Vicepresidente: {detalles[p.id].vicepresidente}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit">Confirmar voto</button>
          </form>
        </div>
      );
    default:
      return null;
  }
}