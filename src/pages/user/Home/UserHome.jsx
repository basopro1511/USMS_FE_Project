import { useEffect, useState } from "react";
import Avatar from "../../../assets/Imgs/avatar.jpg";
import { Link } from "react-router-dom";

function UserHome() {
  // Dung de check Role la Student hay la Teacher de hien thi nut bam tuong ung voi ROLE
  const role = "Student";

  //Chuyển image mỗi 5 giây
  const backgrounds = ["bg-bgHome1", "bg-bgHome2", "bg-bgHome3"];
  const [currentBg, setCurrentBg] = useState(0);
  // Tự động chuyển background mỗi 4 giây
  useEffect(() => {
    const time = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);

    return () => clearInterval(time); // Clear interval
  }, []);
  // Chuyển BG Home khi nhấn nút
  const handleBgChange = (index) => {
    setCurrentBg(index);
  };

  return (
    <div className="h-auto w-full sm:w-[1600px] m-auto bg-secondaryGray mt-6 mb-6 rounded-2xl overflow-hidden">
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
              src={Avatar}
              alt="Rounded avatar"
            />
          </div>
          <div className="ml-4 mt-5 w-auto">
            <p className="mb-4 font-bold text-xl sm:text-4xl">
              Xin chào, Nguyễn Quốc Hoàng
            </p>
            <p className="mb-4 font-semibold text-lg sm:text-3xl">
              HoangNQCE170288
            </p>
            <button className="border rounded-xl bg-tritenaryGreen w-[132px] h-[auto] p-2 hover:scale-95 hover:bg-primaryGreen hover:text-white text-sm sm:text-[20px] font-semibold">
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
        {role === "Teacher" ? (
          <>
            {/* Xem lịch dạy */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-calendar-days text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Xem lịch dạy</p>
              <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                Xem ngay
              </button>
            </div>

            {/* Xem lịch thi */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-calendar-day text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">
                Xem lịch gác thi
              </p>
              <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                Xem ngay
              </button>
            </div>

            {/* Xem thông tin  */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-address-card text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Xem thông tin</p>
              <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                Xem ngay
              </button>
            </div>

            {/* Gửi request */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa-solid fa-file text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Gửi đơn</p>
              <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                Xem ngay
              </button>
            </div>
          </>
        ) : (
          <>
            {/* View student schedule */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-calendar-days text-black text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Xem lịch học</p>
              <Link to="/studentSchedule">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
              </Link>
            </div>

            {/* View exam schedule */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-calendar-day text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Xem lịch thi</p>
              <Link to="/">
                <button className="border rounded-xl bg-tritenaryGreen w-[200px] h-[70px] p-2 hover:scale-90 hover:bg-primaryGreen hover:text-white text-[20px] font-semibold">
                  Xem ngay
                </button>
              </Link>
            </div>

            {/* View personal information */}
            <div className="w-full sm:w-[320px] h-[390px] border border-black mt-6 bg-white rounded-2xl text-center">
              <i className="fa fa-address-card text-[150px] mt-10"></i>
              <p className="font-bold text-[35px] mt-2 mb-2">Xem thông tin</p>
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
  );
}

export default UserHome;
