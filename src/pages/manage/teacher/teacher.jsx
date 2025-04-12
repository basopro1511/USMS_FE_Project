import { useState, useEffect } from "react";
import FormUpdateTeacher from "../../../components/management/Teacher/FormUpdateTeacher";
import FormAddTeacher from "../../../components/management/Teacher/FormAddTeacher";
import FormDetailTeacher from "../../../components/management/Teacher/FormDetailTeacher";
import {
  changeSelectedTeacherStatus,
  getTeachers,
  handleExportEmptyFormTeacher,
  handleExportTeacher,
  importTeachers,
} from "../../../services/TeacherService";
import { getMajors } from "../../../services/majorService";
import Pagination from "../../../components/management/HeaderFooter/Pagination";

function ManageTeacher() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const [teacherData, setTeacherData] = useState([]);
  const [majorData, setMajorData] = useState([]);

  // Lấy danh sách Teacher
  useEffect(() => {
    const fetchTeacherData = async () => {
      const data = await getTeachers(); // Lấy danh sách giáo viên
      if (data && data.result) {
        setTeacherData(data.result);
      }
    };
    fetchTeacherData();
  }, []);

  //Update bảng mà không cần reload
  const handleReload = async () => {
    const data = await getTeachers(); // Gọi API để lấy lại tất cả các phòng
    setTeacherData(data.result); // Cập nhật lại dữ liệu phòng
  };

  // Lấy danh sách Major
  useEffect(() => {
    const fetchMajorData = async () => {
      const majorResponse = await getMajors();
      if (majorResponse && majorResponse.result) {
        setMajorData(majorResponse.result);
      }
    };
    fetchMajorData();
  }, []);

  // State bật/tắt form
  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => setAddForm(!showAddForm);

  // State bật/tắt form Update
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => setUpdateForm(!showUpdateForm);

  // State lưu teacher cần cập nhật
  const [teacherToUpdate, setTeacherToUpdate] = useState(null);
  const handleUpdateClick = (teacher) => {
    setTeacherToUpdate(teacher);
    toggleShowUpdateForm();
  };

  // State bật/tắt form Detail
  const [showDetailForm, setDetailForm] = useState(false);
  const toggleShowDetailForm = () => setDetailForm(!showDetailForm);

  // State lưu teacher cần xem chi tiết
  const [teacherDetail, setTeacherDetail] = useState(null);
  const handleDetailClick = (teacher) => {
    setTeacherDetail(teacher);
    toggleShowDetailForm();
  };

  // Bộ lọc (userId, teacherName, majorId)
  const [filters, setFilters] = useState({
    userId: "",
    teacherName: "",
    majorId: "",
    status: ""
  });
  const statusMapping = {
    0: "Vô hiệu hóa",
    1: "Đang khả dụng",
    2: "Đang tạm hoãn",
  };
  // Cập nhật filters khi nhập/chọn
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Lọc dữ liệu
  const [filteredTeachers, setFilteredTeachers] = useState(teacherData);

  useEffect(() => {
    const filteredData = teacherData.filter((item) => {
      const fullName =
      `${item.lastName} ${item.middleName} ${item.firstName}`.toLowerCase();
    return (
      (!filters.userId ||
        item.userId.toLowerCase().includes(filters.userId.toLowerCase())) &&
      (!filters.teacherName || fullName.includes(filters.teacherName.toLowerCase())) &&
      (!filters.status || item.status.toString() === filters.status) &&
      (!filters.majorId || item.majorId === filters.majorId)
    );
  });
    setFilteredTeachers(filteredData);
  }, [filters, teacherData, majorData]);

  // Sắp xếp
  const [sortConfig, setSortConfig] = useState({
    key: "userId",
    direction: "asc",
  });

  const handleSort = (key) => {
    // Nếu key sort giống key hiện tại => đảo ngược direction
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredTeachers].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  //#region Paging
  // Calculate which items to show based on current page
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Số item mỗi trang
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  // Sort, Filter Paging - End
  //#endregion

  //#region chọn import file excel
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleImport = async () => {
    if (!selectedFile) {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn một file Excel trước khi import!");
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    try {
      const response = await await importTeachers(selectedFile);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        handleReload(); // Cập nhật lại danh sách giáo viên
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage("Import thất bại. Vui lòng thử lại!");
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Lỗi khi thêm giáo viên:", error);
    }
  };
  //#endregion
  //#region Student Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(currentData.map((student) => student.userId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStudent = (userId) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Bỏ chọn nếu đã có
          : [...prevSelected, userId] // Thêm nếu chưa
    );
  };

  const handleChangeSelectedStatus = async (userIds, status) => {
    try {
      const response = await changeSelectedTeacherStatus(userIds, status);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setSelectedIds([]);
        handleReload(); // Cập nhật lại danh sách giáo viên
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
  return (
    <>
      {/* Notification Start */}
      <>
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
      </>
      {/* Notification End */}
      <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
        <div className="flex justify-center">
          <p className="mt-8 text-3xl font-bold">Quản lý giáo viên</p>
        </div>

        <div className="flex ml-3 mt-2">
          <p>Tìm kiếm</p>
          <span className="text-gray-700 md:w-[200px] text-sm  ml-auto mr-[290px]">
            {selectedFile ? "File đã chọn: " + selectedFile.name : "Chưa chọn file"}
          </span>
        </div>
        {/* Filter Section */}
        <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
          {/* Cột lọc */}
          <div className="flex w-full md:w-auto md:mb-0">
            {/* Lọc theo chuyên ngành */}
            <select
              name="majorId"
              value={filters.majorId}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[200px] border border-black rounded-xl"
            >
              <option value="">Chọn chuyên ngành</option>
              {majorData.map((major) => (
                <option key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[130px] border border-black rounded-xl"
            >
              <option value="">Trạng thái</option>
              {Object.keys(statusMapping).map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {statusMapping[statusKey]}
                </option>
              ))}
            </select>
            {/* Lọc theo Mã giáo viên */}
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[120px] border border-black rounded-xl"
              placeholder="Mã giáo viên"
            />

            {/* Lọc theo Họ và tên */}
            <input
              type="text"
              name="teacherName"
              value={filters.teacherName}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[200px] border border-black rounded-xl"
              placeholder="Họ và tên"
            />
          </div>

          {/* Button Container */}
          <div className="flex ml-auto space-x-4 mt-2 md:mt-0 mr-4">
            {/* Import Sinh viên Button */}
            {/* Input ẩn để chọn file */}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="ml-3 border border-white rounded-xl w-full md:w-[130px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => handleExportTeacher(filters)} // Sử dụng callback hàm
            >
              <i className="fa fa-download mr-2" aria-hidden="true"></i>
              Export Data giáo viên
            </button>
            <button
              type="button"
              className="ml-3 border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => handleExportEmptyFormTeacher()} // Sử dụng callback hàm
            >
              <i className="fa fa-download mr-2" aria-hidden="true"></i>
              Export mẫu thêm giáo viên
            </button>
            {/* Button Import */}
            {/* Button Xác nhận Import */}
            <button
              type="button"
              className="ml-3 border border-white rounded-xl w-full md:w-[112px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleImport}
            >
              <i className="fa fa-check mr-2" aria-hidden="true"></i>
              Import
            </button>{" "}
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <i className="fa fa-upload mr-2" aria-hidden="true"></i>
              Chọn file Excel thêm giáo viên
            </button>
            {/* Add Teacher Button */}
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[181px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={toggleShowForm}
            >
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              Thêm giáo viên
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
          <table className="min-w-full text-left table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("stt")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">STT</p>
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("userId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Mã GV
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("gender")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Giới Tính
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("firstName")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Họ và tên
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("phoneNumber")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">SĐT</p>
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
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
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("majorId")}
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
                </th>{" "}
                <th
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Trạng Thái
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
                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => {
                const stt = indexOfFirstItem + (index + 1);

                // Tìm majorName tương ứng
                const foundMajor = majorData.find(
                  (m) => m.majorId === item.majorId
                );
                const majorName = foundMajor
                  ? foundMajor.majorName
                  : item.majorId;
                return (
                  <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                    <td className="p-4 text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.userId)}
                        onChange={() => handleSelectStudent(item.userId)}
                      />
                    </td>{" "}
                    <td className="p-4 text-center align-middle">{stt}</td>
                    <td className="p-4 text-center align-middle">
                      {item.userId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.gender ? "Nữ" : "Nam"}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.lastName} {item.middleName} {item.firstName}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.phoneNumber}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.email}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {majorName}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.status === 0
                        ? "Vô hiệu hóa"
                        : item.status === 1
                        ? "Đang khả dụng"
                        : item.status === 2
                        ? "Đang tạm hoãn"
                        : "Chưa bắt đầu"}
                    </td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="w-8 h-8 bg-primaryBlue text-white rounded-xl shadow-md hover:bg-blue-700 transition-all hover:scale-125"
                          onClick={() => handleUpdateClick(item)}
                        >
                          <i className="fa-solid fa-pen-fancy"></i>
                        </button>
                        <button
                          className="w-8 h-8 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all hover:scale-125"
                          onClick={() => handleDetailClick(item)}
                        >
                          <i className="fa-regular fa-address-card"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="ml-2 mb-2">
            <h1 className="text-left">
              Thay đổi trạng thái giáo viên đã được chọn:{" "}
            </h1>
            <div className="flex w-full h-10  ">
              <button
                type="button"
                className=" w-full max-w-[120px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 0)}
              >
                Vô hiệu hóa
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 1)}
              >
                Đang khả dụng
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px]border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 2)}
              >
                Đang tạm hoãn
              </button>
            </div>
          </div>
        </div>
        {/* Phân trang - Start */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
        {/* Phân trang - End */}

        {/* Form Add Teacher */}
        {showAddForm && (
          <FormAddTeacher onReaload={handleReload} onClose={toggleShowForm} />
        )}

        {/* Form Update Teacher */}
        {showUpdateForm && (
          <FormUpdateTeacher
            teacherToUpdate={teacherToUpdate}
            onReaload={handleReload}
            onClose={toggleShowUpdateForm}
          />
        )}

        {/* Form Detail Teacher */}
        {showDetailForm && (
          <FormDetailTeacher
            teacherDetail={teacherDetail}
            onClose={toggleShowDetailForm}
          />
        )}
      </div>
    </>
  );
}

export default ManageTeacher;
