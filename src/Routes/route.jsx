import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Circuitos from '../pages/Circuitos';
import FormCircuits from '../pages/formCircuits';
import Departamentos from '../pages/Departamentos'; 
import Localidades from '../pages/Localidades';
import Instituciones from '../pages/Instituciones';
import Supervisores from '../pages/Supervisores';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/circuitos" element={<Circuitos />} />
      <Route path="/circuitos/nuevo" element={<FormCircuits />} />
      <Route path="/departamentos" element={<Departamentos/>} />
       <Route path="/localidades" element={<Localidades/>} />
       <Route path="/instituciones" element={<Instituciones/>} />
       <Route path="/supervisores" element={<Supervisores/>} />
    </Routes>
  );
}