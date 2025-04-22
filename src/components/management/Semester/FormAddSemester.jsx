import { useState, useEffect } from "react";
import { AddSemester } from "../../../services/semesterService";

// eslint-disable-next-line react/prop-types
function FormAddSemester({ onSemesterAdded }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification

  // State mới cho kỳ học được tạo tự động
  const [newSemester, setNewSemester] = useState({
    semesterId: "",
    semesterName: "",
    startDate: "",
    endDate: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Các state để chọn mùa và năm
  const [selectedSeason, setSelectedSeason] = useState("Spring");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Khi season hoặc year thay đổi thì tự động cập nhật newSemester
  useEffect(() => {
    if (selectedSeason && selectedYear) {
      const yearStr = selectedYear.toString();
      const lastTwoDigits = yearStr.substring(yearStr.length - 2);
      let semesterId, semesterName, startDate, endDate;
      switch (selectedSeason) {
        case "Spring":
          semesterId = "SP" + lastTwoDigits;
          semesterName = "Spring" + selectedYear;
          startDate = `${selectedYear}-01-01`;
          endDate = `${selectedYear}-04-30`;
          break;
        case "Summer":
          semesterId = "SU" + lastTwoDigits;
          semesterName = "Summer" + selectedYear;
          startDate = `${selectedYear}-05-01`;
          endDate = `${selectedYear}-08-31`;
          break;
        case "Fall":
          semesterId = "FA" + lastTwoDigits;
          semesterName = "Fall" + selectedYear;
          startDate = `${selectedYear}-09-01`;
          endDate = `${selectedYear}-12-31`;
          break;
        default:
          break;
      }
      setNewSemester((prev) => ({
        ...prev,
        semesterId,
        semesterName,
        startDate,
        endDate,
      }));
    }
  }, [selectedSeason, selectedYear]);

  const [isFormVisible, setIsFormVisible] = useState(true); // State to control form visibility
  const handleCancel = () => {
    setIsFormVisible(false); // Hide form when cancel is clicked
  };

  // Handle form AddSemester
  const handleAddSemester = async (e) => {
    e.preventDefault();

    // Validation: có thể bổ sung thêm nếu cần (ví dụ kiểm tra startDate < endDate, …)
    // Ở đây dựa theo dữ liệu tự tạo nên không cần validate lại định dạng (mã kỳ, tên kỳ) vì đã đảm bảo qua useEffect.
    // Cần xác nhận rằng selectedSeason và selectedYear đã được chọn hợp lệ.
    if (!selectedSeason || !selectedYear) {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn đầy đủ mùa và năm.");
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    console.log("Thêm kỳ học thành công", newSemester);
    try {
      const response = await AddSemester(newSemester); // Gọi API thêm kỳ học
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onSemesterAdded(response.semester); // Trả về dữ liệu mới nhất để cập nhật bảng
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage("Có lỗi xảy ra khi thêm kỳ học.");
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error adding semester:", error);
    }
  };

  return (
    <>
      {/* Notification Start */}
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
                  <strong>Error:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Success:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Notification End */}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl shadow-xl p-6">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8  text-secondaryBlue text-center">
                Thêm học kỳ
              </p>
              <form onSubmit={handleAddSemester} className="ml-16">
                {/* Chọn mùa */}
                <p className="text-left  text-xl mt-5">Chọn mùa:</p>
                <select
                  required
                  value={selectedSeason}
                  className="w-full max-w-[500px] h-[50px] border border-black rounded-xl mb-3 px-4"
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                </select>

                {/* Chọn năm */}
                <p className="text-left text-xl">Chọn năm:</p>
                <input
                  type="number"
                  required
                  value={selectedYear}
                  className="w-full max-w-[500px] h-[50px] border border-black rounded-xl mb-3 px-4"
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                />

                {/* Hiển thị các field tự động (read-only) */}
                <p className="text-left text-xl">Mã học kỳ:</p>
                <input
                  type="text"
                  readOnly
                  value={newSemester.semesterId}
                  className="w-full max-w-[500px] h-[50px] border border-gray-300 rounded-xl mb-3 px-4 bg-gray-100"
                />

                <p className="text-left text-xl">Tên học kỳ:</p>
                <input
                  type="text"
                  readOnly
                  value={newSemester.semesterName}
                  className="w-full max-w-[500px] h-[50px] border border-gray-300 rounded-xl mb-3 px-4 bg-gray-100"
                />

                <p className="text-left text-xl">Ngày bắt đầu:</p>
                <input
                  type="date"
                  readOnly
                  value={newSemester.startDate}
                  className="w-full max-w-[500px] h-[50px] border border-gray-300 rounded-xl mb-3 px-4 bg-gray-100"
                />

                <p className="text-left text-xl">Ngày kết thúc:</p>
                <input
                  type="date"
                  readOnly
                  value={newSemester.endDate}
                  className="w-full max-w-[500px] h-[50px] border border-gray-300 rounded-xl mb-3 px-4 bg-gray-100"
                />

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                  >
                    Thêm
                  </button>
                  <button
                    type="button"
                    className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold text-lg transition-all hover:scale-105 hover:bg-red-700 mb-8"
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

export default FormAddSemester;
