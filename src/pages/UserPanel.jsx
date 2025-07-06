import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VerificarCircuito from "./VerificarCircuito";
import Header from "../components/Header";
import axios from "axios";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
  const [mesaAbierta, setMesaAbierta] = useState(null);
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
    async function checkMesaAbierta() {
      if (circuitoAsignado && circuitoAsignado.id) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/mesas`);
          const mesa = res.data.find(
            (m) => m.id_circuito === circuitoAsignado.id && m.abierto
          );
          setMesaAbierta(mesa || null);
        } catch {
          setMesaAbierta(null);
        }
      }
    }
    checkMesaAbierta();
  }, [circuitoAsignado]);

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
      <div className="centered">
        <div className="card">
          <Header />
          <h2>No hay elección en curso hoy.</h2>
          <p>Por favor, vuelva a intentarlo en la fecha de la elección.</p>
        </div>
      </div>
    );
  }

  if (!circuitoCargado) {
    return (
      <div className="centered">
        <div className="card">
          <Header />
          Cargando circuito...
        </div>
      </div>
    );
  }

  if (!mesaAbierta && circuitoCargado && verificado) {
    return (
      <div className="centered">
        <div className="card">
          <Header />
          <h2>No hay una mesa abierta en este circuito.</h2>
          <p>Por favor, espere a que se abra una mesa para poder votar.</p>
        </div>
      </div>
    );
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
    const resCiudadano = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/${user.ci}`
    );
    if (resCiudadano.data.ha_votado) {
      setError("Ya has votado. No puedes votar dos veces.");
      setShowModal(false);
      return;
    }

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
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/${user.ci}/habilitar`,
      { ha_votado: true }
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
          padding: 32,
          borderRadius: 12,
          minWidth: 340,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#2d5be3", marginBottom: 18 }}>Confirmar voto</h3>
        <div style={{ marginBottom: 18 }}>
          {Object.entries(seleccion)
            .filter(([id, val]) => val)
            .map(([id]) => {
              const p = papeletas.find((p) => p.id === Number(id));
              if (!p) return null;
              let detalleExtra = "";
              if (p.tipo === "lista" && detalles[p.id] && Array.isArray(detalles[p.id]) && detalles[p.id][0]?.numero) {
                detalleExtra = ` - Lista ${detalles[p.id][0].numero}`;
              }
              return (
                <div
                  key={id}
                  style={{
                    background: "#f1f5ff",
                    borderRadius: 6,
                    padding: "10px 14px",
                    marginBottom: 10,
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span>
                    <span style={{ color: "#2d5be3" }}>{capitalize(p.tipo)}</span>
                    <span style={{ color: "#222" }}>
                      {detalleExtra ? detalleExtra : ""}
                    </span>
                  </span>
                  <span style={{ color: "#555", fontSize: 15 }}>
                    {capitalize(p.color)}
                  </span>
                </div>
              );
            })}
        </div>
        <div
          style={{
            margin: "12px 0 20px 0",
            fontWeight: 600,
            fontSize: 17,
            color:
              validarSeleccion() === "valido"
                ? "#1db954"
                : validarSeleccion() === "anulado"
                ? "#e53935"
                : "#888",
            background:
              validarSeleccion() === "valido"
                ? "#eafbe7"
                : validarSeleccion() === "anulado"
                ? "#ffeaea"
                : "#f5f5f5",
            borderRadius: 6,
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {validarSeleccion() === "blanco" && <span>Voto en blanco</span>}
          {validarSeleccion() === "anulado" && (
            <span style={{ color: "#e53935" }}>Voto nulo/anulado</span>
          )}
          {validarSeleccion() === "valido" && (
            <span style={{ color: "#1db954" }}>Voto válido</span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button onClick={confirmarVoto}>Confirmar</button>
          <button onClick={() => setShowModal(false)} style={{ background: "#eee", color: "#2d5be3" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  if (votoEnviado) {
    return (
      <div className="centered">
        <div className="card" style={{ textAlign: "center" }}>
          <Header />
          <h2>Su voto fue registrado con éxito.</h2>
          <p>
            Tipo de voto: <b>{votoEnviado.estado}</b>
          </p>
        </div>
      </div>
    );
  }

  if (!verificado) {
    return (
      <div className="centered">
        <div className="card" style={{ width: 600, maxWidth: "98vw" }}>
          <Header />
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
                setPapeletas([]);
                setDetalles({});
                setSeleccion({});
                setError("");
              }
            }}
            forzarBusqueda={!circuitoAsignado}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="centered">
      <div className="card" style={{ width: 900, maxWidth: "98vw" }}>
        <Header />
        <h2 style={{ marginBottom: 10 }}>
          Bienvenido, {user?.nombres} 
        </h2>
        <div style={{ marginBottom: 12 }}>
          {esObservado ? (
            <span style={{ color: "orange" }}>
              Voto observado: requiere validación del presidente
            </span>
          ) : (
            <span style={{ color: "green" }}>
              Circuito verificado correctamente
            </span>
          )}
        </div>
        <h3 style={{ marginBottom: 10 }}>Papeletas válidas:</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVotar();
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {papeletas.map((p) => {
              const isSelected = !!seleccion[p.id];
                return (
                <div
                  key={p.id}
                  onClick={() => handleSeleccion(p.id)}
                  style={{
                  border: isSelected
                    ? "2.5px solid #2d5be3"
                    : "1px solid #eaeaea",
                  boxShadow: isSelected
                    ? "0 0 0 4px #eaf1fd"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: isSelected ? "#eaf1fd" : "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
                  cursor: "pointer",
                  userSelect: "none",
                  }}
                  tabIndex={0}
                  onKeyDown={e => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleSeleccion(p.id);
                  }
                  }}
                  aria-pressed={isSelected}
                  role="button"
                >
                  <label style={{ fontWeight: 500, textAlign: "center", display: "block", marginBottom: 8, cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>
                    <b>{capitalize(p.tipo)}</b>
                  </span>
                  <br />
                  <span style={{ fontSize: 17 }}>
                    {capitalize(p.color)}
                    {p.tipo === "lista" && detalles[p.id] && Array.isArray(detalles[p.id]) && detalles[p.id][0]?.numero
                    ? ` - Lista ${detalles[p.id][0].numero}`
                    : ""}
                  </span>
                  </label>
                  <div style={{ fontSize: 14, marginLeft: 0, marginTop: 8 }}>
                  {p.tipo === "lista" &&
                    detalles[p.id] &&
                    Array.isArray(detalles[p.id]) &&
                    detalles[p.id].map((l, idx) => (
                    <div
                      key={idx}
                      style={{
                      background: "#f1f5ff",
                      borderRadius: 6,
                      padding: "8px 10px",
                      marginBottom: 6,
                      textAlign: "left",
                      }}
                    >
                      <div>
                      <b>Candidato:</b> {l.nombres} {l.apellidos}
                      </div>
                      <div>
                      <b>Partido:</b> {l.partido}
                      </div>
                      <div>
                      <b>Órgano:</b> {l.organo}
                      </div>
                      <div>
                      <b>Departamento:</b> {l.departamento}
                      </div>
                    </div>
                    ))}
                  {p.tipo === "plebiscito" && detalles[p.id] && (
                    <div style={{ background: "#f1f5ff", borderRadius: 6, padding: "8px 10px", textAlign: "left" }}>
                    <b>Pregunta:</b> {capitalize(p.color)}
                    <br />
                    <b>Opción:</b> {detalles[p.id].valor}
                    <br />
                    <b>Descripción:</b> {detalles[p.id].descripcion}
                    </div>
                  )}
                  {p.tipo === "formula" && detalles[p.id] && (
                    <div style={{ background: "#f1f5ff", borderRadius: 6, padding: "8px 10px", textAlign: "left" }}>
                    <div>
                      <b>Lema:</b> {detalles[p.id].lema}
                    </div>
                    <div>
                      <b>Presidente:</b> {detalles[p.id].presidente}
                    </div>
                    <div>
                      <b>Vicepresidente:</b> {detalles[p.id].vicepresidente}
                    </div>
                    </div>
                  )}
                  </div>
                </div>
                );
            })}
          </div>
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={{ marginTop: 8 }}>
            Confirmar voto
          </button>
        </form>
        {showModal && <Modal />}
      </div>
    </div>
  );
}