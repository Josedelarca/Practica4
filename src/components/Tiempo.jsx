import { useState, useEffect } from "react";

export function Tiempo() {

    const [datosTiempo, setDatosTiempo] = useState(null);
    const [buscar, setBuscar] = useState("La ceiba");

    const controladorInput = (e) => {
        if (e.key === 'Enter') {
            setBuscar(e.target.value);
        }

    }



    useEffect(() => {
        const mifuncionTiempo = async () => {
            try {
                const respuesta = await fetch(`https://api.weatherapi.com/v1/current.json?key=b1cdd0e1ad6c4446af1232644252210&q=${buscar}&aqi=no`);
                const datosJson = await respuesta.json();
                setDatosTiempo(datosJson);
                console.log(datosJson);
            } catch (err) {
                console.error('Error', err.message || err);
            }
        }
        mifuncionTiempo();
    }, [buscar]);

    return (
        <div>
            <div className="card" style={{ width: "18rem" }}>
                {/* mostrar datos si están disponibles */}
                <div className="card-body">
                    <h5 className="card-title">{datosTiempo?.location?.name ?? 'Cargando ubicación...'}</h5>
                    {datosTiempo ? (
                        <>
                            <p className="card-text">Temperatura: {datosTiempo.current.temp_c} °C</p>
                            <p className="card-text">Condición: {datosTiempo.current.condition.text}</p>
                            <img src={datosTiempo.current.condition.icon} alt={datosTiempo.current.condition.text} />
                        </> 
                    ) : (
                        <p className="card-text">Cargando datos del tiempo...</p>
                    )}
                    {/* <button className="btn btn-primary">Actualizar</button> */}
                </div>
                <input 
                style={{width: "200px", margin: "5px", textAlign: "center"}} 
                type="text"  
                className="card-text mx-auto my-2"
                onKeyDown={(e) => controladorInput(e)}
                />
            </div>
            <div>
            </div>
        </div>
    );
}
