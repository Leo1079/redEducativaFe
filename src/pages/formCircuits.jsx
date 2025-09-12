import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import clientAxios from "../helpers/axios.helpers"; // tu axios configurado

function CircuitForm() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false); // opcional: para mostrar spinner o desactivar botón

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await clientAxios.post("/circuitos", {
        nombre,
        descripcion,
      });

      console.log("Circuito guardado:", res.data);
      setNombre("");
      setDescripcion("");
      alert("Circuito guardado correctamente!");
    } catch (error) {
      console.error("Error al guardar circuito:", error);
      alert("Ocurrió un error al guardar el circuito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre del Circuito</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa el nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ingresa la descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Circuito"}
      </Button>
    </Form>
  );
}

export default CircuitForm;
