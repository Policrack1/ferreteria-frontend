// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 usamos el login del contexto

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      // 1️⃣ Registrar usuario
      await api.post('/auth/register', { nombre, email, password });

      // 2️⃣ Mostrar mensaje rápido (opcional)
      setMensaje('Registro exitoso. Iniciando sesión...');

      // 3️⃣ Iniciar sesión automáticamente
      await login(email, password);

      // 4️⃣ Enviar a la pantalla principal
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al registrarse');
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: 420 }}>
      <h2 className="page-title">Registrarse</h2>

      <div className="form-card">
        {mensaje && <p className="text-success">{mensaje}</p>}
        {error && <p className="text-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Registrarse
          </button>
        </form>

        <p style={{ marginTop: '0.8rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="link-muted">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
