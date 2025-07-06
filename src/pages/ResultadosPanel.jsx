import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

export default function ResultadosPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_circuito, id_eleccion } = location.state || {};
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultadosPartido, setResultadosPartido] = useState(null);
  const [resultadosCandidato, setResultadosCandidato] = useState(null);
  const [resultadosDepartamento, setResultadosDepartamento] = useState(null);
  const [departamento, setDepartamento] = useState("");
  const [votosObservadosTotal, setVotosObservadosTotal] = useState(null);
  const [participacionCircuitos, setParticipacionCircuitos] = useState([]);
  const [votosAccesibilidad, setVotosAccesibilidad] = useState([]);
  const [mostrarTotales, setMostrarTotales] = useState(false);

  const [globalDistribucionListas, setGlobalDistribucionListas] = useState([]);
  const [globalDistribucionPlebiscito, setGlobalDistribucionPlebiscito] = useState([]);
  const [globalDistribucionFormula, setGlobalDistribucionFormula] = useState([]);
  const [globalDesgloseTipoVoto, setGlobalDesgloseTipoVoto] = useState([]);
  const [globalParticipacionFormularios, setGlobalParticipacionFormularios] = useState([]);
  const [globalResultadosPartido, setGlobalResultadosPartido] = useState(null);
  const [globalResultadosCandidato, setGlobalResultadosCandidato] = useState(null);
  const [globalTotalVotosEmitidos, setGlobalTotalVotosEmitidos] = useState(null);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) {
      setError("Faltan datos de circuito o elección.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/circuitos/${id_circuito}/resultados?id_eleccion=${id_eleccion}`)
      .then((res) => setResultados(res.data))
      .catch(() => setError("No se pudieron cargar los resultados"))
      .finally(() => setLoading(false));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (!mostrarTotales) return;
    if (!id_eleccion) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/total-votos-emitidos?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalTotalVotosEmitidos(res.data.total))
      .catch(() => setGlobalTotalVotosEmitidos(null));
  }, [mostrarTotales, id_eleccion]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/circuitos/${id_circuito}/resultados-partido?id_eleccion=${id_eleccion}`)
      .then((res) => setResultadosPartido(res.data))
      .catch(() => setResultadosPartido(null));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/circuitos/${id_circuito}/resultados-candidato?id_eleccion=${id_eleccion}`)
      .then((res) => setResultadosCandidato(res.data))
      .catch(() => setResultadosCandidato(null));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!departamento || !id_eleccion) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/resultados-departamento?departamento=${encodeURIComponent(departamento)}&id_eleccion=${id_eleccion}`)
      .then((res) => setResultadosDepartamento(res.data))
      .catch(() => setResultadosDepartamento(null));
  }, [departamento, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (!mostrarTotales) return;
    if (!id_eleccion) return;
    setLoading(true);
    setError("");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/distribucion-listas?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalDistribucionListas(res.data))
      .catch(() => setGlobalDistribucionListas([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/distribucion-plebiscito?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalDistribucionPlebiscito(res.data))
      .catch(() => setGlobalDistribucionPlebiscito([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/distribucion-formula?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalDistribucionFormula(res.data))
      .catch(() => setGlobalDistribucionFormula([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/desglose-tipo-voto?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalDesgloseTipoVoto(res.data))
      .catch(() => setGlobalDesgloseTipoVoto([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/participacion-formularios?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalParticipacionFormularios(res.data))
      .catch(() => setGlobalParticipacionFormularios([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/resultados-partido?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalResultadosPartido(res.data))
      .catch(() => setGlobalResultadosPartido(null));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/global/resultados-candidato?id_eleccion=${id_eleccion}`)
      .then((res) => setGlobalResultadosCandidato(res.data))
      .catch(() => setGlobalResultadosCandidato(null));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/participacion-circuito`)
      .then((res) => setParticipacionCircuitos(res.data))
      .catch(() => setParticipacionCircuitos([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/votos-accesibilidad`)
      .then((res) => setVotosAccesibilidad(res.data))
      .catch(() => setVotosAccesibilidad([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/observados-total`)
      .then((res) => setVotosObservadosTotal(res.data.cantidad))
      .catch(() => setVotosObservadosTotal(null))
      .finally(() => setLoading(false));
  }, [mostrarTotales, id_eleccion]);

  useEffect(() => {
    if (mostrarTotales) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/observados-total`)
      .then((res) => setVotosObservadosTotal(res.data.cantidad))
      .catch(() => setVotosObservadosTotal(null));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/participacion-circuito`)
      .then((res) => setParticipacionCircuitos(res.data))
      .catch(() => setParticipacionCircuitos([]));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/votos/votos-accesibilidad`)
      .then((res) => setVotosAccesibilidad(res.data))
      .catch(() => setVotosAccesibilidad([]));
  }, [mostrarTotales]);

  if (loading) return (
    <div className="centered">
      <Header />
      <div className="card" style={{ marginTop: 40, fontSize: 20, textAlign: "center" }}>
        Cargando resultados...
      </div>
    </div>
  );
  if (error)
    return (
      <div className="centered">
        <Header />
        <div className="card" style={{ marginTop: 40, textAlign: "center" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );

  // Estilos reutilizables
  const sectionStyle = {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(45,91,227,0.04)",
    padding: "24px 28px",
    marginBottom: 32,
    width: "100%",
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
  };

  const tableStyle = {
    width: "100%",
    background: "#fff",
    borderRadius: 8,
    borderCollapse: "collapse",
    marginBottom: 18,
    fontSize: 15,
    boxShadow: "0 1px 4px rgba(45,91,227,0.04)",
  };

  const thStyle = {
    padding: 10,
    background: "#f1f5ff",
    fontWeight: 700,
    fontSize: 15,
    borderBottom: "1.5px solid #e0e7ff",
    textAlign: "center",
  };

  const tdStyle = {
    padding: 10,
    textAlign: "center",
    borderBottom: "1px solid #e0e7ff",
  };

  // Nuevo estilo para listas tipo "tarjeta"
  const listStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    alignItems: "center",
    background: "#f8faff",
    borderRadius: 8,
    padding: "18px 0",
    margin: "12px 0",
    fontSize: 16,
    fontWeight: 500,
    boxShadow: "0 1px 4px rgba(45,91,227,0.04)",
    border: "1px solid #f1f5ff",
    minHeight: 40,
  };

  const listItemStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: "10px 22px",
    minWidth: 120,
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(45,91,227,0.06)",
    border: "1px solid #e0e7ff",
    color: "#213547",
    fontWeight: 500,
    fontSize: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f1f5ff",
              border: "1.5px solid #2d5be3",
              borderRadius: 18,
              padding: "10px 22px",
              fontWeight: 600,
              color: "#2d5be3",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
              transition: "border 0.2s, background 0.2s",
            }}
          >
            <input
              type="checkbox"
              checked={mostrarTotales}
              onChange={() => setMostrarTotales((v) => !v)}
              style={{ width: 22, height: 22, accentColor: "#2d5be3", marginRight: 8 }}
            />
            Mostrar resultados totales (todos los circuitos)
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ ...sectionStyle }}>
            <h2 style={{ color: "#2d5be3", marginBottom: 18, textAlign: "center" }}>
              {mostrarTotales ? "Resultados Totales" : "Panel de Resultados"}
            </h2>
            <div style={{ fontWeight: 600, marginBottom: 18, textAlign: "center" }}>
              Total de votos emitidos:{" "}
              <span style={{ fontWeight: 400 }}>
                {mostrarTotales
                  ? globalTotalVotosEmitidos !== null
                    ? globalTotalVotosEmitidos
                    : "Cargando..."
                  : resultados?.total_votos ?? "-"}
              </span>
            </div>

            {/* Distribución por lista */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Distribución por lista</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Partido</th>
                    <th style={thStyle}>Número de Lista</th>
                    <th style={thStyle}>Votos</th>
                    <th style={thStyle}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {(mostrarTotales ? globalDistribucionListas : resultados?.distribucion_listas || []).map((l, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{l.nombre_partido}</td>
                      <td style={tdStyle}>{l.numero_lista}</td>
                      <td style={tdStyle}>{l.votos}</td>
                      <td style={tdStyle}>{l.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Distribución por plebiscito */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Distribución por plebiscito</h3>
            {(mostrarTotales ? globalDistribucionPlebiscito : resultados?.distribucion_plebiscito)?.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Valor</th>
                      <th style={thStyle}>Descripción</th>
                      <th style={thStyle}>Votos</th>
                      <th style={thStyle}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mostrarTotales ? globalDistribucionPlebiscito : resultados?.distribucion_plebiscito || []).map((p, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>{p.valor}</td>
                        <td style={tdStyle}>{p.descripcion}</td>
                        <td style={tdStyle}>{p.votos}</td>
                        <td style={tdStyle}>{p.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888", marginBottom: 18, textAlign: "center" }}>No hay votos de plebiscito.</div>
            )}

            {/* Distribución por fórmula */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Distribución por fórmula</h3>
            {(mostrarTotales ? globalDistribucionFormula : resultados?.distribucion_formula)?.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Lema</th>
                      <th style={thStyle}>Presidente</th>
                      <th style={thStyle}>Vicepresidente</th>
                      <th style={thStyle}>Votos</th>
                      <th style={thStyle}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mostrarTotales ? globalDistribucionFormula : resultados?.distribucion_formula || []).map((f, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>{f.lema}</td>
                        <td style={tdStyle}>{f.presidente_nombre} {f.presidente_apellido}</td>
                        <td style={tdStyle}>{f.vicepresidente_nombre} {f.vicepresidente_apellido}</td>
                        <td style={tdStyle}>{f.votos}</td>
                        <td style={tdStyle}>{f.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888", marginBottom: 18, textAlign: "center" }}>No hay votos de fórmula.</div>
            )}

            {/* Desglose por tipo de voto */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Desglose por tipo de voto</h3>
            <div style={listStyle}>
              {(mostrarTotales ? globalDesgloseTipoVoto : resultados?.desglose_tipo_voto || []).length === 0 ? (
                <span style={{ color: "#888" }}>Sin datos</span>
              ) : (
                (mostrarTotales ? globalDesgloseTipoVoto : resultados?.desglose_tipo_voto || []).map((t, idx) => (
                  <div key={idx} style={listItemStyle}>
                    <span style={{ color: "#2d5be3" }}>{t.estado}</span>
                    <span style={{ fontWeight: 700 }}>{t.cantidad}</span>
                  </div>
                ))
              )}
            </div>

            {/* Participación por tipo de papeleta */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Participación por tipo de papeleta</h3>
            <div style={listStyle}>
              {(mostrarTotales ? globalParticipacionFormularios : resultados?.participacion_formularios || []).length === 0 ? (
                <span style={{ color: "#888" }}>Sin datos</span>
              ) : (
                (mostrarTotales ? globalParticipacionFormularios : resultados?.participacion_formularios || []).map((f, idx) => (
                  <div key={idx} style={listItemStyle}>
                    <span style={{ color: "#2d5be3" }}>{f.tipo}</span>
                    <span style={{ fontWeight: 700 }}>{f.cantidad}</span>
                  </div>
                ))
              )}
            </div>

            {/* Resultados por partido */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Resultados por partido</h3>
            {(mostrarTotales
              ? globalResultadosPartido?.resultados?.length > 0
              : resultadosPartido?.resultados?.length > 0) ? (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Partido</th>
                      <th style={thStyle}>Votos</th>
                      <th style={thStyle}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mostrarTotales
                      ? globalResultadosPartido.resultados
                      : resultadosPartido.resultados
                    ).map((p, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>{p.nombre_partido}</td>
                        <td style={tdStyle}>{p.votos}</td>
                        <td style={tdStyle}>{p.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888", marginBottom: 18, textAlign: "center" }}>No hay resultados por partido.</div>
            )}

            {/* Resultados por candidato */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Resultados por candidato</h3>
            {(mostrarTotales
              ? globalResultadosCandidato?.resultados?.length > 0
              : resultadosCandidato?.resultados?.length > 0) ? (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>CI</th>
                      <th style={thStyle}>Nombre</th>
                      <th style={thStyle}>Apellido</th>
                      <th style={thStyle}>Partido</th>
                      <th style={thStyle}>Número de Lista</th>
                      <th style={thStyle}>Votos</th>
                      <th style={thStyle}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mostrarTotales
                      ? globalResultadosCandidato.resultados
                      : resultadosCandidato.resultados
                    ).map((c, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>{c.ci}</td>
                        <td style={tdStyle}>{c.nombres}</td>
                        <td style={tdStyle}>{c.apellidos}</td>
                        <td style={tdStyle}>{c.nombre_partido}</td>
                        <td style={tdStyle}>{c.numero_lista}</td>
                        <td style={tdStyle}>{c.votos}</td>
                        <td style={tdStyle}>{c.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#888", marginBottom: 18, textAlign: "center" }}>No hay resultados por candidato.</div>
            )}

            {/* Resultados departamentales */}
            {!mostrarTotales && (
              <>
                <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Resultados departamentales</h3>
                <div style={{ marginBottom: 10 }}>
                  <label>
                    Departamento:&nbsp;
                    <input
                      value={departamento}
                      onChange={(e) => setDepartamento(e.target.value)}
                      placeholder="Ingrese el nombre del departamento"
                      style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                  </label>
                </div>
                {resultadosDepartamento ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Partido</th>
                          <th style={thStyle}>Votos</th>
                          <th style={thStyle}>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadosDepartamento.resultados.map((p, idx) => (
                          <tr key={idx}>
                            <td style={tdStyle}>{p.nombre_partido}</td>
                            <td style={tdStyle}>{p.votos}</td>
                            <td style={tdStyle}>{p.porcentaje}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ color: "#888", marginTop: 8, textAlign: "center" }}>No hay resultados departamentales.</div>
                )}
              </>
            )}

            {/* Reportes adicionales */}
            <h3 style={{ color: "#2d5be3", marginTop: 24, marginBottom: 10 }}>Reportes adicionales</h3>
            <div style={{ marginBottom: 10 }}>
              <b>Cantidad total de votos observados:</b>{" "}
              {votosObservadosTotal !== null ? votosObservadosTotal : "Cargando..."}
            </div>
            <h4 style={{ color: "#2d5be3", marginTop: 18 }}>Participación ciudadana por circuito</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Circuito</th>
                    <th style={thStyle}>Votos emitidos</th>
                    <th style={thStyle}>Padrón</th>
                    <th style={thStyle}>% Participación</th>
                  </tr>
                </thead>
                <tbody>
                  {participacionCircuitos.map((c) => (
                    <tr key={c.id_circuito}>
                      <td style={tdStyle}>{c.nombre_circuito}</td>
                      <td style={tdStyle}>{c.votos_emitidos}</td>
                      <td style={tdStyle}>{c.padron}</td>
                      <td style={tdStyle}>{c.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h4 style={{ color: "#2d5be3", marginTop: 18 }}>Distribución de votos por accesibilidad de circuito</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Accesible</th>
                    <th style={thStyle}>Votos</th>
                  </tr>
                </thead>
                <tbody>
                  {votosAccesibilidad.map((v, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{v.es_accesible ? "Sí" : "No"}</td>
                      <td style={tdStyle}>{v.votos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}