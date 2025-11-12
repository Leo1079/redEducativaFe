import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import {
  FaSave,
  FaBookOpen,
  FaTags,
  FaLayerGroup,
  FaClock,
} from "react-icons/fa";
import clientAxios from "../helpers/axios.helpers";

// --- Opciones Estáticas ---
const MODALIDADES = [
  "Presencial",
  "Virtual Sincrónico",
  "Virtual Asincrónico",
  "Híbrido",
];

// Definimos el estado inicial para una Oferta Formativa vacía
const INITIAL_STATE = {
  titulo: "",
  descripcion: "",
  duracion: "", // Dejamos como string para el input
  cantModulos: "", // Dejamos como string para el input
  porchsparticos: "", // Dejamos como string para el input (asumo porcentaje)
  requisitos: "",
  id_tipo_oferta: "", // FK, debe ser string para el Select
  modalidad: "",
};

/**
 * Modal para crear o editar una Oferta Formativa.
 * @param {object} tiposOfertaData - Lista de tipos de oferta para el Select.
 */
export default function ModalFormOfertas({
  show,
  handleClose,
  onSave,
  ofertaToEdit,
  onUpdate,
  tiposOfertaData, // ⬅️ Lista de Tipos de Oferta para el Select
}) {
  // 1. Determina si es modo edición
  const isEditing = !!ofertaToEdit;

  const [oferta, setOferta] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Efecto para cargar datos de la oferta a editar
  useEffect(() => {
    if (show) {
      setError(null);
      if (isEditing) {
        // Cargar los datos existentes para edición
        setOferta({
          titulo: ofertaToEdit.titulo || "",
          descripcion: ofertaToEdit.descripcion || "",
          // Convertir números a string para el input value
          duracion: String(ofertaToEdit.duracion || ""),
          cantModulos: String(ofertaToEdit.cantModulos || ""),
          porchsparticos: String(ofertaToEdit.porchsparticos || ""),
          requisitos: ofertaToEdit.requisitos || "",
          // Convertir ID a string para el <Form.Select>
          id_tipo_oferta: String(ofertaToEdit.id_tipo_oferta || ""),
          modalidad: ofertaToEdit.modalidad || "",
        });
      } else {
        // Reiniciar el formulario para creación
        setOferta(INITIAL_STATE);
      }
    }
  }, [show, isEditing, ofertaToEdit]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);

    setOferta({
      ...oferta,
      [name]: value,
    });
  };

  // 3. Maneja la creación o edición
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación
    if (!oferta.titulo || !oferta.id_tipo_oferta || !oferta.duracion) {
      setError("El Título, Duración y Tipo de Oferta son obligatorios.");
      setLoading(false);
      return;
    }

    // Convertimos los campos numéricos (que vienen como string de los inputs) a number
    const dataToSend = {
      ...oferta,
      duracion: parseInt(oferta.duracion) || 0,
      cantModulos: parseInt(oferta.cantModulos) || 0,
      porchsparticos: parseInt(oferta.porchsparticos) || 0,
      id_tipo_oferta: parseInt(oferta.id_tipo_oferta),
    };

    try {
      let response;
      const endpoint = "/ofertas";
      const url = isEditing
        ? `${endpoint}/${ofertaToEdit.id_oferta}`
        : endpoint;

      response = isEditing
        ? await clientAxios.put(url, dataToSend)
        : await clientAxios.post(url, dataToSend);

      if (isEditing) {
        if (onUpdate) onUpdate(response.data);
      } else {
        if (onSave) onSave(response.data);
      }

      alert(
        `${oferta.titulo} ${isEditing ? "actualizada" : "creada"} con éxito.`
      );
      handleClose();
    } catch (err) {
      console.error(
        `Error al ${isEditing ? "editar" : "crear"} la oferta:`,
        err.response?.data || err
      );
      setError(
        err.response?.data?.message ||
          `Error de conexión o servidor al intentar ${
            isEditing ? "actualizar" : "guardar"
          } la oferta.`
      );
    } finally {
      setLoading(false);
    }
  };

  const isTiposOfertaLoading = !tiposOfertaData || tiposOfertaData.length === 0;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg" // Modal más grande para tantos campos
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBookOpen className="me-2" />
          {isEditing
            ? `✏️ Editar Oferta: ${ofertaToEdit?.titulo}`
            : "➕ Agregar Nueva Oferta Formativa"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Fila 1: Título y Tipo de Oferta */}
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="formTitulo">
                <Form.Label className="fw-semibold">Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  placeholder="Ej: Taller de Introducción a Python"
                  value={oferta.titulo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formIdTipoOferta">
                <Form.Label className="fw-semibold">
                  <FaTags className="me-1" /> Tipo de Oferta
                </Form.Label>
                <Form.Select
                  name="id_tipo_oferta"
                  value={oferta.id_tipo_oferta}
                  onChange={handleChange}
                  required
                  disabled={loading || isTiposOfertaLoading}
                >
                  <option value="">
                    {isTiposOfertaLoading
                      ? "Cargando Tipos..."
                      : "Seleccione Tipo"}
                  </option>
                  {tiposOfertaData.map((tipo) => (
                    <option
                      key={tipo.id_tipo_oferta}
                      value={tipo.id_tipo_oferta}
                    >
                      {tipo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Fila 2: Duración, Módulos, Prácticos, Modalidad */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group controlId="formDuracion">
                <Form.Label className="fw-semibold">
                  <FaClock className="me-1" /> Duración (hs)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="duracion"
                  placeholder="Ej: 40"
                  value={oferta.duracion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formCantModulos">
                <Form.Label className="fw-semibold">
                  <FaLayerGroup className="me-1" /> Módulos
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cantModulos"
                  placeholder="Ej: 8"
                  value={oferta.cantModulos}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formPorchsparticos">
                <Form.Label className="fw-semibold">% Prácticos</Form.Label>
                <Form.Control
                  type="number"
                  name="porchsparticos"
                  placeholder="Ej: 20"
                  min="0"
                  max="100"
                  value={oferta.porchsparticos}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formModalidad">
                <Form.Label className="fw-semibold">Modalidad</Form.Label>
                <Form.Select
                  name="modalidad"
                  value={oferta.modalidad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione Modalidad</option>
                  {MODALIDADES.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Fila 3: Descripción */}
          <Form.Group className="mb-3" controlId="formDescripcion">
            <Form.Label className="fw-semibold">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              placeholder="Detalle breve del contenido y objetivos de la oferta."
              value={oferta.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Fila 4: Requisitos */}
          <Form.Group className="mb-3" controlId="formRequisitos">
            <Form.Label className="fw-semibold">Requisitos</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="requisitos"
              placeholder="Ej: Conocimientos de nivel básico, Ser mayor de 18 años, etc."
              value={oferta.requisitos}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
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
            disabled={
              loading || !oferta.titulo.trim() || !oferta.id_tipo_oferta
            }
          >
            <FaSave className="me-2" />
            {loading
              ? "Guardando..."
              : isEditing
              ? "Guardar Cambios"
              : "Guardar Oferta"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
