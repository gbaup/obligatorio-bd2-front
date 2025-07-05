import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionCircuitos() {
  const [circuitos, setCircuitos] = useState([]);
  const [nuevo, setNuevo] = useState({
    localidad: "",
    direccion: "",
    es_accesible: false,
    serie_cc: "",
    inicio_num_cc: "",
    fin_num_cc: "",
    id_zona: "",
  });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const [zonas, setZonas] = useState([]);

  const cargarCircuitos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/circuitos`);
    setCircuitos(res.data);
  };

  useEffect(() => {
    cargarCircuitos();
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/zonas`)
      .then((res) => setZonas(res.data));
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_BASE_URL}/circuitos`, {
      ...nuevo,
      inicio_num_cc: Number(nuevo.inicio_num_cc),
      fin_num_cc: Number(nuevo.fin_num_cc),
      id_zona: Number(nuevo.id_zona),
    });
    setNuevo({
      localidad: "",
      direccion: "",
      es_accesible: false,
      serie_cc: "",
      inicio_num_cc: "",
      fin_num_cc: "",
      id_zona: "",
    });
    cargarCircuitos();
  };

  const handleEditar = (c) => {
    setEditando(c.id);
    setEditData({ ...c });
  };

  const handleGuardar = async (id) => {
    await axios.patch(`${import.meta.env.VITE_BASE_URL}/circuitos/${id}`, {
      ...editData,
      inicio_num_cc: Number(editData.inicio_num_cc),
      fin_num_cc: Number(editData.fin_num_cc),
      id_zona: Number(editData.id_zona),
    });
    setEditando(null);
    setEditData({});
    cargarCircuitos();
  };

  const handleEliminar = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/circuitos/${id}`);
    cargarCircuitos();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 24, marginTop: 24, borderRadius: 12 }}>
      <h3 style={{ textAlign: "center", color: "#2d5be3", marginBottom: 18 }}>Gestión de Circuitos</h3>
      {/* Lista de circuitos arriba */}
      <div
        style={{
          maxHeight: 320,
          overflowY: "auto",
          border: "1px solid #e0e7ff",
          borderRadius: 12,
          padding: 12,
          background: "#f4f7fe",
          marginBottom: 24,
        }}
      >
        {circuitos.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>No hay circuitos registrados.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {circuitos.map((c) =>
              editando === c.id ? (
                <div
                  key={c.id}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #e0e7ff",
                    fontSize: 15,
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <input
                      value={editData.localidad}
                      onChange={(e) => setEditData({ ...editData, localidad: e.target.value })}
                      style={{ width: 100 }}
                    />
                    <input
                      value={editData.direccion}
                      onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
                      style={{ width: 120 }}
                    />
                    <input
                      value={editData.serie_cc}
                      onChange={(e) => setEditData({ ...editData, serie_cc: e.target.value })}
                      style={{ width: 60 }}
                    />
                    <input
                      type="number"
                      value={editData.inicio_num_cc}
                      onChange={(e) => setEditData({ ...editData, inicio_num_cc: e.target.value })}
                      style={{ width: 80 }}
                    />
                    <input
                      type="number"
                      value={editData.fin_num_cc}
                      onChange={(e) => setEditData({ ...editData, fin_num_cc: e.target.value })}
                      style={{ width: 80 }}
                    />
                    <select
                      value={editData.id_zona}
                      onChange={(e) => setEditData({ ...editData, id_zona: e.target.value })}
                      style={{ width: 120 }}
                    >
                      <option value="">Seleccione zona</option>
                      {zonas.map((z) => (
                        <option key={z.id} value={z.id}>
                          #{z.id} - {z.nombre}
                        </option>
                      ))}
                    </select>
                    <label style={{ marginLeft: 8 }}>
                      <input
                        type="checkbox"
                        checked={editData.es_accesible}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            es_accesible: e.target.checked,
                          })
                        }
                        style={{ marginRight: 4 }}
                      />
                      Accesible
                    </label>
                  </div>
                  <div>
                    <button
                      style={{
                        marginRight: 8,
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
                      onClick={() => handleGuardar(c.id)}
                    >
                      Guardar
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
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={c.id}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: "16px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1.5px solid #e0e7ff",
                    fontSize: 16,
                    boxShadow: "0 2px 8px rgba(45,91,227,0.04)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, wordBreak: "break-word" }}>
                      #{c.id} - {c.localidad} <span style={{ fontWeight: 400 }}>({c.direccion})</span>
                    </div>
                    <div style={{ fontSize: 15, margin: "2px 0", color: "#222" }}>
                      <b>Serie:</b> {c.serie_cc} &nbsp;
                      <b>CC:</b> {c.inicio_num_cc} a {c.fin_num_cc}
                    </div>
                    <div style={{ fontSize: 15, margin: "2px 0", color: "#222" }}>
                      <b>Zona:</b> {c.id_zona} &nbsp;
                      <b style={{ color: c.es_accesible ? "#1db954" : "#e53935" }}>
                        {c.es_accesible ? "Accesible" : "No accesible"}
                      </b>
                    </div>
                  </div>
                  <div>
                    <button
                      style={{
                        marginRight: 8,
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
                      onClick={() => handleEditar(c)}
                    >
                      Editar
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
                      onClick={() => handleEliminar(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      {/* Formulario para agregar circuito debajo */}
      <form
        onSubmit={handleCrear}
        style={{
          marginBottom: 18,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Localidad"
          value={nuevo.localidad}
          onChange={(e) => setNuevo({ ...nuevo, localidad: e.target.value })}
          required
          style={{ width: 200, minWidth: 150, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          placeholder="Dirección"
          value={nuevo.direccion}
          onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })}
          required
          style={{ width: 220, minWidth: 150, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          placeholder="Serie (ej: ART, CAN, CER)"
          value={nuevo.serie_cc}
          onChange={(e) => setNuevo({ ...nuevo, serie_cc: e.target.value })}
          required
          style={{ width: 230, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Inicio credencial (ej: 100000)"
          value={nuevo.inicio_num_cc}
          onChange={(e) => setNuevo({ ...nuevo, inicio_num_cc: e.target.value })}
          required
          style={{ width: 250, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Fin credencial (ej: 100999)"
          value={nuevo.fin_num_cc}
          onChange={(e) => setNuevo({ ...nuevo, fin_num_cc: e.target.value })}
          required
          style={{ width: 220, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <select
          value={nuevo.id_zona}
          onChange={(e) => setNuevo({ ...nuevo, id_zona: e.target.value })}
          required
          style={{ width: 180, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="">Seleccione zona</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              #{z.id} - {z.nombre}
            </option>
          ))}
        </select>
        <label style={{ display: "flex", alignItems: "center", marginLeft: 8, fontSize: 15 }}>
          <input
            type="checkbox"
            checked={nuevo.es_accesible}
            onChange={(e) => setNuevo({ ...nuevo, es_accesible: e.target.checked })}
            style={{ marginRight: 4 }}
          />
          Accesible
        </label>
        <button
          type="submit"
          style={{
            background: "#2d5be3",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 22px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(45,91,227,0.07)",
            minWidth: 120,
          }}
        >
          Agregar Circuito
        </button>
      </form>
    </div>
  );
}