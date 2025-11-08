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
  FaEnvelope,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import COLORS from "./ColoresHome";
import clientAxios from "../helpers/axios.helpers";
import ModalFormSupervisores from "../Components/modalFormSupervisors";

// 🎯 Importación del Modal para Crear/Editar

export default function Supervisores() {
  const [supervisores, setSupervisores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // 🎯 ESTADOS DE EDICIÓN Y RECARGA
  const [supervisorAEditar, setSupervisorAEditar] = useState(null); // Objeto a editar (null para Creación)
  const [refreshFlag, setRefreshFlag] = useState(false); // Bandera que dispara la recarga de datos
  const [isLoading, setIsLoading] = useState(true); // Para el estado de carga // --- Función de Carga de Datos desde la API ---

  const getSupervisors = async () => {
    setIsLoading(true);
    try {
      const res = await clientAxios.get("/supervisores");
      setSupervisores(res.data || []);
    } catch (error) {
      console.error("Error al obtener supervisores:", error);
    } finally {
      setIsLoading(false);
    }
  }; // 🎯 useEffect: Llama a getSupervisors al montar y cada vez que refreshFlag cambia

  useEffect(() => {
    getSupervisors();
  }, [refreshFlag]); // --- Manejo del Modal y Edición --- // Abre el modal en modo Creación

  const handleShow = () => {
    setSupervisorAEditar(null);
    setShowModal(true);
  }; // Cierra el modal y limpia el estado de edición
  const handleClose = () => {
    setShowModal(false);
    setSupervisorAEditar(null);
  }; // 🎯 Handler para forzar la recarga después de cualquier operación CRUD exitosa

  const handleDataSaved = () => {
    setRefreshFlag((prev) => !prev);
  }; // 🎯 handleEdit: Configura el modo Edición al seleccionar un supervisor

  const handleEdit = (id) => {
    const supervisor = supervisores.find((s) => s.id_supervisor === id);
    if (supervisor) {
      setSupervisorAEditar(supervisor); // Pasa el objeto al modal
      setShowModal(true);
    }
  }; // 🎯 handleDelete: Elimina el supervisor y fuerza la recarga

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar al supervisor ID ${id}? Esta acción es irreversible.`
      )
    ) {
      return;
    }
    try {
      await clientAxios.delete(`/supervisores/${id}`);
      alert(`Supervisor ID ${id} eliminado con éxito.`);
      handleDataSaved(); // Forzar recarga
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el supervisor. Revisa la consola.");
    }
  }; // Filtra los supervisores (sin cambios)

  const filteredSupervisors = supervisores.filter(
    (supervisor) =>
      (supervisor.apeyNombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (supervisor.gmail || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (supervisor.sede || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      fluid
      style={{ backgroundColor: COLORS.bgLight }}
      className="min-vh-100 py-5"
    >
      {/* Container interior centrado */}{" "}
      <Container style={{ maxWidth: "1200px" }}>
        {" "}
        <Row className="mb-4 d-flex align-items-center">
          {" "}
          <Col md={8}>
            {" "}
            <h1 className="fw-bold mb-1" style={{ color: COLORS.textHeader }}>
              Gestión de Supervisores{" "}
            </h1>{" "}
            <p className="lead" style={{ color: COLORS.textSecondary }}>
              Administra el personal supervisor de la red educativa{" "}
            </p>{" "}
          </Col>{" "}
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            {" "}
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
              <FaPlus className="me-2" /> Agregar Supervisor{" "}
            </Button>{" "}
          </Col>{" "}
        </Row>{" "}
        <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
          {" "}
          <Card.Body className="p-4">
            {/* Barra de Búsqueda */}{" "}
            <Row className="mb-4">
              {" "}
              <Col md={6}>
                {" "}
                <InputGroup
                  className="shadow-sm border-0"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  {" "}
                  <InputGroup.Text
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderColor: COLORS.bgLight,
                      borderRight: "none",
                    }}
                  >
                    {" "}
                    <FaSearch style={{ color: COLORS.textSecondary }} />{" "}
                  </InputGroup.Text>{" "}
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, email o sede..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderColor: COLORS.bgLight,
                      borderLeft: "none",
                      boxShadow: "none",
                    }}
                  />{" "}
                </InputGroup>{" "}
              </Col>{" "}
            </Row>{" "}
            <Table responsive hover borderless className="align-middle">
              {" "}
              <thead>
                {" "}
                <tr
                  style={{
                    color: COLORS.textPrimary,
                    borderBottom: `1px solid ${COLORS.bgLight}`,
                  }}
                >
                  <th style={{ width: "3%" }}>ID</th>
                  <th style={{ width: "25%" }}>Apellido y Nombre</th>
                  <th style={{ width: "25%" }}>Email</th>
                  <th style={{ width: "15%" }}>Teléfono</th>
                  <th style={{ width: "20%" }}>Sede</th>{" "}
                  <th style={{ width: "12%" }} className="text-center">
                    Acciones{" "}
                  </th>{" "}
                </tr>{" "}
              </thead>
              {/* ⬅️ CORRECCIÓN: SIN ESPACIOS ANTES DE <tbody> */}{" "}
              <tbody>
                {" "}
                {isLoading ? (
                  <tr>
                    {" "}
                    <td colSpan="6" className="text-center py-5">
                      {" "}
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>{" "}
                      <p
                        className="mt-2"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Cargando datos de la API...
                      </p>{" "}
                    </td>{" "}
                  </tr>
                ) : filteredSupervisors.length === 0 ? (
                  <tr>
                    {" "}
                    <td
                      colSpan="6"
                      className="text-center py-4"
                      style={{ color: COLORS.danger }}
                    >
                      No se encontraron supervisores.{" "}
                    </td>{" "}
                  </tr>
                ) : (
                  filteredSupervisors.map((supervisor) => (
                    <tr // ⬅️ CORRECCIÓN: NO HAY ESPACIOS ENTRE LOS MAPEOS Y EL <tr>
                      key={supervisor.id_supervisor}
                      style={{ borderBottom: `1px solid ${COLORS.bgLight}` }}
                    >
                      {" "}
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {supervisor.id_supervisor}{" "}
                      </td>{" "}
                      <td
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {supervisor.apeyNombre}{" "}
                      </td>
                      {/* Email */}{" "}
                      <td style={{ color: COLORS.textSecondary }}>
                        {" "}
                        <FaEnvelope
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {supervisor.gmail}{" "}
                      </td>
                      {/* Teléfono */}{" "}
                      <td style={{ color: COLORS.textSecondary }}>
                        {" "}
                        <FaPhone
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {supervisor.telefono}{" "}
                      </td>
                      {/* Sede */}{" "}
                      <td style={{ color: COLORS.textPrimary }}>
                        {" "}
                        <FaBuilding
                          size={12}
                          className="me-2"
                          style={{ color: COLORS.textSecondary }}
                        />
                        {supervisor.sede}{" "}
                      </td>{" "}
                      {/* Columna de Acciones: Editar y Eliminar */}{" "}
                      <td className="text-center">
                        {" "}
                        <Button
                          variant="light"
                          onClick={() => handleEdit(supervisor.id_supervisor)}
                          className="me-2"
                          style={{ color: COLORS.primary }}
                        >
                          <FaEdit />{" "}
                        </Button>{" "}
                        <Button
                          variant="light"
                          onClick={() => handleDelete(supervisor.id_supervisor)}
                          style={{ color: COLORS.danger }}
                        >
                          <FaTrashAlt />{" "}
                        </Button>{" "}
                      </td>{" "}
                    </tr>
                  ))
                )}{" "}
              </tbody>
              {/* ⬅️ CORRECCIÓN: SIN ESPACIOS ANTES DE </table> */}{" "}
            </Table>{" "}
          </Card.Body>{" "}
        </Card>{" "}
      </Container>
      {/* 🎯 RENDERIZADO DEL MODAL */}{" "}
      <ModalFormSupervisores
        show={showModal}
        handleClose={handleClose}
        onSave={handleDataSaved} // Callback para Creación (fuerza recarga)
        onUpdate={handleDataSaved} // Callback para Edición (fuerza recarga)
        supervisorToEdit={supervisorAEditar} // Objeto para precargar el formulario en edición
      />{" "}
    </Container>
  );
}
