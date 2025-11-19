import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Detalle() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = router.query;
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/clientes/${id}`)
        .then(res => setCliente(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Detalle del Cliente: {cliente.nombre}</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <p><strong>ID:</strong> {cliente.id}</p>
        <p><strong>Correo:</strong> {cliente.correo}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
        <p><strong>Total Compras:</strong> ${cliente.monto_compras}</p>
      </div>
      <br />
      <Link href="/">Volver a la lista</Link>
    </div>
  );
}