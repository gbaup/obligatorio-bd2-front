import { useState } from "react";
import axios from "axios";

export default function VerificarCircuito({
  circuitoAsignado,
  onVerificar,
  forzarBusqueda,
}) {
  const [buscandoOtro, setBuscandoOtro] = useState(
    !circuitoAsignado || forzarBusqueda
  );
  const [localidad, setLocalidad] = useState("");
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    const value = e.target.value;
    setLocalidad(value);
    if (value.length >= 2) {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/papeletas/circuitos-por-localidad?localidad=${value}`
        );
        setCircuitos(res.data);
      } catch {
        setCircuitos([]);
      }
      setLoading(false);
    } else {
      setCircuitos([]);
    }
  };

  if (!buscandoOtro) {
    return (
      <div>
        <h2>Verificación de circuito</h2>
        <p>
          Su circuito asignado es:
          <br />
          <b>Localidad:</b> {circuitoAsignado.localidad}
          <br />
          <b>Dirección:</b> {circuitoAsignado.direccion}
          <br />
          <b>Accesible:</b> {circuitoAsignado.es_accesible ? "Sí" : "No"}
        </p>
        <p>¿Desea votar en este circuito?</p>
        <button
          onClick={() =>
            onVerificar({
              circuitoIngresado: circuitoAsignado.id,
              esObservado: false,
            })
          }
        >
          Sí, votar aquí
        </button>
        <button onClick={() => setBuscandoOtro(true)}>
          No, buscar otro circuito
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#2d5be3", marginBottom: 18, textAlign: "center" }}>
        Buscar otro circuito por localidad
      </h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Ingrese localidad"
          value={localidad}
          onChange={handleBuscar}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
      </div>
      {loading && <div style={{ textAlign: "center" }}>Cargando...</div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          margin: "0 auto 24px auto",
          maxWidth: 1100,
        }}
      >
        {circuitos.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#fff",
              border: "1.5px solid #eaeaea",
              borderRadius: 12,
              padding: "20px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 120,
              justifyContent: "center",
              transition: "box-shadow 0.2s, border 0.2s",
            }}
          >
            <div style={{ marginBottom: 12, width: "100%", textAlign: "center" }}>
              <div>
                <b>Dirección:</b> {c.direccion}
              </div>
              <div>
                <b>Accesible:</b>{" "}
                <span style={{ color: c.es_accesible ? "green" : "red", fontWeight: 600 }}>
                  {c.es_accesible ? "Sí" : "No"}
                </span>
              </div>
            </div>
            <button
              style={{
                background: "#2d5be3",
                color: "#fff",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                padding: "10px 20px",
                marginTop: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
                width: "100%",
                maxWidth: 260,
                transition: "background 0.2s",
              }}
              onClick={() =>
                onVerificar({ circuitoIngresado: c.id, esObservado: true })
              }
            >
              Votar en este circuito (observado)
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setBuscandoOtro(false)}
          style={{
            background: "#2d5be3",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 22px",
            border: "none",
            cursor: "pointer",
            marginTop: 8,
            boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
          }}
        >
          Volver
        </button>
      </div>
    </div>
  );
}