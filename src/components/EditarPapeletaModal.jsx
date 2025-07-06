import { useState } from "react";
import axios from "axios";

export default function EditarPapeletaModal({
  papeleta,
  onClose,
  onSaved,
  candidatos = [],
  partidos = [],
  organos = [],
  departamentos = [],
}) {
  const [color, setColor] = useState(papeleta.color || "");
  const [numero, setNumero] = useState(papeleta.numero?.toString() || "");
  const [ciCandidato, setCiCandidato] = useState(
    papeleta.ci_candidato?.toString() || ""
  );
  const [idPartido, setIdPartido] = useState(
    papeleta.id_partido?.toString() || ""
  );
  const [idOrgano, setIdOrgano] = useState(
    papeleta.id_organo?.toString() || ""
  );
  const [nombreDepartamento, setNombreDepartamento] = useState(
    papeleta.nombre_departamento || ""
  );
  const [valor, setValor] = useState(papeleta.valor || "SI");
  const [descripcion, setDescripcion] = useState(papeleta.descripcion || "");
  const [presidente, setPresidente] = useState(
    papeleta.presidente?.toString() || ""
  );
  const [vicepresidente, setVicepresidente] = useState(
    papeleta.vicepresidente?.toString() || ""
  );
  const [lema, setLema] = useState(papeleta.lema || "");

  const handleSave = async () => {
    let payload = { color };
    if (papeleta.tipo === "lista") {
      payload = {
        ...payload,
        numero: Number(numero),
        ci_candidato: Number(ciCandidato),
        id_partido: Number(idPartido),
        id_organo: Number(idOrgano),
        nombre_departamento: nombreDepartamento,
      };
    } else if (papeleta.tipo === "plebiscito") {
      payload = {
        ...payload,
        valor,
        descripcion,
      };
    } else if (papeleta.tipo === "formula") {
      payload = {
        ...payload,
        presidente: Number(presidente),
        vicepresidente: Number(vicepresidente),
        lema,
      };
    }
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/papeletas/${papeleta.id}`,
      payload
    );
    onSaved();
    onClose();
  };

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
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
        }}
      >
        <h3>Editar Papeleta</h3>
        <label>
          Color:
          <input value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        {papeleta.tipo === "lista" && (
          <>
            <label>
              Número:
              <input
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </label>
            <label>
              Candidato:
              <select
                value={ciCandidato}
                onChange={(e) => setCiCandidato(e.target.value)}
              >
                <option value="">Seleccione</option>
                {candidatos.map((c, idx) => (
                  <option
                    key={`${c.ci_ciudadano}-${idx}`}
                    value={c.ci_ciudadano}
                  >
                    {c.ci_ciudadano} - {c.nombres} {c.apellidos}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Partido:
              <select
                value={idPartido}
                onChange={(e) => setIdPartido(e.target.value)}
              >
                <option value="">Seleccione</option>
                {partidos.map((p) => (
                  <option key={p.id} value={p.id.toString()}>
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
              >
                <option value="">Seleccione</option>
                {organos.map((o) => (
                  <option key={o.id} value={o.id.toString()}>
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
        {papeleta.tipo === "plebiscito" && (
          <>
            <label>
              Valor:
              <select value={valor} onChange={(e) => setValor(e.target.value)}>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </label>
            <label>
              Descripción:
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </label>
          </>
        )}
        {papeleta.tipo === "formula" && (
          <>
            <label>
              Presidente:
              <select
                value={presidente}
                onChange={(e) => setPresidente(e.target.value)}
              >
                <option value="">Seleccione</option>
                {candidatos.map((c, idx) => (
                  <option
                    key={`${c.ci_ciudadano}-${idx}`}
                    value={c.ci_ciudadano}
                  >
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
              >
                <option value="">Seleccione</option>
                {candidatos.map((c, idx) => (
                  <option
                    key={`${c.ci_ciudadano}-${idx}`}
                    value={c.ci_ciudadano}
                  >
                    {c.ci_ciudadano} - {c.nombres} {c.apellidos}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lema:
              <input value={lema} onChange={(e) => setLema(e.target.value)} />
            </label>
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}