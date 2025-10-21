import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaRoute, FaCity, FaBuilding, FaUserTie } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Circuitos",
      icon: FaRoute,
      path: "/circuitos",
      description: "Visualiza la información de los circuitos.",
    },
    {
      title: "Departamentos",
      icon: FaCity,
      path: "/departamentos",
      description: "Explora el listado de departamentos.",
    },
    {
      title: "Localidades",
      icon: FaCity,
      path: "/localidades",
      description: "Encuentra información sobre las localidades.",
    },
    {
      title: "Instituciones",
      icon: FaBuilding,
      path: "/instituciones",
      description: "Gestiona los datos de las instituciones.",
    },
    {
      title: "Supervisores",
      icon: FaUserTie,
      path: "/supervisores",
      description: "Accede a la lista de supervisores.",
    },
  ];

  return (
    <Container
      fluid
      className="min-vh-100 d-flex flex-column align-items-center py-5"
    >
      <Container className="my-5" style={{ maxWidth: "1200px" }}>
        <h1 className="text-center mb-5 display-4 text-primary">
          Bienvenido al Sistema 🌃
        </h1>

        <Row xs={1} sm={2} lg={3} className="g-4">
          {menuItems.map((item) => (
            <Col key={item.path}>
              <Card className="shadow-lg h-100 text-center bg-secondary text-light border-0">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <item.icon size={48} className="mb-3 text-primary" />
                    <Card.Title className="h5">{item.title}</Card.Title>
                    <Card.Text className="text-white-50">
                      {item.description}
                    </Card.Text>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(item.path)}
                    className="mt-3 w-100"
                  >
                    Ir a {item.title}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}
