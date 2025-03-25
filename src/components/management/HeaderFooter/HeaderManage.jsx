import Avatar from "../../../assets/Imgs/avatar.jpg";
import { Link, useLocation } from "react-router-dom";

function HeaderManage() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;

  return (
    <div className="mt-4 h-18 bg-white rounded-2xl flex flex-wrap items-center justify-between px-4 py-2">
      {/* Left section with the active path display */}
      <div className="flex items-center space-x-2">
        {isActive("/manageInformation") && (
          <>
            <i className="fa fa-address-card  w-4 h-4"></i>
            <p className="text-lg italic">Thông tin cá nhân</p>
          </>
        )}
        {isActive("/manageSchedule") && (
          <>
            <i className="fas fa-calendar-days w-4 h-4"></i>
            <p className="text-lg italic">Quản lý lịch học</p>
          </>
        )}
        {isActive("/manageExamSchedule") && (
          <>
            <i className="fa fa-calendar-day w-4 h-4"></i>
            <p className="text-lg italic">Quản lý lịch thi</p>
          </>
        )}
        {isActive("/manageClass") && (
          <>
            <i className="fa-solid fa-table-list w-4 h-4"></i>
            <p className="text-lg italic">Quản lý lớp học</p>
          </>
        )}
        {isActive("/manageRoom") && (
          <>
            <i className="fas fa-door-open w-4 h-4"></i>
            <p className="text-lg italic">Quản lý phòng học</p>
          </>
        )}
        {isActive("/manageSemester") && (
          <>
            <i className="fas fa-calendar-days w-4 h-4"></i>
            <p className="text-lg italic">Quản lý kỳ học</p>
          </>
        )}
        {isActive("/manageStudent") && (
          <>
            <i className="fas fa-user-graduate w-4 h-4"></i>
            <p className="text-lg italic">Quản lý sinh viên</p>
          </>
        )}
        {isActive("/manageTeacher") && (
          <>
            <i className="fas fa-chalkboard-teacher w-4 h-4"></i>
            <p className="text-lg italic">Quản lý giáo viên</p>
          </>
        )}
        {isActive("/manageSubject") && (
          <>
            <i className="fas fa-calendar-days w-4 h-4"></i>
            <p className="text-lg italic">Quản lý môn học</p>
          </>
        )}
        {isActive("/manageSlot") && (
          <>
            <i className="fa-regular fa-clock w-4 h-4"></i>
            <p className="text-lg italic">Quản lý buổi học</p>
          </>
        )}
      </div>

      {/* Right section with the avatar and logout */}
      <div className="flex items-center space-x-3">
        <Link to="/manageInformation">
          <img
            className="w-12 h-12 rounded-full hover:scale-95"
            src={Avatar}
            alt="Rounded avatar"
          />
        </Link>
        <div className="hidden md:block">
          <Link to="/manageInformation">
            <p className="font-bold hover:scale-95 hover:text-blue-700 hover:underline">
              Nguyễn Quốc Hoàng
            </p>
          </Link>
          <button
            type="button"
            className="bg-gray-300 px-3 py-0.5 rounded-full transition-all duration-300 hover:bg-gray-400 hover:scale-95"
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderManage;
