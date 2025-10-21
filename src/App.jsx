import { useState } from "react";
import AppRoutes from "./Routes/route";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-dark text-light">
      <AppRoutes />
    </div>
  );
}

export default App;
