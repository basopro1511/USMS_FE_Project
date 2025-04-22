import { useEffect, useState } from "react";
import { UpdateSemester } from "../../../services/semesterService";
// import { updateSemester } from "../../../services/semesterService"; // Gọi dịch vụ liên quan đến kỳ học

// eslint-disable-next-line react/prop-types
function FormUpdateSemester({ semesterToUpdate, onSemesterUpdated }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại

  const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
  const handleCancel = () => {
    setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
  };

  // Dữ liệu kỳ học
  const [semesterData, setSemesterData] = useState(
    semesterToUpdate || {
      semesterId: "",
      semesterName: "",
      startDate: "",
      endDate: "",
      status: 0,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    }
  );

  useEffect(() => {
    if (semesterToUpdate) {
      setSemesterData(semesterToUpdate);
    }
  }, [semesterToUpdate]);

  // Xử lý form Update
  const handleUpdateSemester = async (e) => {
    e.preventDefault();
    // Kiểm tra tên kỳ có đúng định dạng Fall, Summer, Spring + 4 số hay không
    const semesterNameRegex = /^(Fall|Summer|Spring)\d{4}$/;
    if (!semesterNameRegex.test(semesterData.semesterName)) {
      setShowAlert("error");
      setErrorMessage(
        "Tên kỳ học phải là Fall, Summer hoặc Spring + 4 chữ số (VD: Fall2023, Summer2024)."
      );
      setTimeout(() => setShowAlert(false), 3000); // Ẩn thông báo sau 3 giây
      return;
    }

    // Kiểm tra ngày bắt đầu phải trước ngày kết thúc
    const startDate = new Date(semesterData.startDate);
    const endDate = new Date(semesterData.endDate);

    // Kiểm tra xem ngày có hợp lệ không
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setShowAlert("error");
      setErrorMessage("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.");
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (startDate >= endDate) {
      setShowAlert("error");
      setErrorMessage("Ngày bắt đầu phải trước ngày kết thúc.");
      setTimeout(() => setShowAlert(false), 3000); // Ẩn thông báo sau 3 giây
      return;
    }

    try {
      const response = await UpdateSemester(semesterData); // Gọi API cập nhật kỳ học
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onSemesterUpdated(response.semester); // Trả về dữ liệu mới nhất cho trang ManageSemester để cập nhật lên bảng
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
        setIsFormVisible(false); // Ẩn form
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage(error);
      setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
      console.error("Error updating semester:", error);
    }
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  return (
    <>
      {/* Thông báo Start */}
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
      {/* Thông báo End */}

      {isFormVisible && ( // Chỉ hiển thị form nếu isFormVisible là true
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Cập nhật học kỳ
              </p>
              <form onSubmit={handleUpdateSemester}>
                <p className="text-left ml-[100px] text-xl mt-5">Mã học kỳ: </p>
                <input
                  readOnly
                  type="text"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                  value={semesterData.semesterId}
                  onChange={(e) =>
                    setSemesterData({
                      ...semesterData,
                      semesterId: e.target.value,
                    })
                  }
                />
                <p className="text-left ml-[100px] text-xl ">Tên học kỳ: </p>

                <input
                  type="text"
                  required
                  placeholder="Tên kỳ học"
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  value={semesterData.semesterName}
                  onChange={(e) =>
                    setSemesterData({
                      ...semesterData,
                      semesterName: e.target.value,
                    })
                  }
                />
                <p className="text-left ml-[100px] text-xl ">Ngày bắt đầu: </p>

                <input
                  type="date"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  value={semesterData.startDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isValidDate(value)) {
                      setShowAlert("error");
                      setErrorMessage("Ngày bắt đầu không hợp lệ.");
                      setTimeout(() => setShowAlert(false), 3000);
                      return;
                    }
                    setSemesterData({ ...semesterData, startDate: value });
                  }}
                />
                <p className="text-left ml-[100px] text-xl ">Ngày kết thúc: </p>
                <input
                  type="date"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  value={semesterData.endDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isValidDate(value)) {
                        setShowAlert("error");
                        setErrorMessage("Ngày kết thúc không hợp lệ.");
                        setTimeout(() => setShowAlert(false), 3000);
                        return;
                    }
                    setSemesterData({ ...semesterData, endDate: value });
                }}
                />
                <p className="text-left ml-[100px] text-xl ">Trạng thái: </p>
                <select
                  type="text"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  value={semesterData.status}
                  onChange={(e) =>
                    setSemesterData({ ...semesterData, status: e.target.value })
                  }
                >
                  <option value={1}>Đang diễn ra</option>
                  <option value={0}>Chưa bắt đầu</option>
                  <option value={2}>Đã kết thúc</option>
                </select>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button" // Sử dụng type="button" để ngừng việc submit form
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
                    onClick={handleCancel} // Ẩn form khi nhấn nút hủy
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

export default FormUpdateSemester;
