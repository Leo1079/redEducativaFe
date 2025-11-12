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
  Modal, // Se mantiene por si se usa en otros lados, aunque no directamente para el formulario
} from "react-bootstrap";
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaUser } from "react-icons/fa";
import COLORS from "./ColoresHome";
import clientAxios from "../helpers/axios.helpers";
import ModalFormCircuits from "../Components/ModalFormCircuits";

// --- Funciones Helpers ---

/**
 * Combina la lista de circuitos con los nombres de sus supervisores.
 * @param {Array} circuitos - Lista de circuitos de la API.
 * @param {Array} supervisors - Lista de supervisores de la API.
 * @returns {Array} Circuitos con el campo supervisor_nombre añadido.
 */
const getCircuitosConSupervisor = (circuitos, supervisors) => {
  return circuitos.map((circuito) => {
    const supervisor = supervisors.find(
      // Se asume que la tabla de supervisores usa 'id_supervisor' o que se mapea aquí
      (s) => s.id_supervisor === circuito.id_supervisor
    );
    return {
      ...circuito,
      // Aseguramos que el ID del circuito sea la clave para las acciones
      id_circuito: circuito.id_circuito,
      supervisor_nombre: supervisor ? supervisor.apeyNombre : "No Asignado",
    };
  });
};

// -----------------------------------------------------------
// Componente principal: CircuitosPage
// -----------------------------------------------------------

export default function CircuitosPage() {
  const [circuitos, setCircuitos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supervisorsData, setSupervisorsData] = useState([]);
  const [circuitoAEditar, setCircuitoAEditar] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const getCircuits = async () => {
    try {
      const { data } = await clientAxios.get("/circuitos");
      return data || [];
    } catch (error) {
      console.error("Error al obtener circuitos de API:", error);
      return [];
    }
  };

  const getSupervisors = async () => {
    try {
      const { data } = await clientAxios.get("/supervisores");
      setSupervisorsData(data || []);
      return data || [];
    } catch (error) {
      console.error("Error al obtener supervisores de API:", error);
      return [];
    }
  };

  const fetchDataCompleta = async () => {
    setIsLoading(true);
    try {
      const [circuitosData, supervisoresData] = await Promise.all([
        getCircuits(),
        getSupervisors(),
      ]);
      const res = getCircuitosConSupervisor(circuitosData, supervisoresData);

      setCircuitos(res);
    } catch (error) {
      console.error("Fallo la carga de datos de la API.", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDataCompleta();
  }, [refreshFlag]);

  const handleShow = () => {
    setCircuitoAEditar(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCircuitoAEditar(null);
  };

  const handleAddCircuit = (newCircuitData) => {
    const combinedNewCircuit = getCircuitosConSupervisor(
      [newCircuitData],
      supervisorsData
    )[0];

    setCircuitos((prev) => [...prev, combinedNewCircuit]);
    setRefreshFlag((prev) => !prev);
  };

  const handleEdit = (circuitoId) => {
    const circuitoEncontrado = circuitos.find(
      (c) => c.id_circuito === circuitoId
    );
    if (circuitoEncontrado) {
      setCircuitoAEditar(circuitoEncontrado);
      setShowModal(true);
    }
  };

  const handleUpdateCircuit = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleDelete = async (id) => {
    const res = await clientAxios.delete(`/circuitos/${id}`);
    setRefreshFlag((prev) => !prev);
  };

  // --- Lógica de Filtro ---

  const filteredCircuitos = circuitos.filter(
    (circuito) =>
      (circuito.nombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (circuito.descripcion || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (circuito.supervisor_nombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // --- Renderizado ---

  return (
    <Container
      fluid
      style={{ backgroundColor: COLORS.bgLight }}
      className="min-vh-100 "
    >
      <Container style={{ maxWidth: "1200px" }} className="py-5">
        {/* Encabezado y Botón Agregar */}
        <Row className="mb-4 d-flex align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-1" style={{ color: COLORS.textHeader }}>
              Gestión de Circuitos
            </h1>
            <p className="lead" style={{ color: COLORS.textSecondary }}>
              Administra los circuitos educativos del sistema
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
              Agregar Circuito
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
                    placeholder="Buscar por nombre, descripción o supervisor..."
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
                  <th style={{ width: "20%" }}>Nombre</th>
                  <th style={{ width: "45%" }}>Descripción</th>
                  <th style={{ width: "20%" }}>Supervisor</th>
                  <th style={{ width: "10%" }} className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
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
                        Cargando datos de la API...
                      </p>
                    </td>
                  </tr>
                ) : filteredCircuitos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4"
                      style={{ color: COLORS.textSecondary }}
                    >
                      No se encontraron circuitos.
                    </td>
                  </tr>
                ) : (
                  filteredCircuitos.map((circuito) => (
                    <tr
                      key={circuito.id_circuito}
                      style={{ borderBottom: `1px solid ${COLORS.bgLight}` }}
                    >
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {circuito.id_circuito}
                      </td>
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {circuito.nombre}
                      </td>
                      <td style={{ color: COLORS.textSecondary }}>
                        {circuito.descripcion}
                      </td>
                      <td
                        style={{
                          color: circuito.id_supervisor
                            ? COLORS.textPrimary
                            : COLORS.danger,
                        }}
                      >
                        <FaUser
                          size={12}
                          className="me-2"
                          style={{
                            color: circuito.id_supervisor
                              ? COLORS.textSecondary
                              : COLORS.danger,
                          }}
                        />
                        {circuito.supervisor_nombre}
                      </td>

                      <td className="text-center">
                        {/* 🎯 LLAMADA A handleEdit */}
                        <Button
                          variant="light"
                          onClick={() => handleEdit(circuito.id_circuito)}
                          className="me-2"
                          style={{ color: COLORS.primary }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => handleDelete(circuito.id_circuito)}
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

      <ModalFormCircuits
        show={showModal}
        handleClose={handleClose}
        onSave={handleAddCircuit}
        circuitToEdit={circuitoAEditar} // Pasa el objeto para entrar en modo edición
        onUpdate={handleUpdateCircuit} // Pasa la función para actualizar la lista
      />
    </Container>
  );
}
