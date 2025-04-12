import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  changeSelectedExamScheduleStatus,
  getExamSchedules,
} from "../../../services/examScheduleService";
import FormAddExamSchedule from "../../../components/management/ExamSchedule/FormAddExamSchedule";
import FormUpdateExamSchedule from "../../../components/management/ExamSchedule/FormUpdateExamSchedule";
import { getMajors } from "../../../services/majorService";

function ManageExamSchedule() {
  //#region State
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  // filter chỉ có 3 trường: majorId, subjectId, semesterId
  const [filters, setFilters] = useState({
    majorId: "",
    subjectId: "",
    semesterId: "",
  });

  // Dữ liệu cho các <select> động
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  // Bảng hiển thị
  const [sortConfig, setSortConfig] = useState({
    key: "classId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  //#endregion

  //#region Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const response = await getExamSchedules();
      setData(response.result || []);
    };
    fetchData();
  }, []);

  // Fetch Data Major
  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      const res = await getMajors();
      setMajorData(res.result || []);
    };
    fetchMajorData();
  }, []);
  //#endregion

  //#region Filter logic phân tầng
  useEffect(() => {
    // 1) Lọc theo majorId (nếu có)
    let dataByMajor = filters.majorId
      ? data.filter((item) => item.majorId === filters.majorId)
      : data;

    // Lấy các subjectId duy nhất từ dataByMajor
    const subjects = Array.from(
      new Set(dataByMajor.map((item) => item.subjectId))
    );
    setAvailableSubjects(subjects);

    // 2) Nếu có chọn subjectId, tiếp tục lọc
    let dataBySubject = filters.subjectId
      ? dataByMajor.filter((item) => item.subjectId === filters.subjectId)
      : dataByMajor;

    // Lấy semesterId duy nhất
    const semesters = Array.from(
      new Set(dataBySubject.map((item) => item.semesterId))
    );
    setAvailableSemesters(semesters);
  }, [filters, data]);
  //#endregion

  //#region Filter cuối cùng để hiển thị ra bảng
  const filteredData = data.filter((item) => {
    if (filters.majorId && item.majorId !== filters.majorId) return false;
    if (filters.subjectId && item.subjectId !== filters.subjectId) return false;
    if (filters.semesterId && item.semesterId !== filters.semesterId)
      return false;
    return true;
  });
  //#endregion

  //#region Sort
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  //#endregion

  //#region Paging
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(sortedData.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };
  //#endregion

  //#region Show & Hide form + Reload
  const handleClassReload = async () => {
    const response = await getExamSchedules();
    setData(response.result || []);
  };

  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };

  const [examScheduleToUpdate, setExamScheduleToUpdate] = useState(null);
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => {
    setUpdateForm(!showUpdateForm);
  };

  const handleUpdateClick = (classItem) => {
    setExamScheduleToUpdate(classItem);
    toggleShowUpdateForm();
  };
  //#endregion

  //#region Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset về trang 1 mỗi khi thay đổi filter
    setCurrentPage(1);
  };
  //#endregion
  //#region  Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(currentData.map((data) => data.examScheduleId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStudent = (examScheduleId) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(examScheduleId)
          ? prevSelected.filter((id) => id !== examScheduleId) // Bỏ chọn nếu đã có
          : [...prevSelected, examScheduleId] // Thêm nếu chưa
    );
  };

  const handleChangeSelectedStatus = async (examScheduleId, status) => {
    try {
      const response = await changeSelectedExamScheduleStatus(
        examScheduleId,
        status
      );
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setSelectedIds([]);
        handleClassReload();
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái các sinh viên:", error);
      setShowAlert("error");
      setErrorMessage(error.message);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  //#endregion
  const formatTime = (timeString) => {
    if (!timeString) return ""; // Xử lý trường hợp null hoặc undefined
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Hiển thị 24h
    });
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
      {/* Notification End */}
      <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
        <div className="flex justify-center">
          <p className="mt-8 text-3xl font-bold">Quản lý lịch thi</p>
        </div>

        {/* Filter Section */}
        <p className="ml-4 mt-5">Tìm kiếm</p>
        <div className="flex w-auto h-12">
          {/* Select chuyên ngành */}
          <select
            name="majorId"
            value={filters.majorId}
            onChange={handleFilterChange}
            className="max-w-sm ml-3 h-12 w-[230px] border border-black rounded-xl"
          >
            <option value="">Chuyên ngành</option>
            {/* majors: lấy tất cả majorName duy nhất từ data */}
            {majorData.map((major) => (
              <option key={major.majorId} value={major.majorId}>
                {major.majorName}
              </option>
            ))}
          </select>

          {/* Select môn (theo majorName đã chọn) */}
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleFilterChange}
            className="max-w-sm ml-3 h-12 w-[168px] border border-black rounded-xl"
          >
            <option value="">Môn</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          {/* Select lớp (theo subjectId đã chọn)
        <select
          name="classId"
          value={filters.classId}
          onChange={handleFilterChange}
          className="max-w-sm ml-3 h-12 w-[168px] border border-black rounded-xl"
        >
          <option value="">Lớp</option>
          {availableClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select> */}

          {/* Select kỳ học (tùy chọn) */}
          <select
            name="semesterId"
            value={filters.semesterId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[100px] border border-black rounded-xl"
          >
            <option value="">Mã Kì học</option>
            {availableSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-6 mt-2 md:mt-0">
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={toggleShowForm}
            >
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              Thêm lịch thi
            </button>
          </div>
        </div>

        {/* table - Start */}
        <div className="w-[1565px] ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
          <table className="w-full text-left table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                {" "}
                <th className="p-4  font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedIds.length === currentData.length &&
                      currentData.length > 0
                    }
                  />
                </th>{" "}
                <th
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("examScheduleId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Mã lịch thi
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("semesterId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Mã kì học</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("majorId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Chuyên ngành</p>
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("subjectId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Mã môn</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("roomId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Phòng học</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Ngày</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("startTime")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Giờ bắt đầu</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("endTime")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Giờ kết thúc</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("teacherId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Giáo viên </p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("teacherId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Sĩ số </p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Trạng thái</p>
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
                <th className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue ">
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Thao tác</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                    {" "}
                    <td className="p-4 w-[20px] text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.examScheduleId)}
                        onChange={() =>
                          handleSelectStudent(item.examScheduleId)
                        }
                      />
                    </td>{" "}
                    <td className="p-4 text-center align-middle">
                      {item.examScheduleId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.semesterId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.majorId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.subjectId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.roomId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.date}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {formatTime(item.startTime)}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {formatTime(item.endTime)}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.teacherId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.numberOfStudentInExamSchedule}/20
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.status === 0
                        ? "Chưa bắt đầu"
                        : item.status === 1
                        ? "Đang diễn ra"
                        : item.status === 2
                        ? "Đã kết thúc"
                        : "Không xác định"}
                    </td>
                    <td className="p-4 text-center align-middle">
                      <button
                        className="w-8 h-8 ml-auto mr-2 bg-primaryBlue text-white rounded-xl shadow-md hover:bg-blue-700 transition-all hover:scale-125"
                        onClick={() => handleUpdateClick(item)}
                      >
                        <i className="fa-solid fa-pen-fancy"></i>
                      </button>
                      {/* Button 2 */}
                      <Link
                        to={`/studentInExamSchedule/${item.examScheduleId}/${item.subjectId}`}
                      >
                        <button className="w-8 h-8 mr-auto bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all hover:scale-125">
                          <i className="fa-regular fa-address-card"></i>
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>{" "}
          <div className="">
            <h1 className="text-left ml-1">
              Thay đổi trạng lớp học đã được chọn:{" "}
            </h1>
            <div className="flex w-full h-10 mb-2 ml-1 ">
              <button
                type="button"
                className=" w-full max-w-[120px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 0)}
              >
                Chưa bắt đầu
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 1)}
              >
                Đang diễn ra
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px]border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 2)}
              >
                Đã kết thúc
              </button>
            </div>
          </div>
        </div>
        {/* table - End */}
        {/* Phân trang */}
        <div className="flex mt-5">
          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <span className="font-bold text-xl">&lt;</span> Trang Trước
          </button>

          <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
            <p>Trang {currentPage}</p>
          </div>

          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Trang Sau <span className="font-bold text-xl">&gt;</span>
          </button>
        </div>

        {/* Form thêm lớp học */}
        {showAddForm && (
          <FormAddExamSchedule onClassAdded={handleClassReload} />
        )}

        {/* Form cập nhật lớp học */}
        {showUpdateForm && (
          <FormUpdateExamSchedule
            examScheduleToUpdate={examScheduleToUpdate}
            onClassUpdated={handleClassReload}
          />
        )}
      </div>
    </>
  );
}

export default ManageExamSchedule;
