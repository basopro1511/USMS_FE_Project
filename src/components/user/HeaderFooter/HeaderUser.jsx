/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import LogoFPT from "../../../assets/Imgs/LogoFPT.png";
import { useLocation, useNavigate } from "react-router-dom";

function HeaderUser() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  const navigate = useNavigate();

  //#region  Login Data
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("roleId");
  //#endregion

  const location = useLocation();
  const isStudentSchedulePage = location.pathname === "/studentSchedule";
  const isStudentDetailPage = location.pathname === "/studentDetail";
  const isDetailActivityPage = location.pathname === "/detail";
  const isHome = location.pathname === "/home";
  const isStudentActivityDetailPage =
    location.pathname === "/studentActivityDetail";
  const isStudentDetailClassPage = location.pathname === "/studentDetailClass";
  const isStudentViewExamPage = location.pathname === "/studentViewExam";
  const isTeacherDetailClassPage = location.pathname === "/teacherDetailClass";
  const isTeacherViewExamPage = location.pathname === "/teacherViewExam";
  const isTeacherSendRequestPage = location.pathname === "/teacherSendRequest";

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
      <div className="w-screen h-auto">
        {/* Header start */}
        <div className="bg-secondaryGray h-auto mt-3 md:h-[86px] flex flex-col md:flex-row items-center px-4 sm:px-6 md:px-8">
          <img
            className="w-[100px] sm:w-[120px] md:w-[190px] h-auto mb-2 md:mb-0 md:ml-[8rem] md:mr-auto"
            src={LogoFPT}
            alt="FPT Logo"
          />
          <h1 className="text-center font-normal text-transparent md:text-black text-[16px] sm:text-[24px] md:text-[48px] mx-auto md:mr-[8rem] font-roboto">
            FPT University Academic Portal
          </h1>
        </div>
        {/* Header End */}
        {!isHome && (
          <div>
            {/* Navigation Bar Start */}
            <div className="mt-4 sm:mt-6 h-auto md:h-[60px] bg-secondaryGray flex flex-wrap md:flex-nowrap items-center px-4 sm:px-6 md:px-8">
              <div className="flex justify-center items-center h-auto md:h-[39px] w-full md:w-auto mb-2 md:mb-0 ">
                <p className="text-[12px] sm:text-[16px] md:text-[24px] font-roboto md:ml-[8rem]">
                  <a
                    href="/home"
                    className="text-boldBlue no-underline hover:underline hover:text-black hover:text-boldBlue "
                  >
                    Trang Chủ
                  </a>
                  {isStudentSchedulePage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Xem lịch học
                    </span>
                  )}
                  {isDetailActivityPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Chi Tiết Hoạt Động
                    </span>
                  )}
                  {isStudentDetailPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Thông tin cá nhân
                    </span>
                  )}
                  {location.pathname.includes("/studentActivityDetail") && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Chi tiết hoạt động
                    </span>
                  )}
                    {location.pathname.includes("/detailClass") && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Chi tiết lớp học
                    </span>
                  )}
                  {isStudentViewExamPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Xem lịch thi
                    </span>
                  )}
                  {isTeacherDetailClassPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Chi tiết lớp học
                    </span>
                  )}
                  {isTeacherViewExamPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Xem lịch gác thi
                    </span>
                  )}
                  {isTeacherSendRequestPage && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Gửi yêu cầu đổi lịch dạy
                    </span>
                  )}
                  {location.pathname === "/teacherSchedule" && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Xem lịch dạy hàng tuần
                    </span>
                  )}
                  {location.pathname === "/teacherDetail" && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Thông tin cá nhân
                    </span>
                  )}
                {location.pathname.includes("/teacherViewRequest") && (
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                      / Xem yêu cầu đã gửi
                    </span>
                  )}
                </p>
              </div>
              <div className="flex justify-center items-center h-auto md:h-[39px] w-full md:w-auto ml-auto md:mr-[8rem]">
                <div className="flex items-center">
                  <p className="text-[10px] sm:text-[16px] md:text-[24px] font-roboto">
                    Trường:
                  </p>
                  <p className="ml-2 text-[12px] sm:text-[18px] md:text-[24px] font-bold font-roboto">
                    FU-CT
                  </p>
                </div>
                <p className="hidden sm:block mx-2 text-[6px] sm:text-[16px] md:text-[24px] font-roboto">
                  |
                </p>
                {role === "4" && (
                  <a
                    href="/teacherDetail"
                    className="text-[12px] sm:text-[16px] md:text-[24px] font-roboto no-underline hover:text-boldBlue hover:underline"
                  >
                    {userId}
                  </a>
                )}
                {role === "5" && (
                  <a
                    href="/studentDetail"
                    className="text-[12px] sm:text-[16px] md:text-[24px] font-roboto no-underline hover:text-boldBlue hover:underline"
                  >
                    {userId}
                  </a>
                )}
                <p className="hidden sm:block mx-2 text-[6px] sm:text-[16px] md:text-[24px] font-roboto">
                  |
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-secondaryGreen text-white h-[25px] sm:h-[30px] px-4 text-[12px] sm:text-[14px] md:text-[16px] font-roboto border border-black rounded-md hover:bg-primaryGreen hover:scale-95"
                >
                  Đăng Xuất
                </button>
              </div>
            </div>
            {/* Navigation Bar End */}
          </div>
        )}
      </div>
    </>
  );
}

export default HeaderUser;
