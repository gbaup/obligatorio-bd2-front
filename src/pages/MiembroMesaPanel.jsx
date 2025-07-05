import { useEffect, useState } from "react";
import axios from "axios";

export default function MiembroMesaPanel({ user }) {
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accionLoading, setAccionLoading] = useState(false);
  const [votosObservados, setVotosObservados] = useState([]);
  const [loadingVotos, setLoadingVotos] = useState(false);
  const [papeletasDetalles, setPapeletasDetalles] = useState({});

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

  if (loading) return <div>Cargando mesa asignada...</div>;

  return (
    <div>
      <h2>Panel de Miembro de Mesa</h2>
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
              <button style={{ marginLeft: 8 }} disabled>
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
                            <li key={v.id}>
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
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
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
