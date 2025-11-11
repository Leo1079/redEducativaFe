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
  FaCheckCircle, // Para "Es Comuna" (Sí)
  FaTimesCircle, // Para "Es Comuna" (No)
  FaBuilding, // Icono para Localidad
} from "react-icons/fa";
import COLORS from "./ColoresHome";
import clientAxios from "../helpers/axios.helpers";
import ModalFormCircuits from "../Components/ModalFormCircuits";
import ModalFormLocalidades from "../Components/ModalFormLocalidades";

const getLocalidades = async () => {
  try {
    const { data } = await clientAxios.get("/localidades"); // ⬅️ Nuevo Endpoint
    return data || [];
  } catch (error) {
    console.error("Error al obtener localidades de API:", error);
    return [];
  }
};

const getDepartamentos = async () => {
  try {
    const { data } = await clientAxios.get("/departamentos"); // Usamos el endpoint de Departamentos
    return data || [];
  } catch (error) {
    console.error("Error al obtener departamentos de API:", error);
    return [];
  }
};

/**
 * Combina la lista de localidades con los nombres de sus departamentos.
 * @param {Array} localidadesData - Lista de localidades (con id_departamento).
 * @param {Array} departamentosData - Lista de departamentos (con id_departamento y nombre).
 * @returns {Array} Localidades con el campo nombre_departamento añadido.
 */
const getLocalidadesConDepartamento = (localidadesData, departamentosData) => {
  // 1. Crear un mapa de Departamentos para un acceso rápido por ID (O(1))
  const departamentosMap = departamentosData.reduce((map, departamento) => {
    // Usamos id_departamento como clave y el nombre como valor
    map[departamento.id_departamento] = departamento.nombre;
    return map;
  }, {});

  return localidadesData.map((localidad) => {
    const nombreDepartamento = departamentosMap[localidad.id_departamento];

    return {
      ...localidad,
      id_localidad: localidad.id_localidad,
      nombre_departamento: nombreDepartamento || "Departamento No Asignado",
      es_comuna: !!localidad.es_comuna,
    };
  });
};

// -----------------------------------------------------------
// Componente principal: LocalidadesPage
// -----------------------------------------------------------

export default function LocalidadesPage() {
  const [localidades, setLocalidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departamentosData, setDepartamentosData] = useState([]);
  const [localidadAEditar, setLocalidadAEditar] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // --- FUNCIÓN DE CARGA COMPLETA (Localidades + Departamentos JOIN) ---
  const fetchDataCompletaLocalidades = async () => {
    setIsLoading(true);
    try {
      // 1. Cargar datos en paralelo: Localidades y Departamentos
      const [localidadesList, departamentosList] = await Promise.all([
        getLocalidades(),
        getDepartamentos(),
      ]);

      setDepartamentosData(departamentosList);

      // 2. Realizar el Join en el frontend
      const res = getLocalidadesConDepartamento(
        localidadesList,
        departamentosList
      );

      setLocalidades(res);
    } catch (error) {
      console.error("Fallo la carga completa de Localidades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCompletaLocalidades();
  }, [refreshFlag]);

  // --- Manejo de Modal y CRUD ---

  const handleShow = () => {
    setLocalidadAEditar(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setLocalidadAEditar(null);
  };

  const handleDataChange = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleEdit = (localidadId) => {
    const localidadEncontrada = console.log(
      localidades.find((l) => l.id_localidad == localidadId)
    );
    if (localidadEncontrada) {
      setLocalidadAEditar(localidadEncontrada);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar la Localidad ID ${id}?`))
      return;
    try {
      await clientAxios.delete(`/localidades/${id}`); // ⬅️ Endpoint DELETE
      alert("Localidad eliminada con éxito.");
      handleDataChange(); // Forzar recarga
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(
        "Error al eliminar la localidad. Verifica que no tenga dependencias."
      );
    }
  };

  // --- Lógica de Filtro ---

  const filteredLocalidades = localidades.filter(
    (localidad) =>
      (localidad.nombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (localidad.nombre_departamento || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // --- Renderizado ---

  return (
    <Container
      fluid
      style={{ backgroundColor: COLORS.bgLight }}
      className="min-vh-100 py-5"
    >
      <Container style={{ maxWidth: "1200px" }}>
        <Row className="mb-4 d-flex align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-1" style={{ color: COLORS.textHeader }}>
              Gestión de Localidades 🏙️
            </h1>
            <p className="lead" style={{ color: COLORS.textSecondary }}>
              Administra las localidades y sus departamentos asignados
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
              Agregar Localidad
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
                    placeholder="Buscar por nombre de localidad o departamento..."
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
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "30%" }}>Nombre Localidad</th>
                  <th style={{ width: "25%" }}>Departamento Asignado</th>
                  <th style={{ width: "15%" }} className="text-center">
                    Es Comuna
                  </th>
                  <th style={{ width: "20%" }} className="text-center">
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
                    </td>
                  </tr>
                ) : filteredLocalidades.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4"
                      style={{ color: COLORS.textSecondary }}
                    >
                      No se encontraron localidades.
                    </td>
                  </tr>
                ) : (
                  filteredLocalidades.map((localidad) => (
                    <tr
                      key={localidad.id_localidad}
                      style={{ borderBottom: `1px solid ${COLORS.bgLight}` }}
                    >
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {localidad.id_localidad}
                      </td>
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        <FaBuilding
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {localidad.nombre}
                      </td>
                      {/* Columna de Departamento Unido */}
                      <td style={{ color: COLORS.textSecondary }}>
                        <span className="fw-semibold">
                          {localidad.nombre_departamento}
                        </span>
                      </td>
                      {/* Columna Es Comuna */}
                      <td className="text-center">
                        {localidad.es_comuna == 0 ? (
                          <FaCheckCircle
                            style={{ color: COLORS.success }}
                            title="Es Comuna"
                          />
                        ) : (
                          <FaTimesCircle
                            style={{ color: COLORS.danger }}
                            title="No es Comuna"
                          />
                        )}
                      </td>

                      <td className="text-center">
                        {/* Botones de Acción */}
                        <Button
                          variant="light"
                          onClick={() => handleEdit(localidad.id_localidad)}
                          className="me-2"
                          style={{ color: COLORS.primary }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => handleDelete(localidad.id_localidad)}
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
      <ModalFormLocalidades
        show={showModal}
        handleClose={handleClose}
        onSave={handleDataChange} // Usa la misma función para recargar al guardar/actualizar
        localidadToEdit={localidadAEditar}
        onUpdate={handleDataChange}
        departamentosData={departamentosData} // Pasa la lista de departamentos al modal para el select
      />
    </Container>
  );
}
