import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// Asumo que tu helper clientAxios ya está configurado para hacer llamadas
import clientAxios from "../helpers/axios.helpers";

export default function ModalFormCircuits({ show, handleClose, onDataSaved }) {
  // 1. Estados para los datos y el control de carga
  const [circuito, setCircuito] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false); // Estado de carga para el botón

  // Función para manejar el cambio en cualquier campo
  const handleChange = (e) => {
    // Uso del spread operator para mantener las otras propiedades del objeto 'circuito'
    setCircuito({
      ...circuito,
      [e.target.id === "formNombre" ? "nombre" : "descripcion"]: e.target.value,
    });
  };

  // 2. Función Asíncrona para manejar el POST con Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el estado de carga

    try {
      // Reemplaza '/api/circuitos' con tu endpoint real
      const response = await clientAxios.post("/circuitos", circuito);

      console.log("Circuito Creado:", response.data);

      if (onDataSaved) {
        onDataSaved(response.data);
      }

      setCircuito({ nombre: "", descripcion: "" });
      handleClose();
    } catch (error) {
      console.error("Error al crear el circuito:", error);
      alert("Error al guardar el circuito. Revisa la consola.");
    } finally {
      setLoading(false); // Desactiva el estado de carga, independientemente del resultado
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-dark"
    >
      <Modal.Header closeButton className="bg-secondary text-light border-0">
        <Modal.Title>Crear Nuevo Circuito</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-secondary text-light">
        <Form onSubmit={handleSubmit}>
          {/* Campo: Nombre del Circuito */}
          <Form.Group as={Row} className="mb-3" controlId="formNombre">
            <Form.Label column sm="3">
              Nombre
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                placeholder="Ej: Circuito Zona Norte"
                value={circuito.nombre}
                // Corregido: Llamada a handleChange
                onChange={handleChange}
                required
                className="bg-dark text-light border-secondary"
              />
            </Col>
          </Form.Group>

          {/* Campo: Descripción del Circuito */}
          <Form.Group as={Row} className="mb-3" controlId="formDescripcion">
            <Form.Label column sm="3">
              Descripción
            </Form.Label>
            <Col sm="9">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detalles geográficos o administrativos del circuito."
                value={circuito.descripcion}
                // Corregido: Llamada a handleChange
                onChange={handleChange}
                className="bg-dark text-light border-secondary"
              />
            </Col>
          </Form.Group>

          {/* Pie del formulario (Botón de Enviar) */}
          <div className="d-flex justify-content-end pt-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="me-2"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              // Deshabilitado mientras carga y el type="submit" llama a handleSubmit
              disabled={loading}
            >
              {/* Muestra un texto diferente mientras se carga */}
              {loading ? "Guardando..." : "Guardar Circuito"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
