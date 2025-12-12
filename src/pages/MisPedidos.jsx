// src/pages/MisPedidos.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function MisPedidos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    const cargar = async () => {
      try {
        setCargando(true);
        const { data } = await api.get('/orders/mis-pedidos');
        setPedidos(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar tus pedidos');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [usuario, navigate]);

  return (
    <div className="main-container">
      <h2 className="page-title">Mis pedidos</h2>

      {error && <p className="text-error">{error}</p>}

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="form-card">
          <p>No tienes pedidos registrados.</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#9ca3af' }}>
            Cuando compres productos desde el carrito, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.estado}</td>
                  <td>S/ {Number(p.total).toFixed(2)}</td>
                  <td>
                    {p.items && p.items.length > 0 ? (
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem' }}>
                        {p.items.map((it, idx) => (
                          <li key={idx}>
                            {it.nombre} x{it.cantidad} (S/ {Number(it.precio_unitario).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        Sin detalle
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
