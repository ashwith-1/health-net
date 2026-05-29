import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Relatives from "./pages/Relatives";
import Hospitals from "./pages/Hospitals";

import ProtectedRoute from "./components/Protected";

function App() {
  return (
    <Routes>

      {/* ✅ LOGIN (ONLY ONE) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* 🔒 PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/relatives"
        element={
          <ProtectedRoute>
            <Relatives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <Hospitals />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;