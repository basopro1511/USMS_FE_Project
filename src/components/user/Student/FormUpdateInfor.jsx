/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { UpdateStudent } from "../../../services/studentService";

function FormUpdateStudentPersonalInformation({ infoToUpdate, onReaload }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const fileInputRef = useRef(null); // Sử dụng useRef để tham chiếu đến input file
  const [studentData, setstudentData] = useState({
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: true,
    passwordHash: "",
    email: "",
    personalEmail: "",
    phoneNumber: "",
    userAvartar: null,
    dateOfBirth: "",
    roleId: 4,
    majorId: "",
    status: 1,
    address: "",
  });

  useEffect(() => {
    if (infoToUpdate) {
      setstudentData(infoToUpdate);
    }
  }, [infoToUpdate]);

  const [userAvartar, setuserAvartar] = useState(null);
  const handleuserAvartarChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 10 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = () => setuserAvartar(reader.result);
      reader.readAsDataURL(file);
    } else {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn ảnh có dung lượng tối đa 10MB");
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const updatedStaff = { ...studentData, userAvartar };
      const response = await UpdateStudent(updatedStaff); // Giả sử đây là API gọi để cập nhật thông tin giáo viên
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
        onReaload(response.data);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(true);
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };
  return (
    <>
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
              : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center">
            <div>
              {showAlert === "error" ? (
                <span>
                  <strong>Lỗi:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Thành Công:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-blue-700">
                Cập Nhật Thông Tin
              </p>
              <form
                onSubmit={handleUpdateTeacher}
                className="flex flex-col items-center gap-4 mt-8"
              >
                <div className="flex gap-8">
                  <div>
                    <div className="mb-4">
                      <img
                        src={userAvartar || studentData.userAvartar}
                        alt="Avatar"
                        className="w-[180px] h-[220px] object-cover rounded-md"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleuserAvartarChange}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Mã số sinh viên:</p>
                        <input
                          type="text"
                          required
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={studentData.userId}
                          onChange={(e) =>
                            setstudentData({
                              ...studentData,
                              teacherId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        {/* Major Selection */}
                        <p className="text-left">Giới tính:</p>
                        <select
                          readOnly
                          disabled
                          className="border rounded-md px-3 py-2 h-[40px]"
                          value={studentData.gender}
                          onChange={(e) =>
                            setstudentData({
                              ...studentData,
                              gender: e.target.value, // ép kiểu boolean luôn
                            })
                          }
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="false">Nam</option>
                          <option value="true">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Họ:</p>
                        <input
                          type="text"
                          readOnly
                          required
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={studentData.lastName}
                          onChange={(e) =>
                            setstudentData({
                              ...studentData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên đệm:</p>
                        <input
                          readOnly
                          type="text"
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={studentData.middleName}
                          onChange={(e) =>
                            setstudentData({
                              ...studentData,
                              middleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên:</p>
                        <input
                        readOnly
                          type="text"
                          required
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={studentData.firstName}
                          onChange={(e) =>
                            setstudentData({
                              ...studentData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Lưu ẩn mật khẩu */}
                    <input
                      type="passwordHash"
                      hidden
                      value={studentData.passwordHash}
                      onChange={(e) =>
                        setstudentData({
                          ...studentData,
                          passwordHash: e.target.value,
                        })
                      }
                    />
                    {/* Lưu ẩn mật khẩu */}
                    <div>
                      <p className="text-left">Email cá nhân:</p>
                      <input
                        type="email"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={studentData.personalEmail}
                        onChange={(e) =>
                          setstudentData({
                            ...studentData,
                            personalEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <p className="text-left">Số điện thoại:</p>
                      <input
                        type="text"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={studentData.phoneNumber}
                        onChange={(e) =>
                          setstudentData({
                            ...studentData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <p className="text-left">Ngày sinh:</p>
                      <input
                        type="date"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={studentData.dateOfBirth}
                        onChange={(e) =>
                          setstudentData({
                            ...studentData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <p className="text-left">Địa chỉ</p>
                      <input
                        type="text"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={studentData.address}
                        onChange={(e) =>
                          setstudentData({
                            ...studentData,
                            address: e.target.value,
                          })
                        }
                      />{" "}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-8 mt-8 mb-8">
                  <button
                    type="submit"
                    className="w-[150px] h-[50px] bg-blue-700 hover:bg-blue-900 hover:scale-95 text-white rounded-md font-bold"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="w-[150px] h-[50px] bg-red-500  hover:bg-red-900 hover:scale-95 text-white rounded-md font-bold"
                    onClick={handleCancel}
                  >
                    Hủy
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

export default FormUpdateStudentPersonalInformation;
