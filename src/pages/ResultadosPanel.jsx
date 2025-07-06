import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [globalDistribucionPlebiscito, setGlobalDistribucionPlebiscito] =
    useState([]);
  const [globalDistribucionFormula, setGlobalDistribucionFormula] = useState(
    []
  );
  const [globalDesgloseTipoVoto, setGlobalDesgloseTipoVoto] = useState([]);
  const [globalParticipacionFormularios, setGlobalParticipacionFormularios] =
    useState([]);
  const [globalResultadosPartido, setGlobalResultadosPartido] = useState(null);
  const [globalResultadosCandidato, setGlobalResultadosCandidato] =
    useState(null);
  const [globalTotalVotosEmitidos, setGlobalTotalVotosEmitidos] =
    useState(null);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) {
      setError("Faltan datos de circuito o elección.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/circuitos/${id_circuito}/resultados?id_eleccion=${id_eleccion}`
      )
      .then((res) => setResultados(res.data))
      .catch(() => setError("No se pudieron cargar los resultados"))
      .finally(() => setLoading(false));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (!mostrarTotales) return;
    if (!id_eleccion) return;
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/total-votos-emitidos?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalTotalVotosEmitidos(res.data.total))
      .catch(() => setGlobalTotalVotosEmitidos(null));
  }, [mostrarTotales, id_eleccion]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) return;
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/circuitos/${id_circuito}/resultados-partido?id_eleccion=${id_eleccion}`
      )
      .then((res) => setResultadosPartido(res.data))
      .catch(() => setResultadosPartido(null));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!id_circuito || !id_eleccion) return;
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/circuitos/${id_circuito}/resultados-candidato?id_eleccion=${id_eleccion}`
      )
      .then((res) => setResultadosCandidato(res.data))
      .catch(() => setResultadosCandidato(null));
  }, [id_circuito, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (mostrarTotales) return;
    if (!departamento || !id_eleccion) return;
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/resultados-departamento?departamento=${encodeURIComponent(
          departamento
        )}&id_eleccion=${id_eleccion}`
      )
      .then((res) => setResultadosDepartamento(res.data))
      .catch(() => setResultadosDepartamento(null));
  }, [departamento, id_eleccion, mostrarTotales]);

  useEffect(() => {
    if (!mostrarTotales) return;
    if (!id_eleccion) return;
    setLoading(true);
    setError("");
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/distribucion-listas?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalDistribucionListas(res.data))
      .catch(() => setGlobalDistribucionListas([]));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/distribucion-plebiscito?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalDistribucionPlebiscito(res.data))
      .catch(() => setGlobalDistribucionPlebiscito([]));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/distribucion-formula?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalDistribucionFormula(res.data))
      .catch(() => setGlobalDistribucionFormula([]));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/desglose-tipo-voto?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalDesgloseTipoVoto(res.data))
      .catch(() => setGlobalDesgloseTipoVoto([]));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/participacion-formularios?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalParticipacionFormularios(res.data))
      .catch(() => setGlobalParticipacionFormularios([]));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/resultados-partido?id_eleccion=${id_eleccion}`
      )
      .then((res) => setGlobalResultadosPartido(res.data))
      .catch(() => setGlobalResultadosPartido(null));
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/votos/global/resultados-candidato?id_eleccion=${id_eleccion}`
      )
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

  if (loading) return <div>Cargando resultados...</div>;
  if (error)
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );

  return (
    <div>
      <div style={{ margin: "18px 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={mostrarTotales}
            onChange={() => setMostrarTotales((v) => !v)}
            style={{ width: 20, height: 20 }}
          />
          Mostrar resultados totales (todos los circuitos)
        </label>
      </div>

      {mostrarTotales ? (
        <>
          <h2>Resultados Totales</h2>
          <div>
            <b>Total de votos emitidos:</b>{" "}
            {globalTotalVotosEmitidos !== null
              ? globalTotalVotosEmitidos
              : "Cargando..."}
          </div>
          <h3>Distribución por lista</h3>
          <table border="1" cellPadding={4}>
            <thead>
              <tr>
                <th>Partido</th>
                <th>Número de Lista</th>
                <th>Votos</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {globalDistribucionListas.map((l, idx) => (
                <tr key={idx}>
                  <td>{l.nombre_partido}</td>
                  <td>{l.numero_lista}</td>
                  <td>{l.votos}</td>
                  <td>{l.porcentaje}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Distribución por plebiscito</h3>
          {globalDistribucionPlebiscito.length > 0 ? (
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Valor</th>
                  <th>Descripción</th>
                  <th>Votos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {globalDistribucionPlebiscito.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.valor}</td>
                    <td>{p.descripcion}</td>
                    <td>{p.votos}</td>
                    <td>{p.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No hay votos de plebiscito.</div>
          )}

          <h3>Distribución por fórmula</h3>
          {globalDistribucionFormula.length > 0 ? (
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Lema</th>
                  <th>Presidente</th>
                  <th>Vicepresidente</th>
                  <th>Votos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {globalDistribucionFormula.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.lema}</td>
                    <td>
                      {f.presidente_nombre} {f.presidente_apellido}
                    </td>
                    <td>
                      {f.vicepresidente_nombre} {f.vicepresidente_apellido}
                    </td>
                    <td>{f.votos}</td>
                    <td>{f.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No hay votos de fórmula.</div>
          )}

          <h3>Desglose por tipo de voto</h3>
          <ul>
            {globalDesgloseTipoVoto.map((t, idx) => (
              <li key={idx}>
                {t.estado}: {t.cantidad}
              </li>
            ))}
          </ul>
          <h3>Participación por tipo de papeleta</h3>
          <ul>
            {globalParticipacionFormularios.map((f, idx) => (
              <li key={idx}>
                {f.tipo}: {f.cantidad}
              </li>
            ))}
          </ul>

          <h3>Resultados por partido</h3>
          {globalResultadosPartido &&
          globalResultadosPartido.resultados?.length > 0 ? (
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Partido</th>
                  <th>Votos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {globalResultadosPartido.resultados.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nombre_partido}</td>
                    <td>{p.votos}</td>
                    <td>{p.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No hay resultados por partido.</div>
          )}

          <h3>Resultados por candidato</h3>
          {globalResultadosCandidato &&
          globalResultadosCandidato.resultados?.length > 0 ? (
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Partido</th>
                  <th>Número de Lista</th>
                  <th>Votos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {globalResultadosCandidato.resultados.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.ci}</td>
                    <td>{c.nombres}</td>
                    <td>{c.apellidos}</td>
                    <td>{c.nombre_partido}</td>
                    <td>{c.numero_lista}</td>
                    <td>{c.votos}</td>
                    <td>{c.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No hay resultados por candidato.</div>
          )}

          <h3>Reportes adicionales</h3>
          <div>
            <b>Cantidad total de votos observados:</b>{" "}
            {votosObservadosTotal !== null
              ? votosObservadosTotal
              : "Cargando..."}
          </div>
          <h4>Participación ciudadana por circuito</h4>
          <table border="1" cellPadding={4}>
            <thead>
              <tr>
                <th>Circuito</th>
                <th>Votos emitidos</th>
                <th>Padrón</th>
                <th>% Participación</th>
              </tr>
            </thead>
            <tbody>
              {participacionCircuitos.map((c) => (
                <tr key={c.id_circuito}>
                  <td>{c.nombre_circuito}</td>
                  <td>{c.votos_emitidos}</td>
                  <td>{c.padron}</td>
                  <td>{c.porcentaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Distribución de votos por accesibilidad de circuito</h4>
          <table border="1" cellPadding={4}>
            <thead>
              <tr>
                <th>Accesible</th>
                <th>Votos</th>
              </tr>
            </thead>
            <tbody>
              {votosAccesibilidad.map((v, idx) => (
                <tr key={idx}>
                  <td>{v.es_accesible ? "Sí" : "No"}</td>
                  <td>{v.votos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        resultados && (
          <>
            <h2>Panel de Resultados</h2>
            <div>
              <b>Total de votos emitidos:</b> {resultados.total_votos}
            </div>
            <h3>Distribución por lista</h3>
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Partido</th>
                  <th>Número de Lista</th>
                  <th>Votos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {resultados.distribucion_listas.map((l, idx) => (
                  <tr key={idx}>
                    <td>{l.nombre_partido}</td>
                    <td>{l.numero_lista}</td>
                    <td>{l.votos}</td>
                    <td>{l.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Distribución por plebiscito</h3>
            {resultados.distribucion_plebiscito?.length > 0 ? (
              <table border="1" cellPadding={4}>
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Descripción</th>
                    <th>Votos</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.distribucion_plebiscito.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.valor}</td>
                      <td>{p.descripcion}</td>
                      <td>{p.votos}</td>
                      <td>{p.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No hay votos de plebiscito.</div>
            )}

            <h3>Distribución por fórmula</h3>
            {resultados.distribucion_formula?.length > 0 ? (
              <table border="1" cellPadding={4}>
                <thead>
                  <tr>
                    <th>Lema</th>
                    <th>Presidente</th>
                    <th>Vicepresidente</th>
                    <th>Votos</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.distribucion_formula.map((f, idx) => (
                    <tr key={idx}>
                      <td>{f.lema}</td>
                      <td>
                        {f.presidente_nombre} {f.presidente_apellido}
                      </td>
                      <td>
                        {f.vicepresidente_nombre} {f.vicepresidente_apellido}
                      </td>
                      <td>{f.votos}</td>
                      <td>{f.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No hay votos de fórmula.</div>
            )}

            <h3>Desglose por tipo de voto</h3>
            <ul>
              {resultados.desglose_tipo_voto.map((t, idx) => (
                <li key={idx}>
                  {t.estado}: {t.cantidad}
                </li>
              ))}
            </ul>
            <h3>Participación por tipo de papeleta</h3>
            <ul>
              {resultados.participacion_formularios.map((f, idx) => (
                <li key={idx}>
                  {f.tipo}: {f.cantidad}
                </li>
              ))}
            </ul>

            <h3>Resultados por partido</h3>
            {resultadosPartido ? (
              <table border="1" cellPadding={4}>
                <thead>
                  <tr>
                    <th>Partido</th>
                    <th>Votos</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosPartido.resultados.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.nombre_partido}</td>
                      <td>{p.votos}</td>
                      <td>{p.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No hay resultados por partido.</div>
            )}

            <h3>Resultados por candidato</h3>
            {resultadosCandidato ? (
              <table border="1" cellPadding={4}>
                <thead>
                  <tr>
                    <th>CI</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Partido</th>
                    <th>Número de Lista</th>
                    <th>Votos</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosCandidato.resultados.map((c, idx) => (
                    <tr key={idx}>
                      <td>{c.ci}</td>
                      <td>{c.nombres}</td>
                      <td>{c.apellidos}</td>
                      <td>{c.nombre_partido}</td>
                      <td>{c.numero_lista}</td>
                      <td>{c.votos}</td>
                      <td>{c.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No hay resultados por candidato.</div>
            )}

            <h3>Resultados departamentales</h3>
            <div>
              <label>
                Departamento:&nbsp;
                <input
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  placeholder="Ingrese el nombre del departamento"
                />
              </label>
            </div>
            {resultadosDepartamento ? (
              <table border="1" cellPadding={4} style={{ marginTop: 8 }}>
                <thead>
                  <tr>
                    <th>Partido</th>
                    <th>Votos</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosDepartamento.resultados.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.nombre_partido}</td>
                      <td>{p.votos}</td>
                      <td>{p.porcentaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ marginTop: 8 }}>
                No hay resultados departamentales.
              </div>
            )}

            <h3>Reportes adicionales</h3>
            <div>
              <b>Cantidad total de votos observados:</b>{" "}
              {votosObservadosTotal !== null
                ? votosObservadosTotal
                : "Cargando..."}
            </div>
            <h4>Participación ciudadana por circuito</h4>
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Circuito</th>
                  <th>Votos emitidos</th>
                  <th>Padrón</th>
                  <th>% Participación</th>
                </tr>
              </thead>
              <tbody>
                {participacionCircuitos.map((c) => (
                  <tr key={c.id_circuito}>
                    <td>{c.nombre_circuito}</td>
                    <td>{c.votos_emitidos}</td>
                    <td>{c.padron}</td>
                    <td>{c.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Distribución de votos por accesibilidad de circuito</h4>
            <table border="1" cellPadding={4}>
              <thead>
                <tr>
                  <th>Accesible</th>
                  <th>Votos</th>
                </tr>
              </thead>
              <tbody>
                {votosAccesibilidad.map((v, idx) => (
                  <tr key={idx}>
                    <td>{v.es_accesible ? "Sí" : "No"}</td>
                    <td>{v.votos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      )}
    </div>
  );
}
