import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DepartamentosTable from '../Components/DepartamentosTable';

export default function Departamentos() {
  return (
    <div>
      <h1>Departamentos</h1>
      <Button as={Link} to="/departamentos/nuevo" variant="success" className="mb-3">
        Agregar Nuevo
      </Button>

       <DepartamentosTable />

    </div>

    
  );
}
