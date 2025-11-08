import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import clientAxios from "../helpers/axios.helpers";

const mockSupervisors = [
  { id_supervisor: "", apeyNombre: "Seleccione un Supervisor" },
];

export default function ModalFormCircuits({
  show,
  handleClose,
  onSave,
  circuitToEdit,
  onUpdate,
}) {
  const isEditing = !!circuitToEdit;

  const [circuito, setCircuito] = useState({
    nombre: "",
    descripcion: "",
    id_supervisor: "",
  });
  const [supervisores, setSupervisores] = useState(mockSupervisors);
  const [loading, setLoading] = useState(false);
  const [loadingSup, setLoadingSup] = useState(false);

  useEffect(() => {
    if (show) {
      fetchSupervisors();
      if (isEditing) {
        setCircuito({
          nombre: circuitToEdit.nombre || "",
          descripcion: circuitToEdit.descripcion || "",
          id_supervisor: circuitToEdit.id_supervisor || "",
        });
      } else {
        setCircuito({ nombre: "", descripcion: "", id_supervisor: "" });
      }
    }
  }, [show, isEditing, circuitToEdit]);

  const fetchSupervisors = async () => {
    setLoadingSup(true);
    try {
      const { data } = await clientAxios.get("/supervisores");
      const initialOption = {
        id_supervisor: "",
        apeyNombre: "--- No Asignado / Seleccionar ---",
      };
      setSupervisores([initialOption, ...(data || [])]);
    } catch (error) {
      console.error("Error al obtener supervisores:", error);
      setSupervisores(mockSupervisors);
    } finally {
      setLoadingSup(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let key =
      id === "formNombre"
        ? "nombre"
        : id === "formDescripcion"
        ? "descripcion"
        : "id_supervisor";

    let val =
      key === "id_supervisor" ? (value === "" ? null : parseInt(value)) : value;

    setCircuito({
      ...circuito,
      [key]: val,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...circuito,
        id_supervisor: circuito.id_supervisor || null,
      };

      let response;
      if (isEditing) {
        const url = `/circuitos/${circuitToEdit.id_circuito}`;
        response = await clientAxios.put(url, payload);

        if (onUpdate) {
          onUpdate(response.data);
        }
      } else {
        response = await clientAxios.post("/circuitos", payload);

        if (onSave) {
          onSave(response.data);
        }
      }

      setCircuito({ nombre: "", descripcion: "", id_supervisor: "" });
      handleClose();
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "editar" : "crear"} el circuito:`,
        error
      );
      alert(
        `Error al guardar el circuito. Revisa la consola. ${
          error.response?.data?.message || ""
        }`
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
      dialogClassName="modal-dark"
    >
      <Modal.Header closeButton className="bg-light text-dark border-0">
        <Modal.Title>
          {isEditing
            ? `✏️ Editar Circuito: ${circuitToEdit?.nombre}`
            : "➕ Crear Nuevo Circuito"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light text-dark">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formNombre">
            <Form.Label column sm="3">
              Nombre
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                placeholder="Ej: Circuito Zona Norte"
                value={circuito.nombre}
                onChange={handleChange}
                required
                className="bg-light text-dark border-secondary"
              />
            </Col>
          </Form.Group>

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
                onChange={handleChange}
                className="bg-light text-dark border-secondary"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formSupervisor">
            <Form.Label column sm="3">
              Supervisor
            </Form.Label>
            <Col sm="9">
              <Form.Select
                value={
                  circuito.id_supervisor === null ? "" : circuito.id_supervisor
                }
                onChange={handleChange}
                disabled={loadingSup || loading}
                className="bg-light text-dark border-secondary"
              >
                {loadingSup ? (
                  <option value="">Cargando supervisores...</option>
                ) : (
                  supervisores.map((supervisor) => (
                    <option
                      key={supervisor.id_supervisor || ""}
                      value={supervisor.id_supervisor || ""}
                    >
                      {supervisor.apeyNombre}
                    </option>
                  ))
                )}
              </Form.Select>
            </Col>
          </Form.Group>

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
              disabled={loading || circuito.nombre.trim() === ""}
            >
              {loading
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Guardar Circuito"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
