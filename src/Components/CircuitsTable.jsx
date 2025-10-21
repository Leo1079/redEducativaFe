import { Table, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import clientAxios from "../helpers/axios.helpers";
import { useEffect, useState } from "react";

const CircuitsTable = ({}) => {
  const [circuitos, setCircuitos] = useState([]);

  const obtenerCircuitos = async () => {
    try {
      const res = await clientAxios.get("/circuitos");
      setCircuitos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerCircuitos();
  }, []);

  return (
    <div className="container mt-4">
      <Table
        striped
        bordered
        responsive
        variant="dark"
        className="shadow-sm mt-3 text-light"
      >
        <thead className="bg-light">
          <tr>
            <th>id</th>
            <th>Nombre</th>
            <th>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          {circuitos.length > 0 ? (
            circuitos.map((circuito, i) => (
              <tr key={i}>
                <td>{circuito.id_circuito}</td>
                <td>{circuito.nombre}</td>
                <td>{circuito.descripcion}</td>
                <td>
                  <Button variant="outline-dark" size="sm" className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center  py-3">
                No hay circuitos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CircuitsTable;
