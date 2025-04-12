import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getMajors } from "../../../services/majorService";
import { getSemesters } from "../../../services/semesterService";
import { getSubjectsByMajorAndTerm } from "../../../services/subjectService";
import { autoGenerateClass } from "../../../services/classService";

function FormAutoAddClass({ onClassesCreated }) {
  // State để lưu file, dữ liệu sinh viên và thông tin form
  const [file, setFile] = useState(null);
  const [studentIds, setStudentIds] = useState([]);
  const [formData, setFormData] = useState({
    majorId: "",
    subjectId: "",
    semesterId: "",
    term: "",
    classCapacity: 40, // default class capacity
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  //#region hide from
  const handleCancel = () => {
    setIsFormVisible(false);
  };
  //#endregion
  //#region Fetch Data
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
      const semesterData = await getSemesters(); // Lấy ra list semester từ database
      // Chỉ giữ lại các semester có status = 1
      const activeSemesters = semesterData.result.filter(
        (item) => item.status === 1
      );
      setSemesterData(activeSemesters);
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
  //#endregion

  //#region Auto Add Class
  // Đọc file Excel và trích xuất danh sách StudentId từ cột có header "StudentId"
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    setFile(selectedFile);
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      // Chuyển worksheet thành JSON dạng mảng 2 chiều
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (!data || data.length < 2) {
        setShowAlert("error");
        setTimeout(() => setShowAlert(false), 3000);
        setErrorMessage("File không chứa dữ liệu sinh viên hợp lệ.");
        return;
      }
  
      // Tìm cột có tên "Mã sinh viên"
      const headers = data[0];
      const studentIdColIndex = headers.findIndex(
        (col) =>
          col.toString().toLowerCase() === "mã sinh viên" ||
          col.toString().toLowerCase().includes("mã sinh")
      );
  
      if (studentIdColIndex === -1) {
        setShowAlert("error");
        setTimeout(() => setShowAlert(false), 3000);
        setErrorMessage('Không tìm thấy cột "Mã sinh viên" trong file.');
        return;
      }
      // Lấy danh sách StudentId từ các dòng còn lại
      const ids = data
        .slice(1)
        .filter((row) => row[studentIdColIndex]) // loại bỏ dòng trống
        .map((row) => row[studentIdColIndex].toString().trim());
      setStudentIds(ids);
    };
    reader.readAsBinaryString(selectedFile);
  };
  
  // Xử lý thay đổi các trường input của form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Khi submit form tự động tạo lớp và phân chia sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Gọi API auto-create lớp
      const response = await autoGenerateClass(
        studentIds,
        parseInt(formData.classCapacity),
        formData.majorId,
        formData.subjectId,
        formData.semesterId,
        parseInt(formData.term)
      );
      if (response.isSuccess) {         
       setShowAlert("true");
        setTimeout(() => setShowAlert(true), 3000);
        setSuccessMessage(response.message);
        onClassesCreated(response.result); 
        setIsFormVisible(false);
      } else {  
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage(error.message);
      setTimeout(() => setShowAlert(false), 3000);
    }
    setIsProcessing(false);
  };

  //#endregion

  //#region  new
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
                Chọn file danh sách sinh viên (Excel){" "}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </p>{" "}
              <p className="text-left ml-[100px] text-xl ">
                Chọn chuyên ngành:
              </p>{" "}
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
                   {subject.subjectId} - {subject.subjectName}
                   </option>
                ))}
              </select>
              {/* Mã số lớp học
            <p className="text-left ml-[100px] text-xl ">Mã lớp học:</p>
            <input
              name="classId"
              type="text"
              value={formData.classId}
              onChange={handleInputChange}
              required
              className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
            /> */}
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
              <p className="text-left ml-[100px] text-xl">
                Số sinh viên tối đa mỗi lớp (Class Capacity):
              </p>
              <input
                type="number"
                name="classCapacity"
                value={formData.classCapacity}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              />
              <div className="mb-4">
                <p>
                  Tổng số sinh viên trong file:{" "}
                  <strong>{studentIds.length}</strong>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Đang xử lý..." : "Tạo lớp tự động"}
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
  //#endregion
  //#region old
  //   return (
  //     <div className="max-w-xl mx-auto p-4 border rounded-xl bg-white shadow-lg">
  //       <h2 className="text-2xl font-bold mb-4">Tự động tạo lớp</h2>
  //       {showAlert && (
  //         <div
  //           className={`mb-4 p-4 rounded ${
  //             errorMessage
  //               ? "bg-red-100 text-red-800"
  //               : "bg-green-100 text-green-800"
  //           }`}
  //         >
  //           {errorMessage ? <strong>Lỗi:</strong> : <strong>Thành công:</strong>}
  //           {errorMessage || successMessage}
  //         </div>
  //       )}
  //       <form onSubmit={handleSubmit}>
  //         <div className="mb-4">
  //           <label className="block mb-1">
  //             Chọn file danh sách sinh viên (Excel)
  //           </label>
  //           <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
  //         </div>
  //         <div className="mb-4">
  //           <label className="block mb-1">Chuyên ngành (MajorId)</label>
  //           <input
  //             type="text"
  //             name="majorId"
  //             value={formData.majorId}
  //             onChange={handleInputChange}
  //             required
  //             className="w-full border p-2 rounded"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <label className="block mb-1">Mã môn học (SubjectId)</label>
  //           <input
  //             type="text"
  //             name="subjectId"
  //             value={formData.subjectId}
  //             onChange={handleInputChange}
  //             required
  //             className="w-full border p-2 rounded"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <label className="block mb-1">Kỳ học (SemesterId)</label>
  //           <input
  //             type="text"
  //             name="semesterId"
  //             value={formData.semesterId}
  //             onChange={handleInputChange}
  //             required
  //             className="w-full border p-2 rounded"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <label className="block mb-1">Kỳ (Term)</label>
  //           <input
  //             type="number"
  //             name="term"
  //             value={formData.term}
  //             onChange={handleInputChange}
  //             required
  //             className="w-full border p-2 rounded"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <label className="block mb-1">
  //             Số sinh viên tối đa mỗi lớp (Class Capacity)
  //           </label>
  //           <input
  //             type="number"
  //             name="classCapacity"
  //             value={formData.classCapacity}
  //             onChange={handleInputChange}
  //             required
  //             className="w-full border p-2 rounded"
  //           />
  //         </div>
  //         <div className="mb-4">
  //           <p>
  //             Tổng số sinh viên trong file: <strong>{studentIds.length}</strong>
  //           </p>
  //         </div>
  //         <button
  //           type="submit"
  //           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all"
  //           disabled={isProcessing}
  //         >
  //           {isProcessing ? "Đang xử lý..." : "Tạo lớp tự động"}
  //         </button>
  //       </form>
  //     </div>
  //   );
  //#endregion
}

export default FormAutoAddClass;
