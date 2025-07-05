import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const [eleccionEnCurso, setEleccionEnCurso] = useState(null);
  const [circuitoAsignado, setCircuitoAsignado] = useState(null);
  const [circuitoCargado, setCircuitoCargado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.es_admin) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.es_admin) return null;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/elecciones/en-curso`)
      .then((res) => setEleccionEnCurso(res.data))
      .catch(() => setEleccionEnCurso(null));
  }, []);

  useEffect(() => {
    async function fetchCircuito() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/circuitos/por-cc/${user.cc}`
        );
        setCircuitoAsignado(res.data);
      } catch {
        setCircuitoAsignado(null);
      } finally {
        setCircuitoCargado(true);
      }
    }
    fetchCircuito();
  }, [user.cc]);

  useEffect(() => {
    if (verificado && eleccionEnCurso && eleccionEnCurso.id) {
      axios
        .get(
          `${import.meta.env.VITE_BASE_URL}/papeletas/validas?id_eleccion=${
            eleccionEnCurso.id
          }`
        )
        .then(async (res) => {
          setPapeletas(res.data);

          const detallesObj = {};
          for (const p of res.data) {
            let det = null;
            if (p.id && !isNaN(Number(p.id))) {
              if (p.tipo === "lista") {
                det = await axios
                  .get(
                    `${import.meta.env.VITE_BASE_URL}/papeletas/lista/${p.id}`
                  )
                  .then((r) => r.data);
              } else if (p.tipo === "plebiscito") {
                det = await axios
                  .get(
                    `${import.meta.env.VITE_BASE_URL}/papeletas/plebiscito/${
                      p.id
                    }`
                  )
                  .then((r) => r.data);
              } else if (p.tipo === "formula") {
                det = await axios
                  .get(
                    `${import.meta.env.VITE_BASE_URL}/papeletas/formula/${p.id}`
                  )
                  .then((r) => r.data);
              }
            }
            detallesObj[p.id] = det;
          }
          setDetalles(detallesObj);
        })
        .catch(() => setPapeletas([]));
    }
  }, [verificado, eleccionEnCurso]);

  if (!eleccionEnCurso) {
    return (
      <div>
        <h2>No hay elección en curso hoy.</h2>
        <p>Por favor, vuelva a intentarlo en la fecha de la elección.</p>
      </div>
    );
  }

  if (!circuitoCargado) {
    return <div>Cargando circuito...</div>;
  }

  const validarSeleccion = () => {
    const seleccionados = Object.entries(seleccion).filter(([id, val]) => val);
    if (seleccionados.length === 0) return "blanco";
    const listas = papeletas.filter(
      (p) => p.tipo === "lista" && seleccion[p.id]
    );
    const partidos = new Set(listas.map((l) => detalles[l.id]?.partido));
    if (partidos.size > 1) return "anulado";
    return "valido";
  };

  const handleSeleccion = (id) => {
    const tipoSeleccionado = papeletas.find((p) => p.id === id)?.tipo;
    setSeleccion((sel) => {
      const nuevaSeleccion = {};
      for (const p of papeletas) {
        if (p.tipo === tipoSeleccionado) {
          nuevaSeleccion[p.id] = false;
        } else if (sel[p.id]) {
          nuevaSeleccion[p.id] = true;
        }
      }
      nuevaSeleccion[id] = !sel[id];
      return nuevaSeleccion;
    });
  };

  const handleVotar = async () => {
    const estado = validarSeleccion();
    if (estado === "anulado") {
      setError("No puede seleccionar listas de partidos distintos.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const confirmarVoto = async () => {
    const estado = validarSeleccion();
    const idPapeletas = Object.entries(seleccion)
      .filter(([id, val]) => val)
      .map(([id]) => Number(id));
    const payload = {
      id_papeletas: idPapeletas,
      id_circuito_votado: circuitoAsignado?.id,
      id_circuito_asignado: circuitoAsignado?.id,
      fecha_hora: new Date().toISOString(),
      es_observado: esObservado,
      estado,
    };
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/votos`,
      payload
    );
    setVotoEnviado(res.data);
    setShowModal(false);
  };

  const Modal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 300,
        }}
      >
        <h3>Confirmar voto</h3>
        <ul>
          {Object.entries(seleccion)
            .filter(([id, val]) => val)
            .map(([id]) => (
              <li key={id}>
                {papeletas.find((p) => p.id === Number(id))?.color} -{" "}
                {papeletas.find((p) => p.id === Number(id))?.tipo}
              </li>
            ))}
        </ul>
        <p>
          {validarSeleccion() === "blanco" && <span>Voto en blanco</span>}
          {validarSeleccion() === "anulado" && <span>Voto nulo/anulado</span>}
          {validarSeleccion() === "valido" && <span>Voto válido</span>}
        </p>
        <button onClick={confirmarVoto}>Confirmar</button>
        <button onClick={() => setShowModal(false)} style={{ marginLeft: 8 }}>
          Cancelar
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  if (votoEnviado) {
    return (
      <div>
        <h2>Su voto fue registrado con éxito.</h2>
        <p>
          Tipo de voto: <b>{votoEnviado.estado}</b>
        </p>
      </div>
    );
  }

  if (!verificado) {
    return (
      <VerificarCircuito
        circuitoAsignado={circuitoAsignado}
        onVerificar={({ circuitoIngresado, esObservado }) => {
          setVerificado(true);
          setEsObservado(esObservado);

          if (
            circuitoIngresado &&
            (!circuitoAsignado || circuitoIngresado !== circuitoAsignado.id)
          ) {
            setCircuitoAsignado({ ...circuitoAsignado, id: circuitoIngresado });
            setPapeletas([]); // Limpiar papeletas
            setDetalles({}); // Limpiar detalles
            setSeleccion({}); // Limpiar selección
            setError(""); // Limpiar error
          }
        }}
        forzarBusqueda={!circuitoAsignado}
      />
    );
  }

  return (
    <div>
      Bienvenido, ciudadano
      <br />
      {esObservado ? (
        <span style={{ color: "orange" }}>
          Voto observado: requiere validación del presidente
        </span>
      ) : (
        <span style={{ color: "green" }}>
          Circuito verificado correctamente
        </span>
      )}
      <h3>Papeletas válidas:</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVotar();
        }}
      >
        <ul>
          {papeletas.map((p) => (
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
                {p.tipo === "lista" &&
                  detalles[p.id] &&
                  Array.isArray(detalles[p.id]) && (
                    <ul>
                      {detalles[p.id].map((l, idx) => (
                        <li key={idx}>
                          Candidato: {l.nombres} {l.apellidos}, Partido:{" "}
                          {l.partido}, Órgano: {l.organo}, Departamento:{" "}
                          {l.departamento}
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
                    Lema: {detalles[p.id].lema}, Presidente:{" "}
                    {detalles[p.id].presidente}, Vicepresidente:{" "}
                    {detalles[p.id].vicepresidente}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Confirmar voto</button>
      </form>
      {showModal && <Modal />}
    </div>
  );
}
