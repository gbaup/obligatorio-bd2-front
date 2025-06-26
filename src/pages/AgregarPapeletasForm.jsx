import { useEffect, useState } from "react";
import axios from "axios";

export default function AgregarPapeletaForm({
  idEleccion,
  onPapeletaAgregada,
}) {
  const [tipo, setTipo] = useState("lista");
  const [color, setColor] = useState("");
  const [numero, setNumero] = useState("");
  const [ciCandidato, setCiCandidato] = useState("");
  const [idPartido, setIdPartido] = useState("");
  const [idOrgano, setIdOrgano] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [valorPlebiscito, setValorPlebiscito] = useState("SI");
  const [descripcionPlebiscito, setDescripcionPlebiscito] = useState("");
  const [presidente, setPresidente] = useState("");
  const [vicepresidente, setVicepresidente] = useState("");
  const [lema, setLema] = useState("");

  const [candidatos, setCandidatos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [organos, setOrganos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadanos, setCiudadanos] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/ciudadanos/candidatos`)
      .then((res) => setCandidatos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/partidos`)
      .then((res) => setPartidos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/organos`)
      .then((res) => setOrganos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/departamentos`)
      .then((res) => setDepartamentos(res.data));
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/ciudadanos`)
      .then((res) => setCiudadanos(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      color,
      tipo: tipo.toLowerCase(),
      id_eleccion: Number(idEleccion),
    };
    if (tipo === "lista") {
      payload = {
        ...payload,
        numero: Number(numero),
        ci_candidato: Number(ciCandidato),
        id_partido: Number(idPartido),
        id_organo: Number(idOrgano),
        nombre_departamento: nombreDepartamento,
      };
    } else if (tipo === "plebiscito") {
      payload = {
        ...payload,
        valor: valorPlebiscito,
        descripcion: descripcionPlebiscito,
      };
    } else if (tipo === "formula") {
      payload = {
        ...payload,
        presidente: Number(presidente),
        vicepresidente: Number(vicepresidente),
        lema,
      };
    }
    await axios.post(`${import.meta.env.VITE_BASE_URL}/papeletas`, payload);
    setColor("");
    setNumero("");
    setCiCandidato("");
    setIdPartido("");
    setIdOrgano("");
    setNombreDepartamento("");
    setValorPlebiscito("SI");
    setDescripcionPlebiscito("");
    setPresidente("");
    setVicepresidente("");
    setLema("");
    if (onPapeletaAgregada) onPapeletaAgregada();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 10,
        marginBottom: 20,
        border: "1px solid #ccc",
        padding: 10,
      }}
    >
      <label>
        Tipo:
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="lista">Lista</option>
          <option value="plebiscito">Plebiscito</option>
          <option value="formula">Fórmula</option>
        </select>
      </label>
      <label>
        Color:
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </label>
      {tipo === "lista" && (
        <>
          <label>
            Número:
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </label>
          <label>
            Candidato:
            <select
              value={ciCandidato}
              onChange={(e) => setCiCandidato(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {candidatos.map((c) => (
                <option key={c.ci_ciudadano} value={c.ci_ciudadano}>
                  {c.nombres} {c.apellidos}
                </option>
              ))}
            </select>
          </label>
          <label>
            Partido:
            <select
              value={idPartido}
              onChange={(e) => setIdPartido(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Órgano:
            <select
              value={idOrgano}
              onChange={(e) => setIdOrgano(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {organos.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.tipo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Departamento:
            <select
              value={nombreDepartamento}
              onChange={(e) => setNombreDepartamento(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {departamentos.map((d) => (
                <option key={d.nombre} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      {tipo === "plebiscito" && (
        <>
          <label>
            Valor:
            <select
              value={valorPlebiscito}
              onChange={(e) => setValorPlebiscito(e.target.value)}
            >
              <option value="SI">SI</option>
              <option value="NO">NO</option>
            </select>
          </label>
          <label>
            Descripción:
            <input
              value={descripcionPlebiscito}
              onChange={(e) => setDescripcionPlebiscito(e.target.value)}
              required
            />
          </label>
        </>
      )}
      {tipo === "formula" && (
        <>
          <label>
            Presidente:
            <select
              value={presidente}
              onChange={(e) => setPresidente(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {candidatos.map((c) => (
                <option key={c.ci_ciudadano} value={c.ci_ciudadano}>
                  {c.ci_ciudadano} - {c.nombres} {c.apellidos}
                </option>
              ))}
            </select>
          </label>
          <label>
            Vicepresidente:
            <select
              value={vicepresidente}
              onChange={(e) => setVicepresidente(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              {candidatos.map((c) => (
                <option key={c.ci_ciudadano} value={c.ci_ciudadano}>
                  {c.ci_ciudadano} - {c.nombres} {c.apellidos}
                </option>
              ))}
            </select>
          </label>
          <label>
            Lema:
            <input
              value={lema}
              onChange={(e) => setLema(e.target.value)}
              required
            />
          </label>
        </>
      )}
      <button type="submit">Agregar papeleta</button>
    </form>
  );
}
