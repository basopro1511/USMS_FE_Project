import { useState, useRef, useEffect } from "react";
import { AddStudent } from "../../../services/studentService";
import { getMajors } from "../../../services/majorService";
import Avatar from "../../../assets/Imgs/avatar_square.jpg";
import { bool } from "prop-types";

// eslint-disable-next-line react/prop-types
function FormAddStudent({ onStudentAdded }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef(null);

  const [newStudent, setNewStudent] = useState({
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: bool,
    passwordHash: "123456789",
    email: "",
    personalEmail: "",
    phoneNumber: "",
    userAvartar: null,
    dateOfBirth: "",
    roleId: 5,
    majorId: "",
    status: 1,
    address: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [userAvartar, setuserAvartar] = useState(null);

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const updatedStudent = { ...newStudent, userAvartar }; // Cập nhật avatar vào newStudent
      const response = await AddStudent(updatedStudent); // Gọi API thêm sinh viên
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onStudentAdded(response.student);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleuserAvartarChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 10 * 1024 * 1024
    ) {
      // Limit file size to 10MB
      const reader = new FileReader();
      reader.onload = () => setuserAvartar(reader.result);
      reader.readAsDataURL(file);
    } else {
      setShowAlert("error");
      setErrorMessage("Please upload a valid image file (max size: 10MB)");
    }
  };

  // Fetch Data Major - Start
  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      const majorData = await getMajors(); //Lấy ra list room rtong database
      setMajorData(majorData.result);
    };
    fetchMajorData();
  }, []);
  //Fetch Data Major - End

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
                Thêm sinh viên
              </p>
              <form onSubmit={handleAddStudent}>
                <div className="flex items-start gap-8 my-6">
                  {/* Avartar Section */}
                  <div className="relative">
                    <img
                      src={userAvartar || Avatar}
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
                    {/* First Row: Name */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Họ:
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập họ"
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
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
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập tên đệm"
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
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
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Nhập tên"
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Second Row: majorId */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Chuyên ngành:
                      </label>
                      <select
                        value={newStudent.majorId}
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            majorId: e.target.value, // Cập nhật giá trị majorId trong state
                          })
                        }
                      >
                        <option value="" disabled selected>
                          Chọn chuyên ngành
                        </option>
                        {majorData.map((major) => (
                          <option key={major.majorId} value={major.majorId}>
                            {major.majorName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 ">
                        Giới tính:
                      </label>
                      <select
                        required
                        className="border rounded-md px-3 py-2 w-full"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            gender: JSON.parse(e.target.value), // Ép về boolean
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
                    {/* Third Row: Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email cá nhân:
                      </label>
                      <input
                        type="personalEmail"
                        required
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập email cá nhân"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            personalEmail: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Fourth Row: Phone Number */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số điện thoại:
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập số điện thoại"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Fifth Row: Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ngày sinh:
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full border rounded-md px-3 py-2"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Địa chỉ:
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Nhập địa chỉ"
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                  >
                    Thêm
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

export default FormAddStudent;
