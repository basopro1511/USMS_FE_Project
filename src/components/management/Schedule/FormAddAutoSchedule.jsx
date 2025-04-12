import { useEffect, useState } from "react";
import { getClasses } from "../../../services/classService";
import { AutoSchedule } from "../../../services/scheduleService";

function FormAddAutoSchedule() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);

  const scheduledDays = [
    { label: "Chủ nhật", value: 0 },
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
  ];

  const handleDayChange = (value) => {
    const updatedDays = selectedDays.includes(value)
      ? selectedDays.filter((d) => d !== value)
      : [...selectedDays, value];
    setSelectedDays(updatedDays);
    setNewData((prev) => ({
      ...prev,
      scheduledDays: updatedDays.sort().join(","),
    }));
  };

  const [classData, setClassData] = useState([]);
  const [newData, setNewData] = useState({
    majorId: "",
    semesterId: "",
    term: 1,
    classId: "",
    scheduledDays: "",
  });

  useEffect(() => {
    const fetchClassData = async () => {
      const response = await getClasses();
      setClassData(response.result || []);
    };
    fetchClassData();
  }, []);

  const getUniqueValues = (data, key) => [
    ...new Set(data.map((item) => item[key])),
  ];

  const filteredByMajor = classData.filter(
    (item) => item.majorId === newData.majorId
  );
  const filteredByMajorSemesterTerm = classData.filter(
    (item) =>
      item.majorId === newData.majorId &&
      item.semesterId === newData.semesterId &&
      item.term.toString() === newData.term.toString()
  );
  const handleCancel = () => {
    setIsFormVisible(false);
  };
  //#region Xử lý Submit Form để thêm lịch học
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        majorId: newData.majorId,
        semesterId: newData.semesterId,
        classId: newData.classId,
        term: parseInt(newData.term),
        scheduledDays: selectedDays
      };
    try {
      const response = await AutoSchedule(payload);
      if (response && response.isSuccess) {
        setSuccessMessage(response.message);
        setShowAlert("success");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 3000);
        setIsFormVisible(false); // Ẩn form sau khi thông báo biến mất
      } else {
        setErrorMessage(response.message);
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 3000);
      }
    } catch (error) {
        setTimeout(() => {
            setShowAlert(false); // Ẩn thông báo sau 3 giây
          }, 3000);
      setErrorMessage("Lỗi hệ thống, vui lòng thử lại!");
      setShowAlert("error");
      console.error("Error adding schedule:", error);
    }
  };
  //#endregion
  return (
    <>
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "bg-red-50 text-red-800 border-red-300"
              : "bg-green-50 text-green-800 border-green-300"
          } border rounded-lg p-4 mr-4 animate-slide-in`}
        >
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div>
              {showAlert === "error" ? (
                <strong>Thất bại:</strong>
              ) : (
                <strong>Thành công:</strong>
              )}{" "}
              {showAlert === "error" ? errorMessage : successMessage}
            </div>
          </div>
        </div>
      )}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] rounded-2xl shadow-xl p-6 text-center">
            <p className="text-4xl font-bold text-secondaryBlue mb-6">
              Thêm lịch học tự động
            </p>
            <form onSubmit={handleSubmit}>
              {/* Chuyên ngành */}
              <label className="block text-left ml-[100px] text-xl mb-1">
                Chọn chuyên ngành
              </label>
              <select
                name="majorId"
                value={newData.majorId}
                onChange={(e) => setNewData({ ...newData, majorId: e.target.value })}
                className="w-full max-w-[500px] mb-3 border border-black rounded-xl px-4 h-[50px]"
                required
              >
                <option value="">-- Chọn chuyên ngành --</option>
                {getUniqueValues(classData, "majorId").map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>

              {/* Học kỳ */}
              <label className="block text-left ml-[100px] text-xl mb-1">
                Chọn học kỳ
              </label>
              <select
                name="semesterId"
                value={newData.semesterId}
                onChange={(e) => setNewData({ ...newData, semesterId: e.target.value })}
                className="w-full max-w-[500px] mb-3 border border-black rounded-xl px-4 h-[50px]"
                required
                disabled={!newData.majorId}
              >
                <option value="">-- Chọn học kỳ --</option>
                {getUniqueValues(filteredByMajor, "semesterId").map(
                  (semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  )
                )}
              </select>

              {/* Kỳ học số */}
              <label className="block text-left ml-[100px] text-xl mb-1">
                Chọn kỳ học số
              </label>
              <select
                name="term"
                value={newData.term}
                onChange={(e) => setNewData({ ...newData, term: e.target.value })}
                className="w-full max-w-[500px] mb-3 border border-black rounded-xl px-4 h-[50px]"
                required
                disabled={!newData.semesterId}
              >
                <option value="">-- Chọn kỳ học số --</option>
                {getUniqueValues(
                  filteredByMajor.filter(
                    (d) => d.semesterId === newData.semesterId
                  ),
                  "term"
                ).map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>

              {/* Lớp học */}
              <label className="block text-left ml-[100px] text-xl mb-1">
                Chọn lớp học
              </label>
              <select
                name="classId"
                value={newData.classId}
                onChange={(e) => setNewData({ ...newData, classId: e.target.value })}
                className="w-full max-w-[500px] mb-3 border border-black rounded-xl px-4 h-[50px]"
                required
                disabled={!newData.term}
              >
                <option value="">-- Chọn lớp học --</option>
                {getUniqueValues(filteredByMajorSemesterTerm, "classId").map(
                  (classId) => (
                    <option key={classId} value={classId}>
                      {classId}
                    </option>
                  )
                )}
              </select>

              {/* Ngày trong tuần */}
              <label className="block text-left ml-[100px] text-xl mb-1">
                Chọn ngày học muốn sắp
              </label>
              <div className="flex flex-wrap gap-3 ml-[70px] mb-5">
                {scheduledDays.map((day) => (
                  <label key={day.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={day.value}
                      checked={selectedDays.includes(day.value)}
                      onChange={() => handleDayChange(day.value)}
                    />
                    {day.label}
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold hover:scale-105"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold hover:scale-105 mb-8"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FormAddAutoSchedule;
