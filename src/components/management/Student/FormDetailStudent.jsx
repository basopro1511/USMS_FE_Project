import { useEffect, useState, useRef } from "react";
import { getMajors } from "../../../services/majorService";

// eslint-disable-next-line react/prop-types
function FormDetailStudent({ studentDetail }) {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [studentData, setStudentData] = useState({
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    majorId: 0,
    email: "",
    phone: "",
    dateOfBirth: "",
    startYear: "",
    userAvartar: "",
    status: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const statusMapping = {
    0: "Vô hiệu hóa",
    1: "Đang học tiếp",
    2: "Đang tạm hoãn",
    3: "Đã tốt nghiệp",
  };
  useEffect(() => {
    if (studentDetail) {
      setStudentData(studentDetail);
    }
  }, [studentDetail]);

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      const majorData = await getMajors();
      setMajorData(majorData.result);
    };
    fetchMajorData();
  }, []);
  // Tìm majorName tương ứng
  const foundMajor = majorData.find((m) => m.majorId === studentData.majorId);
  const majorName = foundMajor ? foundMajor.majorName : studentData.majorId;

  return (
    <>
      {isFormVisible && (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white scale-95  border w-full max-w-[750px] h-auto rounded-2xl items-center shadow-xl p-4">
            <div className="flex">
              <button
                type="button"
                className="w-full max-w-[80px] h-[30px] sm:h-[40px] border rounded-xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 ml-auto mr-3"
                onClick={handleCancel}
              >
                X
              </button>
            </div>
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-secondaryBlue text-center">
              Chi tiết sinh viên
            </p>
            <form>
              <div className="flex items-start gap-8 my-6">
                {/* Avatar Section */}
                <div className="mb-4">
                  <img
                    src={
                      selectedImage ||
                      studentData.userAvartar ||
                      "/default-avatar.png"
                    }
                    alt="Avatar Preview"
                    className="w-[180px] h-[220px] object-cover rounded-md"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>

                {/* Input Section */}
                <div className="flex-1 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mã số sinh viên:
                      </label>
                      <input
                        readOnly
                        type="text"
                        value={studentData.userId}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Chuyên ngành:
                      </label>
                      <input
                        readOnly
                        type="text"
                        value={majorName}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Họ:
                      </label>
                      <input
                        readOnly
                        type="text"
                        value={studentData.lastName}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên đệm:
                      </label>
                      <input
                        readOnly
                        type="text"
                        value={studentData.middleName}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên:
                      </label>
                      <input
                        readOnly
                        type="text"
                        value={studentData.firstName}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email:
                    </label>
                    <input
                      readOnly
                      type="email"
                      value={studentData.email}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email cá nhân:
                    </label>
                    <input
                      readOnly
                      type="email"
                      value={studentData.personalEmail}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số điện thoại:
                    </label>
                    <input
                      readOnly
                      type="text"
                      value={studentData.phoneNumber}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày sinh:
                    </label>
                    <input
                      readOnly
                      type="date"
                      value={studentData.dateOfBirth}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Kì học:
                    </label>
                    <input
                      readOnly
                      type="text"
                      value={studentData.term}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trạng thái:
                    </label>
                    <input
                      readOnly
                      type="text"
                      value={statusMapping[studentData.status]}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Địa chỉ:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={studentData.address}
                      className="w-full border rounded-md px-3 py-2"
                    />
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

export default FormDetailStudent;
