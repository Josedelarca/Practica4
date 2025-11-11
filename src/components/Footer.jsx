import React from 'react';

export default function Footer(){
  return (
    <footer className="footer fixed-bottom bg-dark text-white d-flex align-items-center">
      <div className="container d-flex justify-content-between py-2">
        <div>
          <small>© {new Date().getFullYear()} - Practica4</small>
        </div>
        <div>
            <small>Desarrollado por Juan Delarca</small>
        </div>
      </div>
    </footer>
  );
}
