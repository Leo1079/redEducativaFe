import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  InputGroup,
  Card,
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaBookOpen,
  FaLayerGroup,
  FaClock,
  FaTags,
} from "react-icons/fa";
import COLORS from "./ColoresHome";
import ModalFormOfertas from "../Components/modalFormOffertFormativas";

// --- DATOS ESTÁTICOS DE MOCKEO ---
const MOCK_OFERTAS = [
  {
    id_oferta: 1,
    titulo: "Introducción a React Hooks",
    descripcion: "Curso intensivo sobre useState, useEffect y useContext.",
    duracion: 40, // en horas
    cantModulos: 8,
    porchsparticos: 5,
    requisitos: "Conocimiento de JavaScript ES6.",
    id_tipo_oferta: 1, // Curso
    modalidad: "Virtual Asincrónico",
  },
  {
    id_oferta: 2,
    titulo: "Seguridad Informática Avanzada",
    descripcion: "Taller sobre ciberseguridad, testing y prevención.",
    duracion: 80,
    cantModulos: 15,
    porchsparticos: 20,
    requisitos: "Experiencia previa en redes y Linux.",
    id_tipo_oferta: 2, // Taller
    modalidad: "Presencial",
  },
  {
    id_oferta: 3,
    titulo: "Diseño UX/UI desde Cero",
    descripcion: "Programa completo de creación de interfaces de usuario.",
    duracion: 120,
    cantModulos: 20,
    porchsparticos: 10,
    requisitos: "Ninguno.",
    id_tipo_oferta: 3, // Programa
    modalidad: "Híbrido",
  },
];

const MOCK_TIPOS_OFERTA = [
  { id_tipo_oferta: 1, nombre: "Curso" },
  { id_tipo_oferta: 2, nombre: "Taller" },
  { id_tipo_oferta: 3, nombre: "Programa de Capacitación" },
];

// --- Funciones Helpers de Datos Estáticos ---

const getOfertas = async () => {
  // Simulación de delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_OFERTAS;
};

const getTiposOferta = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_TIPOS_OFERTA;
};

/**
 * @param {Array} ofertas - Lista de ofertas (con id_tipo_oferta).
 * @param {Array} tiposOferta - Lista de tipos de oferta (con id_tipo_oferta y nombre).
 * @returns {Array} Ofertas con el campo tipo_oferta_nombre añadido.
 */
const getOfertasConTipoOferta = (ofertas, tiposOferta) => {
  const tiposOfertaMap = tiposOferta.reduce((map, tipo) => {
    map[tipo.id_tipo_oferta] = tipo.nombre;
    return map;
  }, {});

  return ofertas.map((oferta) => {
    const nombreTipoOferta = tiposOfertaMap[oferta.id_tipo_oferta];

    return {
      ...oferta,
      id_oferta: oferta.id_oferta,
      tipo_oferta_nombre: nombreTipoOferta || "Tipo No Asignado",
    };
  });
};

// -----------------------------------------------------------
// Componente principal: OfertasFormatPage
// -----------------------------------------------------------

