/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Avatar from "../../../assets/Imgs/avatar.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetUserByID } from "../../../services/userService";

function HeaderManage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung

  const [userData, setUserData] = useState(null);
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const navigate = useNavigate();

  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;
  const userId = localStorage.getItem("userId");

   //#region tu dong xoa token sau 1h
   useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && new Date().getTime() > expirationTime) {
        localStorage.removeItem("userId");
        localStorage.removeItem("roleId");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/"); 
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Kiểm tra mỗi 
    return () => clearInterval(interval);
  }, [navigate]); 
  //#endregion

  //#region  Lấy dữ liệu user từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetUserByID(userId); // Lấy ra data của user trong database
        setUserData(data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);
  if (!userData) {
    return <div>Loading...</div>;
  }
  //#endregion

  //#region Log Out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("tokenExpiration");
    navigate("/");
  };
  //#endregion

  return (
    <>
      {/* Thông báo Start */}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
              : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center">
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              {showAlert === "error" ? (
                <span>
                  <strong>Error:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Success:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Thông báo  End*/}
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
              <p className="text-lg italic">Quản lý học kỳ</p>
            </>
          )}   {location.pathname.includes("/studentInClass") && (
            <>
              <i className="fas fa-user-graduate w-4 h-4"></i>
              <p className="text-lg italic">Quản lý sinh viên trong lớp</p>
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
              src={userData.userAvartar || Avatar}
              alt="Rounded avatar"
            />
          </Link>
          <div className="hidden md:block">
            <Link to="/manageInformation">
              <p className="font-bold hover:scale-95 hover:text-blue-700 hover:underline">
                {userData.lastName +
                  " " +
                  userData.middleName +
                  " " +
                  userData.firstName}
              </p>
            </Link>
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
    </>
  );
}

export default HeaderManage;
