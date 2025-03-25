/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
function FormDetailStaff({ userDetail }) {
  const [userData, setUserData] = useState({
    userId: "",
    majorId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    createdAt: "",
    updatedAt: "",
    personalEmail: "",
    userAvartar: "",
  });

  // Cập nhật dữ liệu khi userDetail thay đổi
  useEffect(() => {
    if (userDetail) {
      console.log("Teacher Detail Received:", userDetail);
      setUserData({
        userId: userDetail.userId || "",
        majorId: userDetail.majorId || "",
        firstName: userDetail.firstName || "",
        middleName: userDetail.middleName || "",
        lastName: userDetail.lastName || "",
        email: userDetail.email || "",
        phoneNumber: userDetail.phoneNumber || "",
        dateOfBirth: userDetail.dateOfBirth || "",
        createdAt: userDetail.createdAt || "",
        updatedAt: userDetail.updatedAt || "",
        personalEmail: userDetail.personalEmail || "",
        userAvartar: userDetail.userAvartar || "",
      });
    }
  }, [userDetail]);

  const [isFormVisible, setIsFormVisible] = useState(true);
  const handleCancel = () => {
    setIsFormVisible(false);
  };
  return (
    <>
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Xem chi tiết nhân viên
              </p>
              <form className="flex flex-col items-center gap-4 mt-8">
                <div className="flex gap-8">
                  <div>
                    <div className="mb-4">
                      <img
                        src={
                          userData.userAvartar
                            ? userData.userAvartar
                            : "https://res.cloudinary.com/djvanrbcm/image/upload/v1740591518/i3qeccbtpgefqa03iho7.jpg"
                        }
                        alt="Upload Preview"
                        className="w-[180px] h-[220px] object-cover rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Mã số nhân viên:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={userData.userId}
                        />
                      </div>
                      <div>
                        <p className="text-left">Giới tính:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-[100px] h-[40px] border border-gray-300 rounded-md px-3"
                          value={userData.gender ? "Nữ" : "Nam"}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Họ:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={userData.lastName}
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên đệm:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={userData.middleName}
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={userData.firstName}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-left">Email:</p>
                      <input
                        type="email"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={userData.email}
                      />
                    </div>
                    <div>
                      <p className="text-left">Email cá nhân:</p>
                      <input
                        type="email"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={userData.personalEmail}
                      />
                    </div>
                    <div>
                      <p className="text-left">Số điện thoại:</p>
                      <input
                        type="text"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={userData.phoneNumber}
                      />
                    </div>
                    <div>
                      <p className="text-left">Ngày sinh:</p>
                      <input
                        type="date"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={userData.dateOfBirth}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-8 mt-3 mb-8">
                  <button
                    type="button"
                    className="w-[150px] h-[50px] bg-[#508696] text-white rounded-md font-bold"
                    onClick={handleCancel}
                  >
                    Quay lại
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormDetailStaff;
