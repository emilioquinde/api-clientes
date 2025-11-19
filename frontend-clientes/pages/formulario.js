import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Formulario() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = router.query; // Si hay ID, es edición

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    ciudad: '',
    monto_compras: 0
  });

  useEffect(() => {
    if (id) {
      // Cargar datos si es edición
      axios.get(`${API_URL}/clientes/${id}`)
        .then(res => setForm(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación HTML5 automática se activará con los atributos 'required'
    try {
      if (id) {
          await axios.put(`${API_URL}/clientes/${id}`, form);
        } else {
          await axios.post(`${API_URL}/clientes`, form);
        }
      router.push('/'); // Volver al inicio
    } catch (error) {
      alert('Error al guardar');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>Nombre:</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Correo:</label>
        <input type="email" name="correo" value={form.correo} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />

        <label>Ciudad:</label>
        <input name="ciudad" value={form.ciudad} onChange={handleChange} required />
        
        <label>Monto Compras ($):</label>
        <input type="number" step="0.01" name="monto_compras" value={form.monto_compras} onChange={handleChange} />

        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Guardar
        </button>
        <Link href="/">Cancelar</Link>
      </form>
    </div>
  );
}