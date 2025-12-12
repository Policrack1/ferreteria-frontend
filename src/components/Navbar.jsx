// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="navbar">
      {/* IZQUIERDA - LOGO */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={cerrarMenu}>
          Ferretería
        </Link>

        {/* Links desktop */}
        <div className="navbar-links-desktop">
          {usuario?.rol === 'admin' && (
            <Link to="/admin/productos" className="navbar-link">
              Admin Productos
            </Link>
          )}

          <Link to="/carrito" className="navbar-link">
            Carrito ({totalItems})
          </Link>

          {usuario && (
            <Link to="/mis-pedidos" className="navbar-link">
              Mis pedidos
            </Link>
          )}
        </div>
      </div>

      {/* DERECHA - USUARIO + BOTONES + HAMBURGUESA */}
      <div className="navbar-right">
        {/* Vista desktop */}
        <div className="navbar-user-desktop">
          {usuario ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#cbd5f5' }}>
                {usuario.nombre} ({usuario.rol})
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Ingresar
              </Link>
              <Link to="/register" className="navbar-link">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo móvil) */}
        <button
          className={`navbar-toggle ${menuAbierto ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MENÚ MOBILE */}
      <div className={`navbar-menu-mobile ${menuAbierto ? 'show' : ''}`}>
        <div className="navbar-menu-mobile-links">
          {usuario?.rol === 'admin' && (
            <Link
              to="/admin/productos"
              className="navbar-link"
              onClick={cerrarMenu}
            >
              Admin Productos
            </Link>
          )}

          <Link
            to="/carrito"
            className="navbar-link"
            onClick={cerrarMenu}
          >
            Carrito ({totalItems})
          </Link>

          {usuario && (
            <Link
              to="/mis-pedidos"
              className="navbar-link"
              onClick={cerrarMenu}
            >
              Mis pedidos
            </Link>
          )}

          <hr style={{ borderColor: '#1f2937', width: '100%' }} />

          {usuario ? (
            <>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#cbd5f5',
                  marginBottom: '0.5rem',
                }}
              >
                {usuario.nombre} ({usuario.rol})
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-link"
                onClick={cerrarMenu}
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="navbar-link"
                onClick={cerrarMenu}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

