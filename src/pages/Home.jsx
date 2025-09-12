import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Inicio</h1>
      <button onClick={() => navigate('/circuitos')}>Ir a Circuitos</button>
      <button onClick={() => navigate('/departamentos')}>Ir a Departamentos</button> 
      <button onClick={() => navigate('/localidades')}>Ir a localidades</button> 
      <button onClick={() => navigate('/instituciones')}>Ir a instituciones</button> 
      <button onClick={() => navigate('/supervisores')}>Ir supervisores</button> 
    </div>
  );
}