export default function OfertasFormatPage() {
  const [ofertas, setOfertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tiposOfertaData, setTiposOfertaData] = useState([]);
  const [ofertaAEditar, setOfertaAEditar] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // --- FUNCIÓN DE CARGA COMPLETA (Usando MOCK DATA) ---
  const fetchDataCompleta = async () => {
    setIsLoading(true);
    try {
      // Usamos las funciones de mockeo
      const [ofertasData, tiposOfertaList] = await Promise.all([
        getOfertas(),
        getTiposOferta(),
      ]);

      setTiposOfertaData(tiposOfertaList);

      const res = getOfertasConTipoOferta(ofertasData, tiposOfertaList);

      setOfertas(res);
    } catch (error) {
      console.error("Fallo la carga de datos de Ofertas Formativas.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCompleta();
  }, [refreshFlag]);

  // --- Manejo de Modal y CRUD (Simulado) ---

  const handleShow = () => {
    setOfertaAEditar(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setOfertaAEditar(null);
  };

  // Simulación de cambio de datos para forzar la recarga visual (refreshFlag)
  const handleDataChange = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleEdit = (ofertaId) => {
    const ofertaEncontrada = ofertas.find((o) => o.id_oferta === ofertaId);
    if (ofertaEncontrada) {
      setOfertaAEditar(ofertaEncontrada);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar la Oferta ID ${id}? (SIMULADO)`
      )
    )
      return;

    alert(`SIMULACIÓN: Oferta ID ${id} eliminada.`);
    handleDataChange(); // Forzar recarga visual
  };

  // --- Lógica de Filtro (Sin cambios) ---

  const filteredOfertas = ofertas.filter(
    (oferta) =>
      (oferta.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (oferta.descripcion || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (oferta.tipo_oferta_nombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (oferta.modalidad || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Renderizado (Sin cambios) ---

  return (
    <Container
      fluid
      style={{ backgroundColor: COLORS.bgLight }}
      className="min-vh-100 py-5"
    >
      <Container style={{ maxWidth: "1400px" }}>
        {/* Encabezado y Botón Agregar */}
        <Row className="mb-4 d-flex align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-1" style={{ color: COLORS.textHeader }}>
              Gestión de Ofertas Formativas 📚
            </h1>
            <p className="lead" style={{ color: COLORS.textSecondary }}>
              Administra los programas, cursos y capacitaciones del sistema
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button
              onClick={handleShow}
              style={{
                backgroundColor: COLORS.textHeader,
                borderColor: COLORS.textHeader,
                color: COLORS.bgWhite,
                padding: "0.75rem 1.25rem",
              }}
              className="fw-bold shadow-sm"
            >
              <FaPlus className="me-2" />
              Agregar Oferta
            </Button>
          </Col>
        </Row>

        <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
          <Card.Body className="p-4">
            {/* Campo de Búsqueda */}
            <Row className="mb-4">
              <Col md={6}>
                <InputGroup
                  className="shadow-sm border-0"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <InputGroup.Text
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderColor: COLORS.bgLight,
                      borderRight: "none",
                    }}
                  >
                    <FaSearch style={{ color: COLORS.textSecondary }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por título, descripción o tipo de oferta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderColor: COLORS.bgLight,
                      borderLeft: "none",
                      boxShadow: "none",
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>

            {/* --- TABLA DE DATOS --- */}
            <Table responsive hover borderless className="align-middle">
              <thead>
                <tr
                  style={{
                    color: COLORS.textPrimary,
                    borderBottom: `1px solid ${COLORS.bgLight}`,
                  }}
                >
                  <th style={{ width: "5%" }}>ID</th>
                  <th style={{ width: "20%" }}>Título</th>
                  <th style={{ width: "25%" }}>Descripción (Corta)</th>
                  <th style={{ width: "10%" }} className="text-center">
                    Duración
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Módulos
                  </th>
                  <th style={{ width: "10%" }}>Tipo Oferta</th>
                  <th style={{ width: "10%" }}>Modalidad</th>
                  <th style={{ width: "10%" }} className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p
                        className="mt-2"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Cargando ofertas formativas (datos estáticos)...
                      </p>
                    </td>
                  </tr>
                ) : filteredOfertas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-4"
                      style={{ color: COLORS.textSecondary }}
                    >
                      No se encontraron ofertas formativas.
                    </td>
                  </tr>
                ) : (
                  filteredOfertas.map((oferta) => (
                    <tr
                      key={oferta.id_oferta}
                      style={{ borderBottom: `1px solid ${COLORS.bgLight}` }}
                    >
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {oferta.id_oferta}
                      </td>
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        <FaBookOpen
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {oferta.titulo}
                      </td>
                      <td
                        style={{
                          color: COLORS.textSecondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        {oferta.descripcion.substring(0, 50)}...
                      </td>
                      <td className="text-center fw-semibold">
                        <FaClock
                          size={12}
                          className="me-1"
                          style={{ color: COLORS.primary }}
                        />
                        {oferta.duracion}h
                      </td>
                      <td className="text-center fw-semibold">
                        <FaLayerGroup
                          size={12}
                          className="me-1"
                          style={{ color: COLORS.primary }}
                        />
                        {oferta.cantModulos}
                      </td>
                      <td className="fw-semibold">
                        <FaTags
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {oferta.tipo_oferta_nombre}
                      </td>
                      <td className="fw-semibold">{oferta.modalidad}</td>

                      <td className="text-center">
                        {/* Botones de Acción */}
                        <Button
                          variant="light"
                          onClick={() => handleEdit(oferta.id_oferta)}
                          className="me-2"
                          style={{ color: COLORS.primary }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => handleDelete(oferta.id_oferta)}
                          style={{ color: COLORS.danger }}
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      {/* 🎯 Modal del Formulario */}
      /*{" "}
      <ModalFormOfertas
        show={showModal}
        handleClose={handleClose}
        onSave={handleDataChange}
        ofertaToEdit={ofertaAEditar}
        onUpdate={handleDataChange}
        tiposOfertaData={tiposOfertaData}
      />
      * /
    </Container>
  );
}
