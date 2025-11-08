import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaRoute,
  FaCity,
  FaBuilding,
  FaUserTie,
  FaBolt,
  FaArrowRight,
  FaHashtag,
  FaMapMarkedAlt,
} from "react-icons/fa";

import COLORS from "./ColoresHome";

export default function Home() {
  const navigate = useNavigate();

  // MOCK DATA: Simulación de los conteos de cada módulo
  const [moduleStats] = useState({
    circuitos: 3,
    departamentos: 4,
    localidades: 4,
    instituciones: 3,
    supervisores: 3,
  });

  // Estructura para el RESUMEN DE REGISTROS
  const statItems = [
    {
      title: "Circuitos",
      value: moduleStats.circuitos,
      icon: FaBolt,
      bgColor: COLORS.success,
    },
    {
      title: "Departamentos",
      value: moduleStats.departamentos,
      icon: FaMapMarkedAlt,
      bgColor: COLORS.primary,
    },
    {
      title: "Localidades",
      value: moduleStats.localidades,
      icon: FaCity,
      bgColor: COLORS.warning,
    },
    {
      title: "Instituciones",
      value: moduleStats.instituciones,
      icon: FaBuilding,
      bgColor: COLORS.danger,
    },
    {
      title: "Supervisores",
      value: moduleStats.supervisores,
      icon: FaUserTie,
      bgColor: COLORS.primaryDark,
    },
  ];

  // Estructura de las tarjetas de MÓDULOS
  const moduleItems = [
    {
      title: "Circuitos",
      icon: FaBolt,
      path: "/circuitos",
      description: "Gestiona los circuitos educativos",
      count: moduleStats.circuitos,
      iconColor: COLORS.success,
      iconBg: COLORS.iconBgLightGreen,
    },
    {
      title: "Departamentos",
      icon: FaMapMarkedAlt,
      path: "/departamentos",
      description: "Administra departamentos",
      count: moduleStats.departamentos,
      iconColor: COLORS.primary,
      iconBg: COLORS.iconBgLightBlue,
    },
    {
      title: "Localidades",
      icon: FaCity,
      path: "/localidades",
      description: "Gestiona localidades y regiones",
      count: moduleStats.localidades,
      iconColor: COLORS.warning,
      iconBg: COLORS.iconBgLightYellow,
    },
    {
      title: "Instituciones",
      icon: FaBuilding,
      path: "/instituciones",
      description: "Visualiza la información de las instituciones",
      count: moduleStats.instituciones,
      iconColor: COLORS.danger,
      iconBg: COLORS.danger + "1A",
    },
    {
      title: "Supervisores",
      icon: FaUserTie,
      path: "/supervisores",
      description: "Accede a la lista de supervisores",
      count: moduleStats.supervisores,
      iconColor: COLORS.primaryDark,
      iconBg: COLORS.primaryDark + "1A",
    },
  ];

  // Estructura de las ACCIONES RÁPIDAS - AHORA CON COLORES ESPECÍFICOS
  const quickActions = [
    {
      title: "Nuevo Circuito",
      path: "/circuitos/nuevo",
      icon: FaRoute,
      accent: COLORS.success,
      iconBg: COLORS.iconBgLightGreen,
    },
    {
      title: "Nuevo Departamento",
      path: "/departamentos/nuevo",
      icon: FaCity,
      accent: COLORS.primary,
      iconBg: COLORS.iconBgLightBlue,
    },
    {
      title: "Nueva Localidad",
      path: "/localidades/nuevo",
      icon: FaCity,
      accent: COLORS.warning,
      iconBg: COLORS.iconBgLightYellow,
    },
    {
      title: "Nueva Institución",
      path: "/instituciones/nuevo",
      icon: FaBuilding,
      accent: COLORS.danger,
      iconBg: COLORS.danger + "1A",
    },
    {
      title: "Nuevo Supervisor",
      path: "/supervisores/nuevo",
      icon: FaUserTie,
      accent: COLORS.primaryDark,
      iconBg: COLORS.primaryDark + "1A",
    },
  ];

  return (
    <Container
      fluid
      style={{ backgroundColor: COLORS.bgLight }}
      className="min-vh-100 p-0"
    >
      {/* --- HEADER/BANNER PRINCIPAL --- */}
      <div
        className="py-5 px-4 px-md-5 text-white"
        style={{
          background: `linear-gradient(90deg, ${COLORS.gradientStart} 0%, ${COLORS.gradientEnd} 100%)`,
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Container style={{ maxWidth: "1200px" }}>
          <h1 className="display-4 fw-bold mb-3">Red Educativa</h1>
          <p className="lead mb-4">
            Sistema integral de gestión para circuitos, instituciones y
            supervisores educativos
          </p>

          <div className="d-flex flex-wrap gap-4 mt-4 small">
            <div className="d-flex align-items-center me-4">
              <FaHashtag size={16} className="me-2" />
              <span>17 registros totales</span>
            </div>
            <div className="d-flex align-items-center">
              <FaBolt size={16} className="me-2" />
              <span>{moduleItems.length} módulos activos</span>
            </div>
          </div>
        </Container>
      </div>

      <Container style={{ maxWidth: "1200px" }} className="py-5">
        {/* --- SECCIÓN DIVIDIDA: MÓDULOS Y ACCIONES RÁPIDAS --- */}
        <Row className="mt-5">
          {/* COLUMNA IZQUIERDA: MÓDULOS (lg={9}) */}
          <Col lg={9} className="mb-4 mb-lg-0">
            <h2 className="mb-2" style={{ color: COLORS.textHeader }}>
              Módulos del Sistema
            </h2>
            <p className="mb-4 lead" style={{ color: COLORS.textSecondary }}>
              Selecciona un módulo para gestionar la información
            </p>

            <Row xs={1} sm={2} className="g-4">
              {moduleItems.map((item) => (
                <Col key={item.path}>
                  <Card
                    className="shadow-lg h-100 border-0"
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderRadius: "12px",
                      position: "relative",
                      padding: "1.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <Card.Body>
                      <div
                        className="rounded-3 p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: item.iconBg,
                          width: "56px",
                          height: "56px",
                        }}
                      >
                        <item.icon
                          size={28}
                          style={{ color: item.iconColor }}
                        />
                      </div>

                      <FaArrowRight
                        size={20}
                        style={{
                          position: "absolute",
                          top: "1.5rem",
                          right: "1.5rem",
                          color: COLORS.textSecondary,
                        }}
                      />

                      <Card.Title
                        className="h5 fw-bold mb-1"
                        style={{ color: COLORS.textHeader }}
                      >
                        {item.title}
                      </Card.Title>
                      <Card.Text
                        className="mb-3 small"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {item.description}
                      </Card.Text>
                      <Card.Text
                        className="fw-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {item.count} registros
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col lg={3}>
            <h4 className="fw-bold mb-3" style={{ color: COLORS.textHeader }}>
              Acciones Rápidas
            </h4>

            <Row xs={1} className="g-3">
              {" "}
              {quickActions.map((action) => (
                <Col key={action.path}>
                  <Card
                    className="shadow-md h-100 border-1"
                    style={{
                      backgroundColor: COLORS.bgWhite,
                      borderRadius: "12px",
                      borderBottom: `4px solid ${action.accent}`, // Borde inferior con color de acento
                      padding: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Card.Body className="d-flex align-items-center justify-content-between p-0">
                      {" "}
                      {/* p-0 para controlar padding */}
                      <div className="d-flex align-items-center">
                        {/* Icono pequeño con fondo suave, similar a los módulos */}
                        <div
                          className="rounded-3 p-2 me-3 d-inline-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: action.iconBg,
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <action.icon
                            size={20}
                            style={{ color: action.accent }}
                          />
                        </div>
                        <span
                          className="fw-bold"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {action.title}
                        </span>
                      </div>
                      <FaArrowRight
                        size={16}
                        style={{ color: COLORS.textSecondary }}
                      />{" "}
                      {/* Flecha a la derecha */}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <h2 className="mt-5" style={{ color: COLORS.textHeader }}>
          Resumen de Registros
        </h2>

        <Row xs={2} sm={3} lg={5} className="g-4 mt-1">
          {statItems.map((stat) => (
            <Col key={stat.title}>
              <Card
                className="shadow-sm h-100 border-0 text-center"
                style={{
                  backgroundColor: COLORS.bgWhite,
                  borderRadius: "12px",
                  padding: "1rem 0",
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <div
                    className="mb-3 d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      backgroundColor: stat.bgColor,
                      width: "64px",
                      height: "64px",
                    }}
                  >
                    <stat.icon size={32} className="text-white" />
                  </div>

                  <Card.Title
                    className="h2 fw-bold mb-1"
                    style={{ color: COLORS.textHeader }}
                  >
                    {stat.value}
                  </Card.Title>

                  <Card.Text
                    className="small"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {stat.title}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}
