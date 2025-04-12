import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token);
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Tránh render quá sớm
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (isAuthenticated && location.pathname === "/") return children;
  return children;
};

export default ProtectedRoute;
