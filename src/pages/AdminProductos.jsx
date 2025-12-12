// src/pages/AdminProductos.jsx
import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para formulario de nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
  });

  // Estado para edición
  const [editandoId, setEditandoId] = useState(null);
  const [productoEditado, setProductoEditado] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/products');
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Manejar cambios del formulario de nuevo producto
  const handleChangeNuevo = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear producto
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
        setError('Nombre, precio y stock son obligatorios');
        return;
      }

      await api.post('/products', {
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        imagen_url: nuevoProducto.imagen_url,
      });

      setMensaje('Producto creado correctamente');
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen_url: '',
      });

      cargarProductos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al crear producto');
    }
  };

  // Empezar a editar un producto
  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setProductoEditado({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url || '',
    });
    setMensaje('');
    setError('');
  };

  // Manejar cambios en el formulario de edición
  const handleChangeEditado = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios de producto editado
  const guardarEdicion = async (id) => {
    setError('');
    setMensaje('');

    try {
      await api.put(`/products/${id}`, {
        nombre: productoEditado.nombre,
        descripcion: productoEditado.descripcion,
        precio: Number(productoEditado.precio),
        stock: Number(productoEditado.stock),
        imagen_url: productoEditado.imagen_url,
      });

      setMensaje('Producto actualizado correctamente');
      setEditandoId(null);
      cargarProductos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al actualizar producto');
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setProductoEditado({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen_url: '',
    });
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este producto?');
    if (!confirmar) return;

    setError('');
    setMensaje('');

    try {
      await api.delete(`/products/${id}`);
      setMensaje('Producto eliminado correctamente');
      cargarProductos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al eliminar producto');
    }
  };

  return (
    <div className="main-container">
      <h2 className="page-title">Panel Admin - Productos</h2>

      {mensaje && <p className="text-success">{mensaje}</p>}
      {error && <p className="text-error">{error}</p>}

      {/* FORMULARIO PARA CREAR NUEVO PRODUCTO */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Crear nuevo producto</h3>

        <div className="form-card">
          <form onSubmit={handleCrear}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleChangeNuevo}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleChangeNuevo}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={nuevoProducto.precio}
                  onChange={handleChangeNuevo}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={nuevoProducto.stock}
                  onChange={handleChangeNuevo}
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de imagen (opcional)</label>
              <input
                type="text"
                name="imagen_url"
                value={nuevoProducto.imagen_url}
                onChange={handleChangeNuevo}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Guardar producto
            </button>
          </form>
        </div>
      </section>

      {/* TABLA DE PRODUCTOS */}
      <section>
        <h3 style={{ marginBottom: '0.5rem' }}>Lista de productos</h3>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  {/* 👇 AQUÍ AGREGAMOS LA COLUMNA DE IMAGEN */}
                  <th>Imagen</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>

                    {/* Nombre (editable) */}
                    <td>
                      {editandoId === p.id ? (
                        <input
                          type="text"
                          name="nombre"
                          value={productoEditado.nombre}
                          onChange={handleChangeEditado}
                        />
                      ) : (
                        p.nombre
                      )}
                    </td>

                    {/* 👇 NUEVA CELDA: IMAGEN */}
                    <td>
                      {p.imagen_url ? (
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Sin imagen
                        </span>
                      )}
                    </td>

                    {/* Precio (editable) */}
                    <td>
                      {editandoId === p.id ? (
                        <input
                          type="number"
                          step="0.01"
                          name="precio"
                          value={productoEditado.precio}
                          onChange={handleChangeEditado}
                        />
                      ) : (
                        `S/ ${Number(p.precio).toFixed(2)}`
                      )}
                    </td>

                    {/* Stock (editable) */}
                    <td>
                      {editandoId === p.id ? (
                        <input
                          type="number"
                          name="stock"
                          value={productoEditado.stock}
                          onChange={handleChangeEditado}
                        />
                      ) : (
                        p.stock
                      )}
                    </td>

                    <td>
                      {editandoId === p.id ? (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => guardarEdicion(p.id)}
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={cancelarEdicion}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-secondary"
                            onClick={() => iniciarEdicion(p)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => eliminarProducto(p.id)}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );

}
