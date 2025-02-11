import { useEffect, useState } from "react";
import { getMajors } from "../../../services/majorService";
import { getSubjectsByMajorAndTerm } from "../../../services/subjectService";
import { getSemesters } from "../../../services/semesterService";
import { AddClass } from "../../../services/classService";

// eslint-disable-next-line react/prop-types
function FormAddClass({ onClassAdded }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại
  const [isFormVisible, setIsFormVisible] = useState(true);

  const [formData, setFormData] = useState({
    classSubjectId: 0,
    classId: "",
    subjectId: "",
    semesterId: "",
    majorId: "",
    term: "",
    createAt: "",
    status: 0,
  });
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
  //Fetch Data Semester - End

  // Fetch Data Subjcet - Start
  const [subjectData, setSubjectData] = useState([]);
  useEffect(() => {
    if (formData.majorId && formData.term) {
      const fetchSubjectData = async () => {
        try {
          const subjectResponse = await getSubjectsByMajorAndTerm(
            formData.majorId,
            formData.term
          );
          setSubjectData(subjectResponse.result);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchSubjectData();
    }
  }, [formData.majorId, formData.term]);
  //Fetch Data Major - End

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AddClass(formData);
      console.log(formData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onClassAdded(response.slot);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding room:", error);
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
      {/* Thông báo  End*/}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
              Thêm lớp học
            </p>
            <form onSubmit={handleSubmit}>
              <p className="text-left ml-[100px] text-xl mt-5">
                Chọn chuyên ngành:
              </p>
              <select
                name="majorId"
                value={formData.majorId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
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

              <p className="text-left ml-[100px] text-xl">Mã số kỳ học:</p>
              <select
                type="number"
                name="term"
                value={formData.term}
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
                    <option key={term} value={term}>
                      {term}
                    </option>
                  )
                )}
              </select>
              <p className="text-left ml-[100px] text-xl ">Chọn môn học :</p>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn môn học
                </option>
                {subjectData.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>

              {/* Mã số lớp học */}
              <p className="text-left ml-[100px] text-xl ">Mã lớp học:</p>
              <input
                name="classId"
                type="text"
                value={formData.classId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              />

              {/* Mã kỳ học */}
              <p className="text-left ml-[100px] text-xl">Kỳ học:</p>
              <select
                name="semesterId"
                value={formData.semesterId}
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

              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                >
                  Thêm
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

export default FormAddClass;
