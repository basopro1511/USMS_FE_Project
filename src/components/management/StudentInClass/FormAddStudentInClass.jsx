/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  AddMultipleStudentToClass,
  AddStudentToClass,
  getAvailableStudent,
} from "../../../services/studentInClassService";
import { getMajors } from "../../../services/majorService";

function FormAddStudentInClass({ onStudentAdded, classSubjectIdParam }) {
  //#region State Management
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertType, setShowAlert] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [sortConfig, setSortConfig] = useState({
    key: "studentId",
    direction: "asc",
  });

  // --- Chứa các giá trị filter
  const [filter, setFilters] = useState({
    userId: "",
    majorId: "",
    term: "",
    studentName: "", // thêm để lọc theo tên
  });
  //#endregion

  //#region Fetch Data
  useEffect(() => {
    fetchStudentData();
  }, [classSubjectIdParam]); // Re-fetch khi classSubjectIdParam thay đổi

  const fetchStudentData = async () => {
    try {
      if (!classSubjectIdParam) {
        console.error("Lỗi: classSubjectIdParam không hợp lệ!");
        return;
      }
      const data = await getAvailableStudent(classSubjectIdParam);
      if (!data || !data.result) {
        setStudentData([]);
        return;
      }
      setStudentData(data.result);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu sinh viên:", error);
      setStudentData([]);
    }
  };

  //Update bảng mà không cần reload
  const handleAddStudentReload = async () => {
    try {
      const data = await getAvailableStudent(classSubjectIdParam);
      if (data && data.result) {
        setStudentData(data.result);
      }
    } catch (error) {
      console.error("Lỗi khi reload danh sách sinh viên:", error);
    }
  };

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

  //#endregion

  //#region Filtering & Sorting

  // useEffect để áp dụng filter
  useEffect(() => {
    const filteredData = studentData.filter((item) => {
      // Lọc theo chuyên ngành: sử dụng filter.majorId và so sánh với item.majorId
      if (filter.majorId && filter.majorId !== item.majorId) {
        return false;
      }
      // Lọc theo kỳ học
      if (filter.term && String(filter.term) !== String(item.term)) {
        return false;
      }
      // Lọc theo mã sinh viên (userId) - case-insensitive
      if (filter.userId) {
        const userIdLower = item.userId.toLowerCase();
        const filterUserId = filter.userId.toLowerCase();
        if (!userIdLower.includes(filterUserId)) {
          return false;
        }
      }
      // Lọc theo tên sinh viên (ghép full name) - case-insensitive
      if (filter.studentName) {
        const fullName = (item.firstName + " " + item.middleName + " " + item.lastName).toLowerCase();
        const filterName = filter.studentName.toLowerCase();
        if (!fullName.includes(filterName)) {
          return false;
        }
      }
      // Có thể bổ sung thêm các điều kiện filter khác (ví dụ: status) nếu cần
      return true;
    });
    setFilteredStudents(filteredData);
  }, [filter, studentData]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // mỗi khi lọc, quay về trang 1
  };

  // Sắp xếp
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredStudents].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    const valA = String(a[sortConfig.key]).toLowerCase();
    const valB = String(b[sortConfig.key]).toLowerCase();
    return sortConfig.direction === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });
  //#endregion

  //#region Pagination
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(sortedData.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };
  //#endregion

  //#region Student Selection
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedStudents(currentData.map((student) => student.userId));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (userId) => {
    setSelectedStudents(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Bỏ chọn nếu đã có
          : [...prevSelected, userId] // Thêm nếu chưa
    );
  };
  //#endregion

  //#region Form Submission
  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // Thêm 1 SV
  const handleAddStudent = async (userId) => {
    try {
      const studentData = {
        studentClassId: 0,
        classSubjectId: classSubjectIdParam,
        studentId: userId, // Lấy studentId khi click button
      };
      const response = await AddStudentToClass(studentData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        onStudentAdded(response.data);
        handleAddStudentReload();
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Thêm nhiều SV
  const handleAddMultipleStudents = async (event) => {
    event.preventDefault();

    try {
      if (selectedStudents.length === 0) {
        setShowAlert("error");
        setErrorMessage("Vui lòng chọn ít nhất một sinh viên.");
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      // Tạo danh sách
      const studentsData = selectedStudents.map((userId) => ({
        studentClassId: 0,
        classSubjectId: classSubjectIdParam,
        studentId: userId,
      }));

      const response = await AddMultipleStudentToClass(studentsData);

      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        onStudentAdded(response.data);
        setSelectedStudents([]);
        // Gọi lại danh sách còn lại
        setTimeout(async () => {
          const updatedData = await getAvailableStudent(classSubjectIdParam);
          if (updatedData && updatedData.result) {
            setStudentData(updatedData.result);
          }
        }, 500);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhiều sinh viên:", error);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  //#endregion

  //#region Render UI
  return (
    <>
      {alertType && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            alertType === "error"
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
              {alertType === "error" ? (
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
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-[1570px] h-auto rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Thêm sinh viên vào lớp
              </p>
              {/* Filter Section */}
              <p className="text-left ml-8 mt-4">Tìm kiếm :</p>
              <div className="flex w-full ml-4 h-12 flex-wrap md:flex-nowrap">
                <div className="flex w-full md:w-auto md:mb-0">
                  <select
                    name="majorId"
                    value={filter.majorId}
                    onChange={handleFilterChange}
                    className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl"
                  >
                    <option value="">Chọn chuyên ngành</option>
  {majorData.map((major) => (
    <option key={major.majorId} value={major.majorId}>
      {major.majorName}
    </option>
  ))}
                  </select>

                  <select
                    name="term"
                    value={filter.term}
                    onChange={handleFilterChange}
                    className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
                  >
                    <option value="">Kỳ học</option>
                    {[...new Set(studentData.map((item) => item.term))].map(
                      (term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      )
                    )}
                  </select>

                  <input
                    type="text"
                    name="userId"
                    placeholder="Mã số sinh viên"
                    value={filter.userId}
                    onChange={handleFilterChange}
                    className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[150px] border border-black rounded-xl px-3"
                  />
                  {/* Search Full Name */}
                  <input
                    type="text"
                    name="studentName"
                    value={filter.studentName}
                    onChange={handleFilterChange}
                    className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
                    placeholder="Tìm theo Tên sinh viên"
                  />
                </div>
              </div>

              <form onSubmit={handleAddStudent}>
                <div className="w-[1510px] mx-auto overflow-x-auto relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                  {studentData.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Không có dữ liệu sinh viên
                    </p>
                  ) : (
                    <table className="min-w-full text-left table-auto bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          {/* Table headers */}
                          <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                              checked={
                                selectedStudents.length ===
                                  currentData.length && currentData.length > 0
                              }
                            />
                          </th>

                          <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue ">
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                STT
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("studentId")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                Mã sinh viên
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("firstName")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                Tên sinh viên
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("email")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                Email
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("phoneNumber")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                SĐT
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("major")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                Chuyên ngành
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th
                            className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            onClick={() => handleSort("major")}
                          >
                            <div className="flex items-center justify-between">
                              <p className="m-auto transition-all hover:scale-105">
                                Kỳ học
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </div>
                          </th>
                          <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((student, index) => {
                          // tăng số thứ tự
                          const stt = indexOfFirstItem + (index + 1);
                          // Tìm majorName tương ứng
                          const foundMajor = majorData.find(
                            (m) => m.majorId === student.majorId
                          );
                          const majorName = foundMajor
                            ? foundMajor.majorName
                            : student.majorId;
                          return (
                            <tr
                              key={student.userId}
                              className="hover:bg-gray-50 even:bg-gray-50"
                            >
                              <td className="p-4 border-b text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(
                                    student.userId
                                  )}
                                  onChange={() =>
                                    handleSelectStudent(student.userId)
                                  }
                                />
                              </td>
                              <td className="p-4 border-b text-center">
                                {stt}
                              </td>
                              <td className="p-4 border-b text-center">
                                {student.userId}
                              </td>
                              <td className="p-4 border-b text-center">
                                {student.lastName} {student.middleName}{" "}
                                {student.firstName}
                              </td>
                              <td className="p-4 border-b text-center">
                                {student.email}
                              </td>
                              <td className="p-4 border-b text-center">
                                {student.phoneNumber}
                              </td>
                              <td className="p-4 border-b text-center">
                                {majorName}
                              </td>
                              <td className="p-4 border-b text-center">
                                {student.term}
                              </td>
                              <td className="p-4 border-b text-center">
                                <button
                                  type="button"
                                  className="border border-white w-[40px] h-[40px] bg-green-600 text-white font-bold rounded-[10px] transition-all duration-300 hover:scale-95"
                                  onClick={() =>
                                    handleAddStudent(student.userId)
                                  }
                                >
                                  <i className="fa fa-plus text-white"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                {/* Phân trang - start */}
                <div className="flex mt-5">
                  {/* Button: Previous */}
                  <button
                    type="button"
                    className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <span className="font-bold text-xl">&lt;</span> Trang Trước
                  </button>
                  {/* Date Range */}
                  <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
                    <p>{`Trang ${currentPage}`}</p>
                  </div>

                  {/* Button: Next */}
                  <button
                    type="button"
                    className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Trang Sau <span className="font-bold text-xl">&gt;</span>
                  </button>
                </div>
                {/* Phân trang - end */}
                <div className="flex justify-center gap-8 mt-10 mb-8">
                  <button
                    type="submit"
                    className="w-[200px] h-[50px] bg-secondaryBlue text-white border rounded-3xl font-bold"
                    onClick={handleAddMultipleStudents}
                  >
                    Thêm
                  </button>
                  <button
                    type="button"
                    className="w-[200px] h-[50px] bg-red-500 text-white border rounded-3xl font-bold"
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
  //#endregion
}

export default FormAddStudentInClass;
