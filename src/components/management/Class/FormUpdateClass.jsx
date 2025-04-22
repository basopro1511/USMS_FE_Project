import { useEffect, useState } from "react";
import { UpdateClass } from "../../../services/classService";
import { getSemesters } from "../../../services/semesterService";
import { getMajors } from "../../../services/majorService";
import { getSubjectsByMajorAndTerm } from "../../../services/subjectService";

// eslint-disable-next-line react/prop-types
function FormUpdateClass({ classToUpdate, onClassUpdated }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại

  const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
  const handleCancel = () => {
    setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
  };

  // Dữ liệu lớp học
  const [classData, setClassData] = useState(
    classToUpdate || {
      classSubjectId: 0,
      classId: "",
      subjectId: "",
      semesterId: "",
      majorId: "",
      term: "",
      createAt: "",
      status: 0,
    }
  );
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

  // Fetch Data Semester - Start
  const [semesterData, setSemesterData] = useState([]);
  useEffect(() => {
    const fetchSemesterData = async () => {
      const semesterData = await getSemesters(); //Lấy ra list room rtong database
      setSemesterData(semesterData.result);
    };
    fetchSemesterData();
  }, []);
  //Fetch Data Major - End

  // Fetch Data Subjcet - Start
  const [subjectData, setSubjectData] = useState([]);
  useEffect(() => {
    if (classData.majorId && classData.term) {
      const fetchSubjectData = async () => {
        try {
          const subjectResponse = await getSubjectsByMajorAndTerm(
            classData.majorId,
            classData.term
          );
          setSubjectData(subjectResponse.result);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchSubjectData();
    }
  }, [classData.majorId, classData.term]);
  //Fetch Data Major - End

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (classToUpdate) {
      setClassData(classToUpdate);
    }
  }, [classToUpdate]);

  // Xử lý form Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API cập nhật lớp học
      const response = await UpdateClass(classData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onClassUpdated(response.data); // Trả về dữ liệu mới nhất
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
        setIsFormVisible(false); // Ẩn form
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
      }
    } catch (error) {
      console.error("Error updating class:", error);
    }
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
            <span>
              {showAlert === "error" ? (
                <strong>Lỗi:</strong>
              ) : (
                <strong>Thành Công:</strong>
              )}
            </span>{" "}
            {showAlert === "error" ? errorMessage : successMessage}
          </div>
        </div>
      )}
      {/* Thông báo End */}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
              Cập nhật lớp học
            </p>
            <form onSubmit={handleSubmit}>
              {/* Mã số lớp học */}
              <p className="text-left ml-[100px] text-xl mt-5">Mã lớp học:</p>
              <input
                readOnly
                name="classId"
                type="text"
                value={classData.classId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              />
              <p className="text-left ml-[100px] text-xl ">
                Chọn chuyên ngành:
              </p>
              <select
                readOnly
                name="majorId"
                value={classData.majorId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn chuyên ngành
                </option>
                {majorData.map((major) => (
                  <option key={major.majorId} value={major.majorId} disabled>
                    {major.majorName}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl">Mã số kỳ học:</p>
              <select
                type="number"
                name="term"
                readOnly
                value={classData.term}
                onChange={handleInputChange}
                placeholder="Nhập kì học"
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                required
              >
                <option value="" disabled>
                  Nhập kỳ học
                </option>
                {Array.from({ length: 9 }, (_, index) => index + 1).map(
                  (term) => (
                    <option key={term} value={term} disabled>
                      {term}
                    </option>
                  )
                )}
              </select>
              <p className="text-left ml-[100px] text-xl ">Chọn môn học :</p>
              <select
                name="subjectId"
                value={classData.subjectId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn môn học
                </option>
                {subjectData.map((subject) => (
                  <option
                    key={subject.subjectId}
                    value={subject.subjectId}
                    selected
                  >
                    {subject.subjectName}
                  </option>
                ))}
              </select>

              {/* Mã kỳ học */}
              <p className="text-left ml-[100px] text-xl">Kỳ học:</p>
              <select
                name="semesterId"
                value={classData.semesterId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn kỳ học:
                </option>
                {semesterData.map((semester) => (
                  <option key={semester.semesterId} value={semester.semesterId}>
                    {semester.semesterName}
                  </option>
                ))}
              </select>

              {/* Trạng thái */}
              <p className="text-left ml-[100px] text-xl">Trạng thái</p>
              <select
                name="status"
                value={classData.status}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn trạng thái:
                </option>
                <option value="0">Chưa bắt đầu</option>
                <option value="1">Đang diễn ra</option>
                <option value="2">Đã kết thúc</option>
              </select>

              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold text-lg transition-all hover:scale-105 hover:bg-red-700"
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

export default FormUpdateClass;
