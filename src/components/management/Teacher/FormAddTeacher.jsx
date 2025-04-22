/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { AddTeacher } from "../../../services/TeacherService";
import Avatar from "../../../assets/Imgs/avatar_square.jpg";
import { bool } from "prop-types";

function FormAddStudent({ onReaload }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const fileInputRef = useRef(null);

  const [newTeacher, setNewTeacher] = useState({
    userId:"",
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
    roleId: 4,
    majorId: "",
    status: 1,
    address: "", // Thêm lại field địa chỉ
  });

  const [userAvartar, setuserAvartar] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
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
  
  const handleCancel = () => {
    setIsFormVisible(false); 
  };

  const handleuserAvartarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setuserAvartar(reader.result);
      reader.readAsDataURL(file);
    } else {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn ảnh có dung lượng tối đa 10MB");
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const updatedTeacher = { ...newTeacher, userAvartar };
      const response = await AddTeacher(updatedTeacher);
      if (response.isSuccess) {
        onReaload(response.data);
        setIsFormVisible(false); 
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000); 
      } else {
        setIsFormVisible(true); 
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thêm giáo viên:", error);
    } 
  };

  return (
    <>
        {/* Notification Start */}
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
                    <strong>Thất bại:</strong> {errorMessage}
                  </span>
                ) : (
                  <span>
                    <strong>Thành công:</strong> {successMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </>
      {/* Notification End */}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[750px] h-auto rounded-2xl shadow-xl p-6">
            <p className="font-bold text-3xl text-secondaryBlue text-center">Thêm mới giáo viên</p>
            <form onSubmit={handleAddTeacher}>
              <div className="flex items-start gap-8 my-6">
                {/* Avatar Section */}
                <div className="relative">
                  <img src={userAvartar||Avatar} alt="Avatar" className="w-[180px] h-[220px] object-cover rounded-md" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleuserAvartarChange} ref={fileInputRef} />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="w-full bg-[#2B559B] text-white font-bold text-sm rounded-md mt-2 py-2">
                    Upload
                  </button>
                </div>
                {/* Input Fields */}
                <div className="flex-1 grid gap-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" required placeholder="Nhập họ" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })} />
                    <input type="text" placeholder="Nhập tên đệm" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, middleName: e.target.value })} />
                    <input type="text" required placeholder="Nhập tên" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })} />
                  </div>  
                  {/* Major Selection */}
                  <select required className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, majorId: e.target.value })}>
                    <option value="">Chọn chuyên ngành</option>
                    {majorData.map((major) => (
                      <option key={major.majorId} value={major.majorId}>
                        {major.majorName}
                      </option>
                    ))}
                  </select>

                  <select required className="border rounded-md px-3 py-2" 
                  onChange={(e) => setNewTeacher({ ...newTeacher,gender: JSON.parse(e.target.value),
                  })}>
                 <option value="" disabled>Chọn giới tính</option>
                  <option value="false">Nam</option>
                 <option value="true">Nữ</option>
                  </select>

                  {/* Other Fields */}
                  <input type="email" required placeholder="Nhập email cá nhân" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, personalEmail: e.target.value })} />
                  <input type="text" required placeholder="Nhập số điện thoại" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, phoneNumber: e.target.value })} />
                  <input type="text"  placeholder="Nhập địa chỉ" className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, address: e.target.value })} />
                  <input type="date" required className="border rounded-md px-3 py-2" onChange={(e) => setNewTeacher({ ...newTeacher, dateOfBirth: e.target.value })} />
                  {/* Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button type="submit" className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold hover:scale-105">
                      {"Thêm"}
                    </button>
                    <button type="button" className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold hover:scale-105" onClick={handleCancel}>
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FormAddStudent;
