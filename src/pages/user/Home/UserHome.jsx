/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Avatar from "../../../assets/Imgs/avatar_square.jpg";
import { Link, useNavigate } from "react-router-dom";
import { GetUserByID } from "../../../services/userService";

function UserHome() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //#region  Login Data
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("roleId");
  //#endregion

  //#region  Lấy dữ liệu user từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetUserByID(userId); // Lấy ra data của user trong database
        setUserData(data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);
  //#endregion

  //#region  UI IMG Change
  const backgrounds = ["bg-bgHome1", "bg-bgHome2", "bg-bgHome3"];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const time = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(time);
  }, []);

  const handleBgChange = (index) => {
    setCurrentBg(index);
  };
  //#endregion

  // Nếu đang loading hoặc không có dữ liệu user, hiển thị UI loading (hoặc thông báo lỗi)
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  //#region Log Out
  const handleLogout = () => {
    setShowAlert(true);
    setShowAlert("success");
    setSuccessMessage("Đăng xuất thành công !");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("roleId");
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
      <div className="h-auto w-full sm:w-[1600px] m-auto bg-secondaryGray mt-2 mb-2 rounded-2xl overflow-hidden">
        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden">
          {/* Background Wrapper */}
          <div
            className="absolute flex h-full w-[300%] transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentBg * 33.34}%)` }}
          >
            {backgrounds.map((bg, index) => (
              <div
                key={index}
                className={`w-full h-full ${bg} bg-cover bg-[50%_60%]`}
              ></div>
            ))}
          </div>

          {/* Foreground Content */}
          <div className="absolute top-0 left-0 flex h-[220px] w-[90%] sm:w-[800px] border sm:ml-6 sm:mt-4 rounded-2xl bg-[#efefef] bg-opacity-80 z-10">
            <div>
              <img
                className="w-24 sm:w-44 h-24 sm:h-44 rounded-full mt-5 ml-5"
                src={userData.userAvartar || Avatar}
                alt="Rounded avatar"
              />
            </div>
            <div className="ml-4 mt-5 w-auto">
              <p className="mb-4 font-bold text-xl sm:text-4xl">
                Xin chào,{" "}
                {userData.lastName +
                  " " +
                  userData.middleName +
                  " " +
                  userData.firstName}
              </p>
              <p className="mb-4 font-semibold text-lg sm:text-3xl">{userId}</p>
              <button
                className="border rounded-xl bg-tritenaryGreen w-[132px] h-[auto] p-2 hover:scale-95 hover:bg-primaryGreen hover:text-white text-sm sm:text-[20px] font-semibold"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Background Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBgChange(index)}
                className={`w-4 h-4 rounded-full ${
                  currentBg === index
                    ? "bg-white border border-black"
                    : "bg-white bg-opacity-80"
                } transition-all duration-400`}
              ></button>
            ))}
          </div>
        </div>

        {/* Nút điều hướng - start */}
        <div className="flex flex-wrap justify-center gap-6 sm:h-[450px] sm:flex-nowrap">
          {role === "4" ? (
            <>
              {/* Xem lịch dạy */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-calendar-days text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem lịch dạy</p>
                <Link to="/teacherSchedule">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
                </Link>
              </div>

              {/* Xem lịch thi
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-calendar-day text-[150px] mt-10"></i>
                <p className="font-bold text-[35px] mt-2 mb-2">
                  Xem lịch gác thi
                </p>
                <Link to="/teacherViewExam">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
                </Link>
              </div> */}

              {/* Xem thông tin */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-address-card text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem thông tin</p>
                <Link to="/teacherDetail">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
                </Link>
              </div>

              {/* Gửi request */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa-regular fa-file text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Gửi đơn</p>
                <Link to="/teacherSendRequest">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
                </Link>
              </div>

              
              {/* Gửi request */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa-solid fa-file-export text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem đơn</p>
                <Link to="/teacherViewRequest">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* View student schedule */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-calendar-days text-black text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem lịch học</p>
                <Link to="/studentSchedule">
                  <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                    Xem ngay
                  </button>
                </Link>
              </div>

              {/* View exam schedule */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-calendar-day text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem lịch thi</p>
                <Link to="/studentViewExam">
                  <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                    Xem ngay
                  </button>
                </Link>
              </div>

              {/* View personal information */}
              <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
                <i className="fa fa-address-card text-[150px] mt-10"></i>
                <p className="font-bold text-[24px] mt-2 mb-2">Xem thông tin</p>
                <Link to="/studentDetail">
                  <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                    Xem ngay
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
        {/* Nút điều hướng - end */}
      </div>
    </>
  );
}

export default UserHome;
