import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Dashboard, Auth } from "@/layouts";
import 'leaflet/dist/leaflet.css';


function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />}
      />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}
export default App;

