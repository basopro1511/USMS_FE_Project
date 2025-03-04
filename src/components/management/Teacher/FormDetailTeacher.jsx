/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";

// eslint-disable-next-line react/prop-types
function FormDetailTeacher({ teacherDetail }) {
  const [teacherData, setTeacherData] = useState({
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

  // Cập nhật dữ liệu khi teacherDetail thay đổi
  useEffect(() => {
    if (teacherDetail) {
      console.log("Teacher Detail Received:", teacherDetail);
      setTeacherData({
        userId: teacherDetail.userId || "",
        majorId: teacherDetail.majorId || "",
        firstName: teacherDetail.firstName || "",
        middleName: teacherDetail.middleName || "",
        lastName: teacherDetail.lastName || "",
        email: teacherDetail.email || "",
        phoneNumber: teacherDetail.phoneNumber || "",
        dateOfBirth: teacherDetail.dateOfBirth || "",
        createdAt: teacherDetail.createdAt || "",
        updatedAt: teacherDetail.updatedAt || "",
        personalEmail: teacherDetail.personalEmail || "",
        userAvartar: teacherDetail.userAvartar || "",
      });
    }
  }, [teacherDetail]);

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

  const [isFormVisible, setIsFormVisible] = useState(true);
  const handleCancel = () => {
    setIsFormVisible(false);
  };
  const foundMajor = majorData.find((m) => m.majorId === teacherData.majorId);
  const majorName = foundMajor ? foundMajor.majorName : teacherData.majorId;
  return (
    <>
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Xem Chi Tiết Giáo Viên
              </p>
              <form className="flex flex-col items-center gap-4 mt-8">
                <div className="flex gap-8">
                  <div>
                    <div className="mb-4">
                      <img
                        src={
                          teacherData.userAvartar
                            ? teacherData.userAvartar
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
                        <p className="text-left">Họ:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.lastName}
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên đệm:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.middleName}
                        />
                      </div>
                      <div>
                        <p className="text-left">Tên:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.firstName}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-left">Mã số Giáo Viên:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.userId}
                        />
                      </div>
                      <div>
                        <p className="text-left">Chuyên ngành:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={majorName}
                        />
                      </div>
                      <div>
                        <p className="text-left">Giới tính:</p>
                        <input
                          type="text"
                          readOnly
                          className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                          value={teacherData.gender ? "Nữ" : "Nam"}

                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-left">Email:</p>
                      <input
                        type="email"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={teacherData.email}
                      />
                    </div>
                    <div>
                      <p className="text-left">Email cá nhân:</p>
                      <input
                        type="email"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={teacherData.personalEmail}
                      />
                    </div>
                    <div>
                      <p className="text-left">Số điện thoại:</p>
                      <input
                        type="text"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={teacherData.phoneNumber}
                      />
                    </div>
                    <div>
                      <p className="text-left">Ngày sinh:</p>
                      <input
                        type="date"
                        readOnly
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        value={teacherData.dateOfBirth}
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

export default FormDetailTeacher;
