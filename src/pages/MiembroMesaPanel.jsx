import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          borderRadius: 8,
          minWidth: 300,
        }}
      >
        <p>{mensaje}</p>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancelar
        </button>
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
  const navigate = useNavigate();

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
          `${import.meta.env.VITE_BASE_URL}/votos/por-circuito?circuito=${
            mesa.id_circuito
          }`
        );
        setVotosTotales(resVotos.data.length);
        setVotosValidos(
          resVotos.data.filter((v) => v.estado === "valido").length
        );

        const resObs = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/votos/observados?circuito=${
            mesa.id_circuito
          }`
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
            `${import.meta.env.VITE_BASE_URL}/votos/observados?circuito=${
              mesa.id_circuito
            }`
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
                        `${import.meta.env.VITE_BASE_URL}/papeletas/${
                          v.id_papeleta
                        }`
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

  useEffect(() => {
    const fetchVotosObservados = async () => {
      if (mesa && mesa.abierto) {
        setLoadingVotos(true);
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/votos/observados?circuito=${
              mesa.id_circuito
            }`
          );
          setVotosObservados(res.data);
        } catch {
          setVotosObservados([]);
        } finally {
          setLoadingVotos(false);
        }
      } else {
        setVotosObservados([]);
      }
    };
    fetchVotosObservados();
  }, [mesa]);

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

  if (loading) return <div>Cargando mesa asignada...</div>;

  return (
    <div>
      <h2>Panel de Miembro de Mesa</h2>
      {circuito && (
        <div style={{ marginBottom: 16 }}>
          <h3>Información del circuito</h3>
          <div>
            <b>Localidad:</b> {circuito.localidad} <br />
            <b>Dirección:</b> {circuito.direccion} <br />
            <b>Accesible:</b> {circuito.es_accesible ? "Sí" : "No"}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Votos totales:</b> {votosTotales} <br />
            <b>Votos Aceptados:</b> {votosTotales - votosObservadosCount} <br />
            <b>Votos observados:</b> {votosObservadosCount}
          </div>
        </div>
      )}

      <p>Bienvenido{user ? `, ${user.nombres} ${user.apellidos}` : ""}.</p>
      <p>Aquí podrás gestionar las tareas asignadas como miembro de mesa.</p>

      {mesa ? (
        <div style={{ marginTop: 16 }}>
          <div>
            <b>Mesa asignada:</b> #{mesa.id} - Circuito: {mesa.id_circuito} -{" "}
            Estado:{" "}
            <span style={{ color: mesa.abierto ? "green" : "red" }}>
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
                onClick={() => navigate("/resultados")}
              >
                Ver resultados
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <button disabled={accionLoading} onClick={cerrarMesa}>
                Cerrar mesa
              </button>

              <div style={{ marginTop: 20 }}>
                <h4>Votos Observados</h4>
                {loadingVotos ? (
                  <div>Cargando votos observados...</div>
                ) : (
                  <div
                    style={{
                      maxHeight: 180,
                      overflowY: "auto",
                      border: "1px solid #eee",
                      borderRadius: 4,
                      padding: 8,
                      marginTop: 8,
                    }}
                  >
                    {votosObservados.length === 0 ? (
                      <div>No hay votos observados en este circuito.</div>
                    ) : (
                      <ul>
                        {votosObservados.map((v) => {
                          const papeleta = v.id_papeleta
                            ? papeletasDetalles[v.id_papeleta]
                            : null;
                          return (
                            <li key={v.id} style={{ marginBottom: 8 }}>
                              ID: {v.id} - Fecha:{" "}
                              {new Date(v.fecha_hora).toLocaleString()} -
                              Estado: {v.estado}
                              {papeleta && (
                                <>
                                  {" "}
                                  - Color: {papeleta.color || "-"} - Tipo:{" "}
                                  {papeleta.tipo || "-"}
                                </>
                              )}
                              <button
                                style={{ marginLeft: 8 }}
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
                                  marginLeft: 8,
                                  color: "red",
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
                            </li>
                          );
                        })}
                      </ul>
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
        </div>
      ) : (
        <div style={{ marginTop: 16, color: "red" }}>
          No tenés una mesa asignada.
        </div>
      )}
    </div>
  );
}
