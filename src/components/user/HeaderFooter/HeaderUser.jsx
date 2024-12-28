import LogoFPT from "../../../assets/Imgs/LogoFPT.png";
import { useLocation } from "react-router-dom";

function HeaderUser() {
  const location = useLocation();
  const isStudentSchedulePage = location.pathname === "/studentSchedule";
  const isStudentDetailPage = location.pathname === "/studentDetail";
  const isDetailActivityPage = location.pathname === "/detail";
  const isHome = location.pathname === "/home";
  const isStudentActivityDetailPage = location.pathname === "/studentActivityDetail";
  const isStudentDetailClassPage = location.pathname === "/studentDetailClass";
  const isTeacherDetailClassPage = location.pathname === "/teacherDetailClass";
  return (
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
      {(!isHome) && (
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
                  {isStudentActivityDetailPage &&(
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                    / Chi tiết hoạt động
                    </span>
                  )}
                  {isStudentDetailClassPage &&(
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                    / Chi tiết lớp học
                    </span>
                  )}
                  {isTeacherDetailClassPage &&(
                    <span className="ml-2 text-[12px] sm:text-[16px] md:text-[24px] font-roboto">
                    / Chi tiết lớp học
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
              <a
                href="/studentDetail"
                className="text-[12px] sm:text-[16px] md:text-[24px] font-roboto no-underline hover:text-boldBlue hover:underline"
              >
                HoangNQCE170288
              </a>
              <p className="hidden sm:block mx-2 text-[6px] sm:text-[16px] md:text-[24px] font-roboto">
                |
              </p>
              <button className="bg-secondaryGreen text-white h-[25px] sm:h-[30px] px-4 text-[12px] sm:text-[14px] md:text-[16px] font-roboto border border-black rounded-md hover:bg-primaryGreen hover:scale-95">
                Đăng Xuất
              </button>
            </div>
          </div>
          {/* Navigation Bar End */}
        </div>
      )}
    </div>
  );
}

export default HeaderUser;
