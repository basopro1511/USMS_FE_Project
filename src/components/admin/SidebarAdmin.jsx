import { Link, useLocation } from "react-router-dom";
import LogoFPT from "../../assets/Imgs/LogoFPT.png";

function SidebarAdmin() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;

  return (
    <div className="p-4">
      <div className="w-64 h-screen border bg-white rounded-xl">
        {/* Logo */}
        <div className="flex justify-center mt-8">
          <img src={LogoFPT}  alt="Logo FPT" className="w-48" />
        </div>

        {/* Title */}
        <div className="mt-3">
          <h1 className="text-lg font-bold ml-2">Bảng điều khiển</h1>
          <ul>
            <Link to="/manageStaff">
            <li
                className={`flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 transition-all duration-300 ${isActive("/manageStaff")
                    ? "bg-quaternartyBlue pl-6"
                    : "hover:bg-quaternartyBlue hover:pl-6"
                  }`}
              >
                <i className="fas fa-chalkboard-teacher mr-2"></i>
                <span>Quản lý nhân viên</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
