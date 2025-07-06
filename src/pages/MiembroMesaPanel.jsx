import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

function ConfirmModal({ open, onConfirm, onCancel, mensaje }) {
  if (!open) return null;
  return (
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
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          minWidth: 320,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        <p style={{ marginBottom: 20 }}>{mensaje}</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ marginRight: 12, background: "#eee", color: "#213547" }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ background: "#2d5be3" }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MiembroMesaPanel({ user }) {
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accionLoading, setAccionLoading] = useState(false);
  const [votosObservados, setVotosObservados] = useState([]);
  const [loadingVotos, setLoadingVotos] = useState(false);
  const [papeletasDetalles, setPapeletasDetalles] = useState({});
  const [modal, setModal] = useState({
    open: false,
    votoId: null,
    accion: null,
  });
  const [circuito, setCircuito] = useState(null);
  const [votosTotales, setVotosTotales] = useState(0);
  const [votosValidos, setVotosValidos] = useState(0);
  const [votosObservadosCount, setVotosObservadosCount] = useState(0);
  const [eleccionEnCurso, setEleccionEnCurso] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/elecciones/en-curso`)
      .then((res) => setEleccionEnCurso(res.data))
      .catch(() => setEleccionEnCurso(null));
  }, []);

  useEffect(() => {
    const fetchCircuitoYVotos = async () => {
      if (mesa && mesa.id_circuito) {
        const resCircuitos = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/circuitos`
        );
        const circuitoData = resCircuitos.data.find(
          (c) => c.id === mesa.id_circuito
        );
        setCircuito(circuitoData);

        const resVotos = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/votos/por-circuito?circuito=${mesa.id_circuito}`
        );
        setVotosTotales(resVotos.data.length);
        setVotosValidos(
          resVotos.data.filter((v) => v.estado === "valido").length
        );

        const resObs = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/votos/observados?circuito=${mesa.id_circuito}`
        );
        setVotosObservadosCount(resObs.data.length);
      } else {
        setCircuito(null);
        setVotosTotales(0);
        setVotosValidos(0);
        setVotosObservadosCount(0);
      }
    };
    fetchCircuitoYVotos();
  }, [mesa]);

  useEffect(() => {
    const fetchVotosObservados = async () => {
      if (mesa && mesa.abierto) {
        setLoadingVotos(true);
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/votos/observados?circuito=${mesa.id_circuito}`
          );
          setVotosObservados(res.data);
          const detalles = {};
          await Promise.all(
            res.data
              .filter((v) => v.id_papeleta)
              .map(async (v) => {
                if (!detalles[v.id_papeleta]) {
                  try {
                    const papeleta = await axios
                      .get(
                        `${import.meta.env.VITE_BASE_URL}/papeletas/${v.id_papeleta}`
                      )
                      .then((r) => r.data);
                    if (papeleta) detalles[v.id_papeleta] = papeleta;
                  } catch {}
                }
              })
          );
          setPapeletasDetalles(detalles);
        } catch {
          setVotosObservados([]);
          setPapeletasDetalles({});
        } finally {
          setLoadingVotos(false);
        }
      } else {
        setVotosObservados([]);
        setPapeletasDetalles({});
      }
    };
    fetchVotosObservados();
  }, [mesa]);

  useEffect(() => {
    async function fetchMesa() {
      setLoading(true);
      try {
        let mesaAsignadaId = user?.mesa_asignada;
        if (!mesaAsignadaId) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/ciudadanos/miembros-mesa`
          );
          const miembro = res.data.find((m) => m.ci_ciudadano === user.ci);
          mesaAsignadaId = miembro?.mesa_asignada;
        }
        if (mesaAsignadaId) {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/mesas`);
          const mesaData = res.data.find((m) => m.id === mesaAsignadaId);
          setMesa(mesaData);
        } else {
          setMesa(null);
        }
      } catch {
        setMesa(null);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchMesa();
  }, [user]);

  const abrirMesa = async () => {
    setAccionLoading(true);
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/mesas/${mesa.id}/abrir`
    );
    setMesa({ ...mesa, abierto: true });
    setAccionLoading(false);
  };

  const cerrarMesa = async () => {
    setAccionLoading(true);
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/mesas/${mesa.id}/cerrar`
    );
    setMesa({ ...mesa, abierto: false });
    setAccionLoading(false);
  };

  const aprobarVoto = async (id) => {
    await axios.patch(`${import.meta.env.VITE_BASE_URL}/votos/${id}/aprobar`);
    setVotosObservados((prev) => prev.filter((v) => v.id !== id));
  };

  const rechazarVoto = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/votos/${id}`);
    setVotosObservados((prev) => prev.filter((v) => v.id !== id));
  };

  if (loading)
    return (
      <div className="centered">
        <div className="card" style={{ textAlign: "center" }}>
          Cargando mesa asignada...
        </div>
      </div>
    );

  return (
    <div className="centered">
      <div className="card" style={{ width: 500, maxWidth: "98vw", textAlign: "center" }}>
        <Header />
        <h2 style={{ marginBottom: 12 }}>Panel de Miembro de Mesa</h2>
        {circuito && (
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ color: "var(--color-primary)", marginBottom: 8 }}>Información del circuito</h3>
            <div style={{ fontSize: 15, marginBottom: 8 }}>
              <b>Localidad:</b> {circuito.localidad} <br />
              <b>Dirección:</b> {circuito.direccion} <br />
              <b>Accesible:</b>{" "}
              <span style={{ color: circuito.es_accesible ? "green" : "red" }}>
                {circuito.es_accesible ? "Sí" : "No"}
              </span>
            </div>
            <div style={{ fontSize: 15 }}>
              <b>Votos totales:</b> {votosTotales} <br />
              <b>Votos aceptados:</b> {votosTotales - votosObservadosCount} <br />
              <b>Votos observados:</b> {votosObservadosCount}
            </div>
          </section>
        )}

        <div style={{ marginBottom: 16 }}>
          <b>
            Bienvenido{user ? `, ${user.nombres} ${user.apellidos}` : ""}.
          </b>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            Aquí podrás gestionar las tareas asignadas como miembro de mesa.
          </div>
        </div>

        {mesa ? (
          <section>
            <div style={{ marginBottom: 10 }}>
              <b>Mesa asignada:</b> #{mesa.id} - Circuito: {mesa.id_circuito} - Estado:{" "}
              <span style={{ color: mesa.abierto ? "green" : "red", fontWeight: 600 }}>
                {mesa.abierto ? "Abierta" : "Cerrada"}
              </span>
            </div>
            {!mesa.abierto ? (
              <div style={{ marginTop: 12 }}>
                <button disabled={accionLoading} onClick={abrirMesa}>
                  Abrir mesa
                </button>
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    navigate("/resultados", {
                      state: {
                        id_circuito: mesa?.id_circuito,
                        id_eleccion: eleccionEnCurso?.id,
                      },
                    })
                  }
                >
                  Ver resultados
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <button disabled={accionLoading} onClick={cerrarMesa}>
                  Cerrar mesa
                </button>
                <div
                  style={{
                    marginTop: 24,
                    background: "#f5f7fa",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <h4 style={{ marginBottom: 8, color: "#2d5be3" }}>Votos Observados</h4>
                  {loadingVotos ? (
                    <div>Cargando votos observados...</div>
                  ) : (
                    <div
                      style={{
                        maxHeight: 220,
                        overflowY: "auto",
                        border: "1px solid #eee",
                        borderRadius: 4,
                        padding: 8,
                        marginTop: 8,
                        background: "#fff",
                      }}
                    >
                    {votosObservados.length === 0 ? (
                      <div style={{ color: "#888" }}>
                        No hay votos observados en este circuito.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {votosObservados.map((v) => {
                          const papeleta = v.id_papeleta
                            ? papeletasDetalles[v.id_papeleta]
                            : null;
                          return (
                            <div
                              key={v.id}
                              style={{
                                background: "#f1f5ff",
                                borderRadius: 8,
                                padding: "14px 18px",
                                marginBottom: 0,
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 1px 4px rgba(45,91,227,0.06)",
                                border: "1px solid #e0e7ff",
                              }}
                            >
                              <div style={{ marginBottom: 8, fontSize: 15 }}>
                                <b>ID:</b> {v.id} &nbsp;|&nbsp;
                                <b>Fecha:</b> {new Date(v.fecha_hora).toLocaleString()} &nbsp;|&nbsp;
                                <b>Estado:</b>{" "}
                                <span style={{ color: v.estado === "valido" ? "#1db954" : "#e53935" }}>
                                  {v.estado}
                                </span>
                              </div>
                              {papeleta && (
                                <div style={{ fontSize: 15, marginBottom: 8 }}>
                                  <b>Color:</b> {papeleta.color || "-"} &nbsp;|&nbsp;
                                  <b>Tipo:</b> {papeleta.tipo || "-"}
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
                                <button
                                  style={{
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
                                  onClick={() =>
                                    setModal({
                                      open: true,
                                      votoId: v.id,
                                      accion: "aprobar",
                                    })
                                  }
                                >
                                  Aprobar
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
                                  onClick={() =>
                                    setModal({
                                      open: true,
                                      votoId: v.id,
                                      accion: "rechazar",
                                    })
                                  }
                                >
                                  Rechazar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    </div>
                  )}
                  <ConfirmModal
                    open={modal.open}
                    mensaje={
                      modal.accion === "aprobar"
                        ? "¿Seguro que desea aprobar este voto observado?"
                        : modal.accion === "rechazar"
                        ? "¿Seguro que desea rechazar (eliminar) este voto observado?"
                        : ""
                    }
                    onConfirm={async () => {
                      if (modal.accion === "aprobar") {
                        await aprobarVoto(modal.votoId);
                      } else if (modal.accion === "rechazar") {
                        await rechazarVoto(modal.votoId);
                      }
                      setModal({ open: false, votoId: null, accion: null });
                    }}
                    onCancel={() =>
                      setModal({ open: false, votoId: null, accion: null })
                    }
                  />
                </div>
              </div>
            )}
          </section>
        ) : (
          <div style={{ marginTop: 16, color: "red" }}>
            No tenés una mesa asignada.
          </div>
        )}
      </div>
    </div>
  );
}