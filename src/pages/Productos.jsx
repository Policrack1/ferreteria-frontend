import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useCart } from '../context/CartContext';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/products');
        setProductos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <div className="main-container"><p>Cargando productos...</p></div>;

  return (
    <div className="main-container">
      <h2 className="page-title">Productos de Ferretería</h2>
      {productos.length === 0 && <p>No hay productos registrados.</p>}

      <div className="products-grid">
        {productos.map((p) => (
          <div className="product-card">
            <div>
              {p.imagen_url ? (
                <img
                  src={p.imagen_url}
                  alt={p.nombre}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '150px',
                    background: '#1e293b',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8'
                  }}
                >
                  Sin imagen
                </div>
              )}

              <h4>{p.nombre}</h4>
              <p>{p.descripcion}</p>
              <p className="product-card-price">
                S/ {Number(p.precio).toFixed(2)}
              </p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Stock: {p.stock}
              </p>
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: '0.8rem' }}
              onClick={() => agregarAlCarrito(p)}
            >
              Agregar al carrito
            </button>
          </div>

        ))}
      </div>
    </div>
  );
}
