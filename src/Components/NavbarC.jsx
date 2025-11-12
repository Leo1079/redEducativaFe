import { Navbar, Container, Nav } from "react-bootstrap";
import { FaHome, FaRoute, FaCity, FaBuilding, FaUserTie } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { GrWorkshop } from "react-icons/gr";

// Paleta de Colores
const COLORS = {
  primary: "#2563eb",
  primaryDark: "#1e40af",
  success: "#10b981",
  textPrimary: "#1e293b",
  bgWhite: "#ffffff",
};

export default function NavbarC() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Inicio", path: "/", icon: FaHome },
    { name: "Circuitos", path: "/circuitos", icon: FaRoute },
    { name: "Departamentos", path: "/departamentos", icon: FaCity },
    { name: "Localidades", path: "/localidades", icon: FaCity },
    { name: "Instituciones", path: "/instituciones", icon: FaBuilding },
    { name: "Supervisores", path: "/supervisores", icon: FaUserTie },
    {
      name: "Ofertas Formativas",
      path: "/ofertasFormativas",
      icon: GrWorkshop,
    },
  ];

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 ">
      <Container>
        {/* Nombre del Sistema */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            color: COLORS.textHeader,
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {/* Logo verde de la imagen */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-2"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15v-5h2v5h-2zm0-7V7h2v3h-2z"
              fill={COLORS.success}
            />
          </svg>
          Red Educativa
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`mx-2 text-decoration-none d-flex align-items-center ${
                  location.pathname === link.path ? "fw-bold" : "text-secondary"
                }`}
                style={{
                  color:
                    location.pathname === link.path
                      ? COLORS.primary
                      : COLORS.textPrimary,
                  borderBottom:
                    location.pathname === link.path
                      ? `2px solid ${COLORS.primary}`
                      : "none",
                  paddingBottom: "0.4rem",
                }}
              >
                <link.icon className="me-1" />
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
