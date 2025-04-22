import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../../assets/Imgs/avatar.jpg";
import { useEffect } from "react";
function HeaderAdmin() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;
  const navigate =useNavigate();

  //#region tu dong xoa token sau 1h
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && new Date().getTime() > expirationTime) {
        // Token hết hạn, xóa dữ liệu và chuyển về trang login
        localStorage.removeItem("userId");
        localStorage.removeItem("roleId");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/"); // 
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Kiểm tra mỗi phút
    return () => clearInterval(interval);
  }, [navigate]); 
  //#endregion

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("roleId");
      localStorage.removeItem("tokenExpiration");

    navigate("/");
  };
  
  return (
    <div className="mt-4 h-18 bg-white rounded-2xl flex flex-wrap items-center justify-between px-4 py-2">
      {/* Left section with the active path display */}
      <div className="flex items-center space-x-2">
      {isActive("/manageStaff") && (
          <>
            <i className="fas fa-chalkboard-teacher w-4 h-4"></i>
            <p className="text-lg italic">Quản lý nhân viên</p>
          </>
        )}
      </div>

      {/* Right section with the avatar and logout */}
      <div className="flex items-center space-x-3">
        <img
          className="w-12 h-12 rounded-full hover:scale-95"
          src={Avatar}
          alt="Rounded avatar"
        />
        <div className="hidden md:block">
          <p className="font-bold hover:scale-95 hover:text-blue-700 hover:underline">
          Administrator
          </p>
          <button
            type="button"
            className="bg-gray-300 px-3 py-0.5 rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-95"
            onClick={handleLogout}
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
