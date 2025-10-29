import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import { Usuarios } from './components/pages/ListaUsuarios.jsx';
import { Productos } from './components/pages/Productos.jsx';
import Inicio from './components/pages/inicio.jsx';
import { Tiempo } from './components/Tiempo.jsx';

function App() {

  return (
    <>
  <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Seminario de React</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clientes">Clientes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tiempo">Tiempo</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>

        <Route path='/' element={<Inicio/>}></Route>
        <Route path='/clientes' element={<Usuarios/>} />
        <Route path='/productos' element={<Productos/>}></Route>
  <Route path='/tiempo' element={<Tiempo/>}></Route>

      </Routes>

    </>
  )
}

export default App