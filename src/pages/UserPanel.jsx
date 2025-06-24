import { useState, useEffect } from "react";
import VerificarCircuito from "./VerificarCircuito";
import axios from "axios";

export default function UserPanel({ user }) {
  const [verificado, setVerificado] = useState(false);
  const [esObservado, setEsObservado] = useState(false);
  const [papeletas, setPapeletas] = useState([]);

  useEffect(() => {
    // Solo carga las papeletas si ya está verificado
    if (verificado) {
      // Aquí deberías obtener el id de la elección actual (hardcodeado o desde el usuario)
      const idEleccion = 1; // Cambia esto según tu lógica
      axios
        .get(`http://localhost:3000/papeletas/validas?id_eleccion=${idEleccion}`)
        .then(res => setPapeletas(res.data))
        .catch(() => setPapeletas([]));
    }
  }, [verificado]);

  if (!user) return null;

  switch (user.rol) {
    case 'CIUDADANO':
      if (!verificado) {
        return (
          <VerificarCircuito
            circuitoAsignado={user.circuitoAsignado}
            onVerificar={({ circuitoIngresado, esObservado }) => {
              setVerificado(true);
              setEsObservado(esObservado);
            }}
          />
        );
      }
      return (
        <div>
          Bienvenido, ciudadano<br />
          {esObservado
            ? <span style={{ color: "orange" }}>Voto observado: requiere validación del presidente</span>
            : <span style={{ color: "green" }}>Circuito verificado correctamente</span>
          }
          <h3>Papeletas válidas:</h3>
          <ul>
            {papeletas.map(p => (
              <li key={p.id}>
                {p.color} - {p.tipo}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'MIEMBRO_MESA':
      return <div>Panel de miembro de mesa</div>;
    case 'AGENTE_POLICIA':
      return <div>Panel de agente de policía</div>;
    default:
      return <div>Rol desconocido</div>;
  }
}