import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Supervisores() {
  return (
    <div>
      <h1>Departamentos</h1>
      <Button as={Link} to="/Supervisores/nuevo" variant="success">
        Agregar Nueva
      </Button>
    </div>
  );
}