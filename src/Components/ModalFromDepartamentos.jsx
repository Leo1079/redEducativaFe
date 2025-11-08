import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaTimes, FaMapSigns } from "react-icons/fa";
import clientAxios from "../helpers/axios.helpers";
import COLORS from "../pages/ColoresHome";

const initialFormData = {
  nombre: "",
  id_circuito: "",
};

export default function ModalFormDepartamentos({
  show,
  handleClose,
  onSave,
  onUpdate,
  departamentoToEdit,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [circuitos, setCircuitos] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCircuitos, setIsLoadingCircuitos] = useState(true);

  // --- FUNCIÓN PARA CARGAR CIRCUITOS (MANTENIDA IGUAL) ---
  const fetchCircuitos = async () => {
    try {
      const res = await clientAxios.get("/circuitos");
      setCircuitos(res.data || []);
    } catch (err) {
      console.error("Error al obtener circuitos:", err);
    } finally {
      setIsLoadingCircuitos(false);
    }
  };

  useEffect(() => {
    fetchCircuitos();
  }, []);

  useEffect(() => {
    if (departamentoToEdit) {
      setFormData({
        nombre: departamentoToEdit.nombre || "",
        id_circuito: departamentoToEdit.id_circuito || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [departamentoToEdit, show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // ⚠️ Validación
    if (!formData.nombre || !formData.id_circuito) {
      setError("El nombre del departamento y el Circuito son obligatorios.");
      setIsSaving(false);
      return;
    }

    const isEditing = !!departamentoToEdit;
    const url = isEditing
      ? `/departamentos/${departamentoToEdit.id_departamento}`
      : "/departamentos";
    const method = isEditing ? clientAxios.put : clientAxios.post;

    try {
      const dataToSend = {
        ...formData,
        id_circuito: parseInt(formData.id_circuito),
      };

      await method(url, dataToSend);

      if (isEditing) {
        onUpdate();
        alert("Departamento actualizado con éxito.");
      } else {
        onSave();
        alert("Departamento creado con éxito.");
      }

      handleClose();
    } catch (err) {
      console.error("Error al guardar el departamento:", err);
      setError(
        "Error al guardar. Verifica la conexión y que los datos sean correctos."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const modalTitle = departamentoToEdit
    ? "Editar Departamento"
    : "Crear Nuevo Departamento";

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
            <Col md={12} className="mb-3">
              <Form.Group controlId="formNombre">
                <Form.Label className="fw-semibold">
                  Nombre del Departamento
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
              <Form.Group controlId="formCircuito">
                <Form.Label className="fw-semibold">
                  <FaMapSigns className="me-1" /> Circuito
                </Form.Label>
                <Form.Select
                  name="id_circuito"
                  value={formData.id_circuito}
                  onChange={handleChange}
                  required
                  disabled={isLoadingCircuitos}
                >
                  <option value="">
                    {isLoadingCircuitos
                      ? "Cargando Circuitos..."
                      : "Seleccione un Circuito"}
                  </option>
                  {circuitos.map((circuito) => (
                    <option
                      key={circuito.id_circuito}
                      value={circuito.id_circuito}
                    >
                      {circuito.id_circuito} -{" "}
                      {circuito.nombre_circuito ||
                        circuito.nombre ||
                        "Circuito sin nombre"}
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
                {departamentoToEdit ? "Guardar Cambios" : "Crear Departamento"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
