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
  Modal,
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaMapSigns,
} from "react-icons/fa";
import COLORS from "./ColoresHome";
import clientAxios from "../helpers/axios.helpers";
import ModalFormDepartamentos from "../Components/ModalFromDepartamentos";

// --- Funciones Helpers ---

const getDepartamentos = async () => {
  try {
    const { data } = await clientAxios.get("/departamentos"); 
  } catch (error) {
    console.error("Error al obtener departamentos de API:", error);
    return [];
  }
};

const getCircuitos = async () => {
  try {
    const { data } = await clientAxios.get("/circuitos"); 
    return data || [];
  } catch (error) {
    console.error("Error al obtener circuitos de API:", error);
    return [];
  }
};

/**
 * Combina la lista de departamentos con los nombres de sus circuitos.
 * * @param {Array} departamentos - Lista de departamentos (con id_circuito).
 * @param {Array} circuitos - Lista de circuitos (con id_circuito y nombre_circuito).
 * @returns {Array} Departamentos con el campo nombre_circuito añadido.
 */
const getDepartamentosConCircuito = (departamentos, circuitos) => {
  const circuitosMap = circuitos.reduce((map, circuito) => {
    map[circuito.id_circuito] = circuito.nombre_circuito || circuito.nombre;
    return map;
  }, {});

  return departamentos.map((departamento) => {
    const nombreCircuito = circuitosMap[departamento.id_circuito];

    return {
      ...departamento,
      id_departamento: departamento.id_departamento,
      nombre_circuito: nombreCircuito || "Circuito No Asignado",
    };
  });
};

// -----------------------------------------------------------
// Componente principal: DepartamentosPage
// -----------------------------------------------------------

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // 🎯 Se mantiene para pasar al Modal y hacer el join después de guardar
  const [circuitosData, setCircuitosData] = useState([]);
  const [departamentoAEditar, setDepartamentoAEditar] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // --- FUNCIÓN DE CARGA COMPLETA ---
  const fetchDataCompletaDepartamentos = async () => {
    setIsLoading(true);
    try {
      const [departamentosData, circuitosList] = await Promise.all([
        getDepartamentos(),
        getCircuitos(),
      ]);

      setCircuitosData(circuitosList);

      const res = getDepartamentosConCircuito(departamentosData, circuitosList);

      setDepartamentos(res);
    } catch (error) {
      console.error("Fallo la carga completa de Departamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCompletaDepartamentos();
  }, [refreshFlag]);


  const handleShow = () => {
    setDepartamentoAEditar(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setDepartamentoAEditar(null);
  };

  const handleAddDepartamento = (newDepartamentoData) => {
    const combinedNewDepartamento = getDepartamentosConCircuito(
      [newDepartamentoData],
      circuitosData
    )[0];

    setRefreshFlag((prev) => !prev);
  };

  const handleUpdateDepartamento = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleEdit = (departamentoId) => {
    const departamentoEncontrado = departamentos.find(
      (d) => d.id_departamento === departamentoId
    );
    if (departamentoEncontrado) {
      setDepartamentoAEditar(departamentoEncontrado);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el Departamento ID ${id}?`))
      return;
    try {
      await clientAxios.delete(`/departamentos/${id}`);
      alert("Departamento eliminado con éxito.");
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(
        "Error al eliminar el departamento. Verifica que no tenga dependencias."
      );
    }
  };

  // --- Lógica de Filtro ---

  const filteredDepartamentos = departamentos.filter(
    (departamento) =>
      (departamento.nombre || "") 
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (departamento.nombre_circuito || "") 
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

 

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
              Gestión de Departamentos 🏢
            </h1>
            <p className="lead" style={{ color: COLORS.textSecondary }}>
              Administra los departamentos y sus circuitos asignados
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
              Agregar Departamento
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
                    placeholder="Buscar por nombre de departamento o circuito..."
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
                  <th style={{ width: "35%" }}>Departamento</th>
                  <th style={{ width: "35%" }}>Circuito Asignado</th>
                  <th style={{ width: "20%" }} className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
             
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDepartamentos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4"
                      style={{ color: COLORS.textSecondary }}
                    >
                      No se encontraron departamentos.
                    </td>
                  </tr>
                ) : (
                  filteredDepartamentos.map((departamento) => (
                    <tr
                      key={departamento.id_departamento}
                      style={{ borderBottom: `1px solid ${COLORS.bgLight}` }}
                    >
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {departamento.id_departamento}
                      </td>
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {departamento.nombre}
                      </td>
                      {/* 🎯 Columna de Circuito Unido */}
                      <td
                        style={{
                          color: departamento.id_circuito
                            ? COLORS.textPrimary
                            : COLORS.danger,
                        }}
                      >
                        <FaMapSigns
                          size={12}
                          className="me-2"
                          style={{
                            color: departamento.id_circuito
                              ? COLORS.textSecondary
                              : COLORS.danger,
                          }}
                        />
                        <span className="fw-semibold">
                          {departamento.nombre_circuito}
                        </span>
                      </td>

                      <td className="text-center">
                        {/* Botones de Acción */}
                        <Button
                          variant="light"
                          onClick={() =>
                            handleEdit(departamento.id_departamento)
                          }
                          className="me-2"
                          style={{ color: COLORS.primary }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          onClick={() =>
                            handleDelete(departamento.id_departamento)
                          }
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
      <ModalFormDepartamentos
        show={showModal}
        handleClose={handleClose}
        onSave={handleAddDepartamento}
        departamentoToEdit={departamentoAEditar}
        onUpdate={handleUpdateDepartamento}
        circuitosData={circuitosData} 
      />
    </Container>
  );
}
