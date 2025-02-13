import { useEffect, useState } from "react";
import AvatarSquare from "../../../assets/Imgs/avatar_square.jpg";
import { GetUserByID } from "../../../services/userService";

function StudentDetail() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
     const fetchUserData = async () => {
       const data = await GetUserByID("SE0001"); //Lấy ra data của user  trong database
       setStudentData(data.result);
     };
     fetchUserData();
  }, []);

  // Xử lý trường hợp chưa có dữ liệu
  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mt-4 mx-auto">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Thông tin học sinh
        </h1>
        <div className="flex flex-col md:flex-row mt-6">
          {/* Avatar Start */}
          <div className="flex flex-col items-center ml-auto mr-12 text-left">
            <img
              className="w-[180px] h-[220px] rounded mb-5"
              src={studentData.userAvartar || AvatarSquare}
              alt="Avatar"
            />
            <p>Current Term No: 8</p>
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
                <label>Email học sinh</label>
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
                  value={studentData.majorName}
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
                  <label>Mã số sinh viên</label>
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
                    value="Nam" // Tùy chỉnh nếu API trả về gender
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
            </div>
            {/* Right Side End */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
