import { useState } from "react";
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

export default function HabilitarVotantePanel() {
  const [ci, setCi] = useState("");
  const [ciudadano, setCiudadano] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [modal, setModal] = useState({ open: false, habilitar: false });

  const buscarCiudadano = async () => {
    setMensaje("");
    setCiudadano(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ciudadanos/${ci}`
      );
      setCiudadano(res.data);
    } catch {
      setMensaje("Ciudadano no encontrado");
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/${ci}/habilitar`,
      { ha_votado: nuevoEstado }
    );
    setCiudadano({ ...ciudadano, ha_votado: nuevoEstado });
    setMensaje(
      nuevoEstado
        ? "Ciudadano deshabilitado para votar"
        : "Ciudadano habilitado para votar"
    );
  };

  const cambiarEstadoTodos = async (nuevoEstado) => {
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/ciudadanos/habilitar-todos`,
      { ha_votado: nuevoEstado }
    );
    setMensaje(
      nuevoEstado
        ? "Todos los ciudadanos deshabilitados para votar"
        : "Todos los ciudadanos habilitados para votar"
    );
    setModal({ open: false, habilitar: false });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 24 }}>
      <h3>Habilitar/Deshabilitar votante</h3>
      <input
        type="text"
        placeholder="Cédula de Identidad"
        value={ci}
        onChange={(e) => setCi(e.target.value)}
      />
      <button onClick={buscarCiudadano}>Buscar</button>
      {ciudadano && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>
              {ciudadano.nombres} {ciudadano.apellidos}
            </b>{" "}
            (CI: {ciudadano.ci})
          </div>
          <div>
            Estado:{" "}
            {ciudadano.ha_votado ? (
              <span style={{ color: "red" }}>Deshabilitado</span>
            ) : (
              <span style={{ color: "green" }}>Habilitado</span>
            )}
          </div>
          <button
            onClick={() => cambiarEstado(!ciudadano.ha_votado)}
            style={{ marginTop: 8 }}
          >
            {ciudadano.ha_votado ? "Habilitar" : "Deshabilitar"}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setModal({ open: true, habilitar: true })}>
          Habilitar todos
        </button>
        <button
          onClick={() => setModal({ open: true, habilitar: false })}
          style={{ marginLeft: 8 }}
        >
          Deshabilitar todos
        </button>
      </div>
      <ConfirmModal
        open={modal.open}
        mensaje={
          modal.habilitar
            ? "¿Está seguro que desea habilitar a todos los ciudadanos para votar?"
            : "¿Está seguro que desea deshabilitar a todos los ciudadanos para votar?"
        }
        onConfirm={() => cambiarEstadoTodos(!modal.habilitar)}
        onCancel={() => setModal({ open: false, habilitar: false })}
      />
      {mensaje && <div style={{ marginTop: 12, color: "blue" }}>{mensaje}</div>}
    </div>
  );
}
