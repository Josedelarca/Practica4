import { useState, useEffect, useCallback } from "react";
import './Tiempo.css';

export function Tiempo() {
    const [datosTiempo, setDatosTiempo] = useState(null);
    const [buscar, setBuscar] = useState("La Ceiba");
    const [termino, setTermino] = useState(buscar);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTiempo = useCallback(async (q = buscar) => {
        setLoading(true);
        setError(null);
        try {
            const respuesta = await fetch(`https://api.weatherapi.com/v1/current.json?key=b1cdd0e1ad6c4446af1232644252210&q=${encodeURIComponent(q)}&aqi=no`);
            if (!respuesta.ok) {
                const text = await respuesta.text();
                throw new Error(`HTTP ${respuesta.status}: ${text}`);
            }
            const datosJson = await respuesta.json();
            setDatosTiempo(datosJson);
        } catch (err) {
            console.error('Error', err);
            setError(err.message ?? String(err));
            setDatosTiempo(null);
        } finally {
            setLoading(false);
        }
    }, [buscar]);

    useEffect(() => {
        fetchTiempo(buscar);
    }, [buscar, fetchTiempo]);

    const controladorInput = (e) => {
        setTermino(e.target.value);
        if (e.key === 'Enter') {
            setBuscar(e.target.value || 'La Ceiba');
        }
    };

    const onBuscarClick = () => setBuscar(termino || 'La Ceiba');

    return (
        <div className="tiempo-root d-flex justify-content-center">
            <div className="card tiempo-card p-0">
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                        <div>
                            <h5 className="card-title mb-1">{datosTiempo?.location?.name ?? buscar}</h5>
                            <small className="text-muted">{datosTiempo?.location?.country ?? ''}</small>
                        </div>
                        <div className="ms-auto text-end">
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => fetchTiempo(buscar)} disabled={loading}>Actualizar</button>
                        </div>
                    </div>

                    {loading && <div className="tiempo-loading mt-3">Cargando...</div>}

                    {error && <div className="alert alert-danger my-3">{error}</div>}

                    {!loading && datosTiempo && (
                        <div className="tiempo-content d-flex align-items-center gap-3 mt-3">
                            <img className="tiempo-icon" src={datosTiempo.current.condition.icon} alt={datosTiempo.current.condition.text} />
                            <div>
                                <div className="fs-3 fw-bold">{datosTiempo.current.temp_c}°C</div>
                                <div className="text-muted">{datosTiempo.current.condition.text}</div>
                                <div className="small text-muted">Últ. actualización: {datosTiempo.current.last_updated}</div>
                            </div>
                        </div>
                    )}

                    <div className="tiempo-search d-flex gap-2 mt-3">
                        <input
                            className="form-control form-control-sm"
                            style={{ maxWidth: 220 }}
                            type="text"
                            value={termino}
                            onChange={(e) => setTermino(e.target.value)}
                            onKeyDown={controladorInput}
                            placeholder="Ciudad (ej. La Ceiba)"
                        />
                        <button className="btn btn-sm btn-primary" onClick={onBuscarClick}>Buscar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
