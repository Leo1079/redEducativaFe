import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaTimes, FaBuilding, FaMapSigns } from "react-icons/fa";
import clientAxios from "../helpers/axios.helpers";
import COLORS from "../pages/ColoresHome";

const initialFormData = {
  nombre: "",
  es_comuna: false,
  id_departamento: "",
};

export default function ModalFormLocalidades({
  show,
  handleClose,
  onSave,
  onUpdate,
  localidadToEdit, // Ahora se llama 'localidadToEdit'
  departamentosData, // Recibe la lista de departamentos como prop
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Efecto para cargar datos en modo edición ---
  useEffect(() => {
    if (localidadToEdit) {
      setFormData({
        nombre: localidadToEdit.nombre || "",
        es_comuna: !!localidadToEdit.es_comuna,
        id_departamento: localidadToEdit.id_departamento || "",
      });
    } else {
      setFormData(initialFormData);
    }
    console.log(formData);
    setError(null);
  }, [localidadToEdit, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejo especial para el checkbox 'es_comuna'
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // ⚠️ Validación
    if (!formData.nombre || !formData.id_departamento) {
      setError("El nombre de la Localidad y el Departamento son obligatorios.");
      setIsSaving(false);
      return;
    }

    const isEditing = !!localidadToEdit;
    const url = isEditing
      ? `/localidades/${localidadToEdit.id_localidad}` // ⬅️ Endpoint PUT
      : "/localidades"; // ⬅️ Endpoint POST
    const method = isEditing ? clientAxios.put : clientAxios.post;

    try {
      const dataToSend = {
        ...formData,
        // Convertimos el id_departamento a entero para la API
        id_departamento: parseInt(formData.id_departamento),
        // Si la API requiere 1/0 en lugar de true/false, puedes cambiarlo aquí:
        // es_comuna: formData.es_comuna ? 1 : 0,
      };

      await method(url, dataToSend);

      if (isEditing) {
        onUpdate();
        alert("Localidad actualizada con éxito.");
      } else {
        onSave();
        alert("Localidad creada con éxito.");
      }

      handleClose();
    } catch (err) {
      console.error("Error al guardar la localidad:", err);
      setError(
        "Error al guardar. Verifica la conexión y que los datos sean correctos."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const modalTitle = localidadToEdit
    ? "Editar Localidad"
    : "Crear Nueva Localidad";

  // Verificamos si la lista de departamentos está disponible
  const isLoadingDepartamentos =
    !departamentosData || departamentosData.length === 0;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        closeButton
        style={{ borderBottom: `2px solid ${COLORS.textHeader}` }}
      >
        <Modal.Title className="fw-bold" style={{ color: COLORS.textHeader }}>
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            {/* 1. Campo Nombre de la Localidad */}
            <Col md={12} className="mb-3">
              <Form.Group controlId="formNombre">
                <Form.Label className="fw-semibold">
                  <FaBuilding className="me-1" /> Nombre de la Localidad
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group controlId="formEsComuna">
                <Form.Check
                  type="checkbox"
                  label="¿Es Comuna?"
                  name="es_comuna"
                  checked={formData.es_comuna}
                  onChange={handleChange}
                  className="fw-semibold"
                  style={{ color: COLORS.textPrimary }}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Group controlId="formDepartamento">
                <Form.Label className="fw-semibold">
                  <FaMapSigns className="me-1" /> Departamento
                </Form.Label>
                <Form.Select
                  name="id_departamento"
                  value={formData.id_departamento}
                  onChange={handleChange}
                  required
                  disabled={isLoadingDepartamentos || isSaving}
                >
                  <option value="">
                    {isLoadingDepartamentos
                      ? "Cargando Departamentos..."
                      : "Seleccione un Departamento"}
                  </option>
                  {departamentosData.map((departamento) => (
                    <option
                      key={departamento.id_departamento}
                      value={departamento.id_departamento}
                    >
                      {departamento.id_departamento} -{" "}
                      {departamento.nombre || "Departamento sin nombre"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            <FaTimes className="me-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
            }}
            className="fw-bold"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Guardando...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                {localidadToEdit ? "Guardar Cambios" : "Crear Localidad"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
