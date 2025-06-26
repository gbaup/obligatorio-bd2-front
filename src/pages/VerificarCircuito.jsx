import {useState} from "react";
import axios from "axios";

export default function VerificarCircuito({circuitoAsignado, onVerificar}) {
    const [buscandoOtro, setBuscandoOtro] = useState(false);
    const [localidad, setLocalidad] = useState("");
    const [circuitos, setCircuitos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleBuscar = async (e) => {
        const value = e.target.value;
        setLocalidad(value);
        if (value.length >= 2) {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/papeletas/circuitos-por-localidad?localidad=${value}`
            );
            setCircuitos(res.data);
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
                    <br/>
                    <b>Localidad:</b> {circuitoAsignado.localidad}
                    <br/>
                    <b>Dirección:</b> {circuitoAsignado.direccion}
                    <br/>
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
            <h2>Buscar otro circuito por localidad</h2>
            <input
                type="text"
                placeholder="Ingrese localidad"
                value={localidad}
                onChange={handleBuscar}
            />
            {loading && <div>Cargando...</div>}
            <ul>
                {circuitos.map((c) => (
                    <li key={c.id}>
                        <b>Dirección:</b> {c.direccion} <br/>
                        <b>Accesible:</b> {c.es_accesible ? "Sí" : "No"}
                        <br/>
                        <button
                            onClick={() =>
                                onVerificar({circuitoIngresado: c.id, esObservado: true})
                            }
                        >
                            Votar en este circuito (observado)
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setBuscandoOtro(false)}>Volver</button>
        </div>
    );
}
