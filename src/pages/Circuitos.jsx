import React, { useState } from 'react';
import {Button} from "react-bootstrap"
import CircuitTable from '../Components/CircuitsTable';
import { Link } from 'react-router-dom';

export default function Circuitos() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Circuitos</h1>

   <Button as={Link} to="/circuitos/nuevo" variant="success">
    Agregar Nuevo
  </Button>

      
      <CircuitTable/>
    </>
  )
}