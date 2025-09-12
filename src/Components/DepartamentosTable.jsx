import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import clientAxios from '../helpers/axios.helpers';

export default function DepartamentosTable() {
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await clientAxios.get('/departamentos');
        setDepartamentos(res.data);
      } catch (error) {
        console.error('Error al cargar departamentos:', error);
      }
    };

    fetchDepartamentos();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Ubicación</th>
        </tr>
      </thead>
      <tbody>
        {departamentos.map((dpto, index) => (
          <tr key={dpto.id || index}>
            <td>{index + 1}</td>
            <td>{dpto.nombre}</td>
            <td>{dpto.ubicacion}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
