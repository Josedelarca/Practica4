export function Tarjeta({usuario}){
    return(
        <div className="card" style={{width:"360px"}} >
            <img src={`https://i.pravatar.cc/150?img=${usuario.id}`} className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{usuario.name}</h5>
                <p className="card-text">{usuario.email}</p>
                <p className="card-text">{usuario.address.city}</p>                
            </div>
        </div>
    )
}