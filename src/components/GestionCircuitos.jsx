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
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 24 }}>
      <h3>Gestión de Circuitos</h3>
      <form onSubmit={handleCrear} style={{ marginBottom: 16 }}>
        <input
          placeholder="Localidad"
          value={nuevo.localidad}
          onChange={(e) => setNuevo({ ...nuevo, localidad: e.target.value })}
          required
        />
        <input
          placeholder="Dirección"
          value={nuevo.direccion}
          onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })}
          required
        />
        <input
          placeholder="Serie CC"
          value={nuevo.serie_cc}
          onChange={(e) => setNuevo({ ...nuevo, serie_cc: e.target.value })}
          required
          style={{ width: 60 }}
        />
        <input
          type="number"
          placeholder="Inicio CC"
          value={nuevo.inicio_num_cc}
          onChange={(e) =>
            setNuevo({ ...nuevo, inicio_num_cc: e.target.value })
          }
          required
          style={{ width: 80 }}
        />
        <input
          type="number"
          placeholder="Fin CC"
          value={nuevo.fin_num_cc}
          onChange={(e) => setNuevo({ ...nuevo, fin_num_cc: e.target.value })}
          required
          style={{ width: 80 }}
        />
        <select
          value={nuevo.id_zona}
          onChange={(e) => setNuevo({ ...nuevo, id_zona: e.target.value })}
          required
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
          Accesible
          <input
            type="checkbox"
            checked={nuevo.es_accesible}
            onChange={(e) =>
              setNuevo({ ...nuevo, es_accesible: e.target.checked })
            }
            style={{ marginLeft: 4 }}
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>
          Agregar
        </button>
      </form>
      <ul
        style={{
          maxHeight: "180px",
          overflowY: "auto",
          paddingRight: "8px",
          marginBottom: "16px",
          border: "1px solid #eee",
          borderRadius: "4px",
        }}
      >
        {circuitos.map((c) =>
          editando === c.id ? (
            <li key={c.id}>
              <input
                value={editData.localidad}
                onChange={(e) =>
                  setEditData({ ...editData, localidad: e.target.value })
                }
                style={{ width: 100 }}
              />
              <input
                value={editData.direccion}
                onChange={(e) =>
                  setEditData({ ...editData, direccion: e.target.value })
                }
                style={{ width: 120 }}
              />
              <input
                value={editData.serie_cc}
                onChange={(e) =>
                  setEditData({ ...editData, serie_cc: e.target.value })
                }
                style={{ width: 60 }}
              />
              <input
                type="number"
                value={editData.inicio_num_cc}
                onChange={(e) =>
                  setEditData({ ...editData, inicio_num_cc: e.target.value })
                }
                style={{ width: 80 }}
              />
              <input
                type="number"
                value={editData.fin_num_cc}
                onChange={(e) =>
                  setEditData({ ...editData, fin_num_cc: e.target.value })
                }
                style={{ width: 80 }}
              />
              <select
                value={editData.id_zona}
                onChange={(e) =>
                  setEditData({ ...editData, id_zona: e.target.value })
                }
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
                Accesible
                <input
                  type="checkbox"
                  checked={editData.es_accesible}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      es_accesible: e.target.checked,
                    })
                  }
                  style={{ marginLeft: 4 }}
                />
              </label>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => handleGuardar(c.id)}
              >
                Guardar
              </button>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>
            </li>
          ) : (
            <li key={c.id}>
              #{c.id} - {c.localidad} ({c.direccion}) - Serie: {c.serie_cc} -
              CC: {c.inicio_num_cc} a {c.fin_num_cc} - Zona: {c.id_zona} -{" "}
              {c.es_accesible ? "Accesible" : "No accesible"}
              <button style={{ marginLeft: 8 }} onClick={() => handleEditar(c)}>
                Editar
              </button>
              <button
                style={{ marginLeft: 8, color: "red" }}
                onClick={() => handleEliminar(c.id)}
              >
                Eliminar
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
