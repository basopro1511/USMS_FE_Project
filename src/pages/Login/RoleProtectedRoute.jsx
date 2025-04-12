// src/components/RoleProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  // Giả sử roleId được lưu dưới dạng string trong localStorage
  const userRoleId = localStorage.getItem("roleId");
  // Nếu không có role hoặc role hiện tại không nằm trong danh sách allowedRoles
  // eslint-disable-next-line react/prop-types
  if (!userRoleId || !allowedRoles.includes(parseInt(userRoleId))) {
    // Chuyển hướng về trang thông báo hoặc trang đăng nhập
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RoleProtectedRoute;
