/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { UpdateStaff } from "../../../services/staffService";

function FormUpdateStaff({ teacherToUpdate, onReaload }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const fileInputRef = useRef(null); // Sử dụng useRef để tham chiếu đến input file

  const [teacherData, setTeacherData] = useState({
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
    roleId: 2,
    majorId: "",
    status: 1,
    address: "",
  });

  useEffect(() => {
    if (teacherToUpdate) {
      setTeacherData(teacherToUpdate);
    }
  }, [teacherToUpdate]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {    
        const updatedTeacher = { ...teacherData, userAvartar };
        updatedTeacher.majorId= "";
      const response = await UpdateStaff(updatedTeacher); // Giả sử đây là API gọi để cập nhật thông tin giáo viên
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
  const statusMapping = {
    0: "Vô hiệu hóa",
    1: "Đang khả dụng",
    2: "Đang tạm hoãn",
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
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Cập Nhật Nhân Viên
              </p>
              <form
                onSubmit={handleUpdate}
                className="flex flex-col items-center gap-4 mt-8"
              >
                <div className="flex gap-8">
                  <div>
                    <div className="mb-4">
                     <img src={userAvartar ||teacherData.userAvartar} alt="Avatar" className="w-[180px] h-[220px] object-cover rounded-md" />
                     
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleuserAvartarChange}
                        ref={fileInputRef}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full bg-[#2B559B] text-white font-bold text-sm rounded-md mt-2 py-2"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Mã số nhân viên:</p>
                        <input
                          type="text"
                          required
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.userId}
                          onChange={(e) =>
                            setTeacherData({
                              ...teacherData,
                              teacherId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        {/* Major Selection */}
                        <p className="text-left">Giới tính:</p>
                        <select
                          required
                          className="border rounded-md px-3 py-2 h-[40px]"
                          value={teacherData.gender}
                          onChange={(e) =>
                            setTeacherData({
                              ...teacherData,
                              gender: e.target.value === 'true' // ép kiểu boolean
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
                          required
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.lastName}
                          onChange={(e) =>
                            setTeacherData({
                              ...teacherData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên đệm:</p>
                        <input
                          type="text"
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.middleName}
                          onChange={(e) =>
                            setTeacherData({
                              ...teacherData,
                              middleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên:</p>
                        <input
                          type="text"
                          required
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.firstName}
                          onChange={(e) =>
                            setTeacherData({
                              ...teacherData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-left">Email:</p>
                      <input
                        type="email"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={teacherData.email}
                        onChange={(e) =>
                          setTeacherData({
                            ...teacherData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Lưu ẩn mật khẩu */}
                    <input
                      type="passwordHash"
                      hidden
                      value={teacherData.passwordHash}
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
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
                        value={teacherData.personalEmail}
                        onChange={(e) =>
                          setTeacherData({
                            ...teacherData,
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
                        value={teacherData.phoneNumber}
                        onChange={(e) =>
                          setTeacherData({
                            ...teacherData,
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
                        value={teacherData.dateOfBirth}
                        onChange={(e) =>
                          setTeacherData({
                            ...teacherData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <p className="text-left">Trạng thái</p>
                      <select
                        value={teacherData.status}
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setTeacherData({
                              ...teacherData,
                              status: parseInt(e.target.value),
                            })
                          }
                      >
                        {Object.entries(statusMapping).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-8 mt-8 mb-8">
                  <button
                    type="submit"
                    className="w-[150px] h-[50px] bg-secondaryBlue text-white rounded-md font-bold"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="w-[150px] h-[50px] bg-red-500 text-white rounded-md font-bold"
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

export default FormUpdateStaff;
