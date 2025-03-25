import { useState, useEffect } from "react";
import { GetUserByID } from "../../../services/userService";
import AvatarSquare from "../../../assets/Imgs/avatar_square.jpg";
import FormUpdateInformation from "../../../components/management/PersonalInformation/FormUpdateInformation";

function PersonalInformation() {
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [infoToUpdate, setInfoToUpdate] = useState(null);

  //#region Fetch Data
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await GetUserByID("AnhVN"); //Lấy ra data của user  trong database
      setUserData(data.result);
    };
    fetchUserData();
  }, []);
  // Xử lý trường hợp chưa có dữ liệu
  if (!userData) {
    return <div>Loading...</div>;
  }
  //#endregion
  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleUpdateClick = (userData) => {
    setInfoToUpdate(userData);
    toggleShowForm(); // Show form update
  };
  const handleReload = async () => {
    const data = await await GetUserByID("AnhVN"); // Gọi API để lấy lại tất cả các phòng
    setUserData(data.result); // Cập nhật lại dữ liệu phòng
  };

  return (
    <>
      {" "}
      <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
        <div className="flex justify-center">
          <p className="mt-8 text-3xl font-bold">Thông tin cá nhân</p>
        </div>
        <div className="flex flex-col md:flex-row mt-6">
          {/* Avatar Start */}
          <div className="flex flex-col items-center ml-auto mr-12 text-left">
            <img
              className="w-[180px] h-[220px] rounded mb-5"
              src={userData.userAvartar || AvatarSquare}
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
                    value={userData.firstName}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <label>Tên đệm</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={userData.middleName}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Email nhân viên</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={userData.email}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={userData.phoneNumber}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={userData.address}
                  readOnly
                />
              </div>
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
                    value={userData.lastName}
                    readOnly
                  />
                </div>
                <div className="flex-1 md:mr-4">
                  <label>Mã số nhân viên</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={userData.userId}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <label>Giới tính</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                    value={userData.gender ? "Nữ" : "Nam"}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Email cá nhân</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={userData.personalEmail}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label>Ngày tháng năm sinh</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                  value={new Date(userData.dateOfBirth).toLocaleDateString(
                    "vi-VN"
                  )}
                  readOnly
                />
              </div>
              <button
                className="w-[160px] text-white bg-blue-600 border px-4 py-2 mt-6 rounded-md hover:bg-blue-400 hover:scale-95"
                onClick={() => handleUpdateClick(userData)}
              >
                Cập nhật thông tin
              </button>
            </div>
            {/* Right Side End */}
          </div>
        </div>
      </div>
      {showForm && (
        <FormUpdateInformation
          infoToUpdate={infoToUpdate}
          onReaload={handleReload}
          onClose={toggleShowForm}

        />
      )}
    </>
  );
}

export default PersonalInformation;
