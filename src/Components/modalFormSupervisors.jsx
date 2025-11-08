// ModalFormSupervisores.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import clientAxios from "../helpers/axios.helpers";

// Definimos el estado inicial para un supervisor vacío
const INITIAL_STATE = {
  apeyNombre: "",
  gmail: "",
  telefono: "",
  sede: "",
};

// Props: show, handleClose, onSave, supervisorToEdit (NUEVO), onUpdate (NUEVO)
export default function ModalFormSupervisores({
  show,
  handleClose,
  onSave,
  supervisorToEdit,
  onUpdate,
}) {
  // 1. Determina si es modo edición
  const isEditing = !!supervisorToEdit;

  const [supervisor, setSupervisor] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Efecto para cargar datos del supervisor a editar
  useEffect(() => {
    if (show) {
      setError(null); // Limpiar errores al abrir
      if (isEditing) {
        // Cargar los datos existentes para edición
        setSupervisor({
          apeyNombre: supervisorToEdit.apeyNombre || "",
          gmail: supervisorToEdit.gmail || "",
          telefono: supervisorToEdit.telefono || "",
          sede: supervisorToEdit.sede || "",
        });
      } else {
        // Reiniciar el formulario para creación
        setSupervisor(INITIAL_STATE);
      }
    }
  }, [show, isEditing, supervisorToEdit]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Mapeo simple de IDs de control a claves de estado
    let key = id.replace("form", ""); // Quita 'form' (ej: formApeyNombre -> ApeyNombre)
    key = key.charAt(0).toLowerCase() + key.slice(1); // Convierte la primera letra a minúscula (ej: ApeyNombre -> apeyNombre)

    setSupervisor({
      ...supervisor,
      [key]: value,
    });
  };

  // 3. Maneja la creación o edición
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (isEditing) {
        // MODO EDICIÓN (PUT/PATCH): Incluye el ID en la URL
        const url = `/supervisores/${supervisorToEdit.id_supervisor}`;
        response = await clientAxios.put(url, supervisor); // Usar supervisorToEdit.id_supervisor si la API lo requiere en el body

        // NOTIFICACIÓN: Llama al handler del padre para recargar la lista
        if (onUpdate) onUpdate();
      } else {
        // MODO CREACIÓN (POST)
        response = await clientAxios.post("/supervisores", supervisor);

        // NOTIFICACIÓN: Llama al handler del padre para recargar la lista
        if (onSave) onSave();
      }

      console.log(
        `${isEditing ? "Supervisor Actualizado" : "Supervisor Creado"}:`,
        response.data
      );

      handleClose(); // Cierra el modal
    } catch (err) {
      console.error(
        `Error al ${isEditing ? "editar" : "crear"} el supervisor:`,
        err
      );
      setError(
        err.response?.data?.message ||
          `Error de conexión o servidor al intentar ${
            isEditing ? "actualizar" : "guardar"
          }.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        {/* Título Dinámico */}
        <Modal.Title>
          {isEditing
            ? `✏️ Editar Supervisor: ${supervisorToEdit?.apeyNombre}`
            : "➕ Agregar Supervisor"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Campo Apellido y Nombre */}
          <Form.Group className="mb-3" controlId="formApeyNombre">
            <Form.Label>Apellido y Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Pérez, Juan"
              value={supervisor.apeyNombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Campo Email */}
          <Form.Group className="mb-3" controlId="formGmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@ejemplo.com"
              value={supervisor.gmail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            {/* Campo Teléfono */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 3815xxxxxx"
                  value={supervisor.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Campo Sede */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Sede Capital"
                  value={supervisor.sede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

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
              disabled={loading || !supervisor.apeyNombre.trim()}
            >
              {/* Texto del botón dinámico */}
              {loading
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Guardar Supervisor"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
