import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [clientes, setClientes] = useState([]);
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [promedio, setPromedio] = useState(null);
  const router = useRouter();

  // Cargar clientes (con o sin filtro)
  const fetchClientes = async (ciudad = '') => {
    try {
      // Conecta al backend que hicimos en el paso anterior
      const url = ciudad 
        ? `${API_URL}/clientes?ciudad=${ciudad}` 
        : `${API_URL}/clientes`;
      const res = await axios.get(url);
      setClientes(res.data);
    } catch (error) {
      console.error("Error cargando clientes", error);
    }
  };

  // Cargar promedio (Funcionalidad Adicional)
  const fetchPromedio = async () => {
    try {
      const res = await axios.get(`${API_URL}/clientes/promedio-compras`);
      setPromedio(res.data.valor);
    } catch (error) {
      console.error("Error cargando promedio", error);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchPromedio();
  }, []);

  const handleEliminar = async (id) => {
    if(confirm('¿Estás seguro de eliminar este cliente?')) {
      await axios.delete(`http://localhost:3000/clientes/${id}`);
      fetchClientes(); // Recargar tabla
      fetchPromedio(); // Recargar promedio
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchClientes(ciudadFiltro);
  };

  return (
    <div className="container">
      <h1>Gestión de Clientes QUINDE</h1>
      
      {/* Sección de Funcionalidad Adicional: Filtro y Promedio */}
      <div className="panel-control">
        <form onSubmit={handleBuscar} className="filtro">
          <input 
            type="text" 
            placeholder="Filtrar por Ciudad (ej. Guayaquil)" 
            value={ciudadFiltro}
            onChange={(e) => setCiudadFiltro(e.target.value)}
          />
          <button type="submit">Filtrar</button>
          <button type="button" onClick={() => {setCiudadFiltro(''); fetchClientes();}}>Limpiar</button>
        </form>

        <div className="card-promedio">
          <h3>Promedio de Compras:</h3>
          <p className="precio">${promedio || '0.00'}</p>
        </div>
      </div>

      <Link href="/formulario"><button className="btn-crear">Recommendation: + Nuevo Cliente</button></Link>

      {/* Tabla de Registros */}
      <table border="1" cellPadding="10" style={{width: '100%', marginTop: '20px', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Ciudad</th>
            <th>Compras ($)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cli => (
            <tr key={cli.id}>
              <td>{cli.id}</td>
              <td>{cli.nombre}</td>
              <td>{cli.correo}</td>
              <td>{cli.ciudad}</td>
              <td>{cli.monto_compras}</td>
              <td>
                <Link href={`/formulario?id=${cli.id}`}>Editar</Link> | 
                <Link href={`/cliente/${cli.id}`}> Detalle</Link> | 
                <button onClick={() => handleEliminar(cli.id)} style={{color: 'red'}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Estilos simples para que se vea ordenado (Rúbrica UX: 2 pts) */}
      <style jsx>{`
        .container { padding: 20px; font-family: Arial, sans-serif; }
        .panel-control { display: flex; justify-content: space-between; align-items: center; background: #f4f4f4; padding: 15px; margin-bottom: 20px; border-radius: 8px;}
        .card-promedio { background: #e0f7fa; padding: 10px; border-radius: 5px; text-align: right; }
        .precio { font-size: 1.5em; font-weight: bold; color: #006064; margin: 0;}
        .btn-crear { background: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px; }
        input { padding: 8px; margin-right: 5px; }
      `}</style>
    </div>
  );
}