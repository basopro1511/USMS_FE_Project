/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { UpdateStudent } from "../../../services/studentService";
import { getMajors } from "../../../services/majorService";

function FormUpdateStudent({ studentToUpdate, onStudentUpdated }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const fileInputRef = useRef(null); // Sử dụng useRef để tham chiếu đến input file

  const [studentData, setStudentData] = useState({
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
    roleId: 5,
    majorId: "",
    status: 1,
    address: "",
    term: 1,
  });

  useEffect(() => {
    if (studentToUpdate) {
      setStudentData(studentToUpdate);
    }
  }, [studentToUpdate]);

  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const majorData = await getMajors();
        setMajorData(majorData.result || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên ngành:", error);
      }
    };
    fetchMajorData();
  }, []);

  const [userAvartar, setuserAvartar] = useState(null);
  const handleUserAvartarChange = (e) => {
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

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const updatedTeacher = { ...studentData, userAvartar };
      const response = await UpdateStudent(updatedTeacher);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
        onStudentUpdated(response.data);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(true);
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage("Lỗi khi cập nhật sinh viên");
      console.error("Error updating teacher:", error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const statusMapping = {
    0: "Vô hiệu hóa",
    1: "Đang học tiếp",
    2: "Đang tạm hoãn",
    3: "Đã tốt nghiệp",
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
          <div className="bg-white border w-full max-w-[750px] h-auto rounded-2xl items-center shadow-xl p-6">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-secondaryBlue text-center">
                Cập nhật sinh viên
              </p>
              <form onSubmit={handleUpdateStudent}>
                <div className="flex items-start gap-8 my-6">
                  {/* Avatar Section */}
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
                      onChange={handleUserAvartarChange}
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

                  {/* Input Section */}
                  <div className="flex-1 grid gap-4">
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
                            setStudentData({
                              ...studentData,
                              userId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        {/* Major Selection */}
                        <p className="text-left">Chuyên ngành:</p>
                        <select
                          required
                          className="border rounded-md px-3 py-2  h-[40px] "
                          value={studentData.majorId}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              majorId: e.target.value,
                            })
                          }
                        >
                          <option value="">Chọn chuyên ngành</option>
                          {majorData.map((major) => (
                            <option key={major.majorId} value={major.majorId}>
                              {major.majorName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        {/* Major Selection */}
                        <p className="text-left">Giới tính:</p>
                        <select
                          required
                          className="border rounded-md px-3 py-2 h-[40px] w-[100px]"
                          value={studentData.gender}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              gender: e.target.value === "true",
                            })
                          }
                        >
                          <option value="" disabled>
                            Chọn giới tính
                          </option>
                          <option value="false">Nam</option>
                          <option value="true">Nữ</option>
                        </select>
                      </div>
                    </div>
                    {/* Student Name */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Họ:
                        </label>
                        <input
                          type="text"
                          required
                          value={studentData.lastName}
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập họ"
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Tên đệm:
                        </label>
                        <input
                          type="text"
                          value={studentData.middleName}
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập tên đệm"
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              middleName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Tên:
                        </label>
                        <input
                          type="text"
                          required
                          value={studentData.firstName}
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập tên"
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email cá nhân:
                      </label>
                      <input
                        type="personalEmail"
                        required
                        value={studentData.personalEmail}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập email"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            personalEmail: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số điện thoại:
                      </label>
                      <input
                        type="text"
                        required
                        value={studentData.phoneNumber}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập số điện thoại"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ngày sinh:
                      </label>
                      <input
                        type="date"
                        required
                        value={studentData.dateOfBirth}
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Term
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Kì học:
                      </label>
                      <select
                        value={studentData.term}
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            term: parseInt(e.target.value),
                          })
                        }
                      >
                        <option value="">Chọn kì học</option>
                        {[...Array(9).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div> */}
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Địa chỉ:
                      </label>
                      <input
                        type="text"
                        required
                        value={studentData.address}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập địa chỉ"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Trạng thái:
                      </label>
                      <select
                        value={studentData.status}
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
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

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
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

export default FormUpdateStudent;
