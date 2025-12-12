// src/pages/Carrito.jsx
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';

export default function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalItems,
    totalPagar,
  } = useCart();

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleCantidadChange = (id, valor) => {
    const num = Number(valor);
    if (Number.isNaN(num)) return;
    cambiarCantidad(id, num);
  };

  const handleCheckout = async () => {
    if (!usuario) {
      alert('Debes iniciar sesión para realizar la compra.');
      navigate('/login');
      return;
    }

    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    try {
      const items = carrito.map((item) => ({
        productId: item.id,
        cantidad: item.cantidad,
      }));

      const { data } = await api.post('/orders', { items });

      alert(
        `Pedido creado correctamente. ID: ${data.orderId}, Total: S/ ${data.total.toFixed(
          2
        )}`
      );

      vaciarCarrito();
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || 'Error al crear el pedido';
      alert(msg);
    }
  };

  // Vista cuando está vacío
  if (carrito.length === 0) {
    return (
      <div className="main-container">
        <h2 className="page-title">Carrito de compras</h2>
        <div className="form-card">
          <p style={{ marginBottom: '0.8rem' }}>Tu carrito está vacío.</p>
          <Link to="/" className="link-muted">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h2 className="page-title">Carrito de compras</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>S/ {item.precio.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(item.id, e.target.value)
                    }
                    style={{ width: '70px' }}
                  />
                </td>
                <td>S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <p>
          <b>Total de items:</b> {totalItems}
        </p>
        <p style={{ marginTop: '0.2rem' }}>
          <b>Total a pagar:</b> S/ {totalPagar.toFixed(2)}
        </p>

        <div style={{ marginTop: '0.8rem' }}>
          <button
            className="btn btn-secondary"
            onClick={vaciarCarrito}
            style={{ marginRight: '0.5rem' }}
          >
            Vaciar carrito
          </button>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
