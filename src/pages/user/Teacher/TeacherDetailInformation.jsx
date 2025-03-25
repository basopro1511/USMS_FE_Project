import { useEffect, useState } from "react";
import AvatarSquare from "../../../assets/Imgs/avatar_square.jpg";
import { GetUserByID } from "../../../services/userService";
import FormUpdateTeacherPersonalInformation from "../../../components/user/Teacher/FormUpdateTeacherInfomation";

function TeacherDetailInformation() {
  const [studentData, setStudentData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [infoToUpdate, setInfoToUpdate] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await GetUserByID("BichTT"); //Lấy ra data của user  trong database
      setStudentData(data.result);
    };
    fetchUserData();
  }, []);

  // Xử lý trường hợp chưa có dữ liệu
  if (!studentData) {
    return <div>Loading...</div>;
  }

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleUpdateClick = (userData) => {
    setInfoToUpdate(userData);
    toggleShowForm(); // Show form update
  };
  const handleReload = async () => {
    const data = await await GetUserByID("BichTT"); // Gọi API để lấy lại tất cả các phòng
    setStudentData(data.result); // Cập nhật lại dữ liệu phòng
  };

  return (
    <div className="w-full mt-4 mx-auto">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Thông tin giáo viên
        </h1>
        <div className="flex flex-col md:flex-row mt-6">
          {/* Avatar Start */}
          <div className="flex flex-col items-center ml-auto mr-12 text-left">
            <img
              className="w-[180px] h-[220px] rounded mb-5"
              src={studentData.userAvartar || AvatarSquare}
              alt="Avatar"
            />
          </div>
          {/* Avatar End */}

          <div className="flex flex-col md:flex-row md:mr-auto">
            {/* Left Side Start */}
            <div className="w-full md:w-[490px] text-left text-gray-600 text-sm font-medium mb-4">
              <div className="flex flex-col md:flex-row mb-4">
                <div className="flex-1 md:mr-4">
                  <label>Họ</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={studentData.firstName}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <label>Tên đệm</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={studentData.middleName}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Email cơ sở</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={studentData.email}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Chuyên ngành</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={studentData.majorId}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={studentData.phoneNumber}
                  readOnly
                />
              </div>
              <button
                className="w-[160px] text-white bg-blue-600 border px-4 py-2 mt-4 rounded-md hover:bg-blue-400 hover:scale-95"
                onClick={() => handleUpdateClick(studentData)}
              >
                Cập nhật thông tin
              </button>
            </div>
            {/* Left Side End */}
            {/* Right Side Start */}
            <div className="w-full md:w-[490px] text-left text-gray-600 text-sm font-medium md:ml-8">
              <div className="flex flex-col md:flex-row mb-4">
                <div className="flex-1 md:mr-4">
                  <label>Tên</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={studentData.lastName}
                    readOnly
                  />
                </div>
                <div className="flex-1 md:mr-4">
                  <label>Mã số giáo viên</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={studentData.userId}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <label>Giới tính</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={studentData.gender ? "Nữ" : "Nam"}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Email cá nhân</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={studentData.personalEmail}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Ngày tháng năm sinh</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={new Date(studentData.dateOfBirth).toLocaleDateString(
                    "vi-VN"
                  )}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={studentData.address}
                  readOnly
                />
              </div>
            </div>{" "}
            {showForm && (
              <FormUpdateTeacherPersonalInformation
                infoToUpdate={infoToUpdate}
                onReaload={handleReload}
                onClose={toggleShowForm}
              />
            )}
            {/* Right Side End */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailInformation;
