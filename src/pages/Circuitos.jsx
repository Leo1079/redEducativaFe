import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CircuitTable from "../Components/CircuitsTable";
import { Link } from "react-router-dom";
import ModalFormCircuits from "../Components/ModalFormCircuits";

export default function Circuitos() {
  const [count, setCount] = useState(0);

  // Estado para controlar si el Modal está visible o no
  const [showModal, setShowModal] = useState(false);

  // Handlers para abrir y cerrar el Modal
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container fluid className="d-flex flex-column py-5 vh-100">
      <h1 className="text-center fw-bold mb-4">Circuitos 🗺️</h1>

      <div className="mb-4 d-flex justify-content-center align-items-center">
        <Button as={Link} variant="primary" onClick={handleShow}>
          Agregar Nuevo
        </Button>
      </div>
      <CircuitTable />

      <ModalFormCircuits
        show={showModal} 
        handleClose={handleClose} 
      />
    </Container>
  );
}
