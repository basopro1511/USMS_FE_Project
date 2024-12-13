import LogoFPT from "../../../assets/Imgs/LogoFPT.png";
import { Link, useLocation } from "react-router-dom";

function SidebarManage() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ maxWidth: false }} className="p-4">
      <div className="w-64 h-screen border bg-white rounded-xl">
        {/* Logo */}
        <div className="flex justify-center mt-8">
          <img src={LogoFPT} alt="Logo FPT" className="w-48" />
        </div>

        {/* Title */}
        <div className=" mt-3">
          <h1 className="text-lg font-bold ml-2">Bảng điều khiển</h1>
          <ul className="">
            <Link to="/manageSchedule">
              <li
                className={`flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 transition-all duration-300 ${
                  isActive("/manageClass") ? "bg-quaternarty pl-6 " : "hover:bg-quaternarty hover:pl-6"}`} >
                <i className="fas fa-th-large mr-2"></i>
                <span>Quản lý lớp</span>
              </li>
            </Link>
            <Link to="/">
              <li className="flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-book mr-2"></i>
                <span>Quản lý môn</span>
              </li>
            </Link>
            <Link to="/">
              <li className="flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-calendar-alt mr-2"></i>
                <span>Quản lý kì học</span>
              </li>
            </Link>

            <Link to="/">
              <li className="flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-door-open  mr-2"></i>
                <span>Quản lý phòng học</span>
              </li>
            </Link>

            <Link to="/manageSchedule">
              <li
                className={`flex items-center cursor-pointer w-56 mb-2 ml-2 rounded-lg p-2 transition-all duration-300 ${
                  isActive("/manageSchedule") ? "bg-quaternarty pl-6 ": "hover:bg-quaternarty hover:pl-6"}`}>
                <i className="fas fa-calendar mr-2"></i>
                <span>Quản lý lịch học</span>
              </li>
            </Link>
            <Link to="/">
              <li className="flex items-center cursor-pointer  w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-user-graduate mr-2"></i>
                <span>Quản lý sinh viên</span>
              </li>
            </Link>
            <Link to="/">
              <li className="flex items-center cursor-pointer  w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-chalkboard-teacher mr-2"></i>
                <span>Quản lý giáo viên</span>
              </li>
            </Link>
            <Link to="/">
              <li className="flex items-center cursor-pointer  w-56 mb-2 ml-2 rounded-lg p-2 hover:bg-quaternarty hover:pl-6 transition-all duration-300">
                <i className="fas fa-bell mr-2"></i>
                <span>Quản lý thông báo</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SidebarManage;
