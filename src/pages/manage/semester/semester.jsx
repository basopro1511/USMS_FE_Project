import { useState, useEffect } from "react";
import FormUpdateSemester from "../../../components/management/Semester/FormUpdateSemester";
import FormAddSemester from "../../../components/management/Semester/FormAddSemester";
import FormDetailSemester from "../../../components/management/Semester/FormDetailSemester";
import {
  changeSelectedSemesterStatus,
  getSemesters,
  handleExportEmptyFormSemester,
  handleExportSemester,
  importSemesters,
} from "../../../services/semesterService";
import Pagination from "../../../components/management/HeaderFooter/Pagination";
function ManageSemester() {
  // Fetch Data Semester - Start
  const [semesterData, setSemesterData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  useEffect(() => {
    const fetchSemesterData = async () => {
      const data = await getSemesters(); //Lấy ra list Semester trong database
      setSemesterData(data.result);
    };
    fetchSemesterData();
  }, []);
  //Fetch Data Semester - End
  //Update bảng mà không cần reload
  const handleSemesterReload = async () => {
    const data = await getSemesters(); // Gọi API để lấy lại tất cả các kì
    setSemesterData(data.result); // Cập nhật lại dữ liệu kì
  };
  //Update bảng mà không cần reload

  // Show form Add New semester - Start
  const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };
  // Show form Add New semester - End

  //Lấy Data gắn qua form Update
  const [semesterToUpdate, setSemesterToUpdate] = useState(null);
  const handleUpdateClick = (semester) => {
    setSemesterToUpdate(semester);
    toggleShowUpdateForm(); // Show form update
  };

  // Show form Update semester - Start
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => {
    setUpdateForm(!showUpdateForm);
  };
  // Show form Update semester - End

  //Lấy Data gắn qua form Detail
  const [semesterDetail, setSemesterDetail] = useState(null);
  const handleDetailClick = (semester) => {
    setSemesterDetail(semester);
    toggleShowDetailForm(); // Show the update form
  };

  // Show form Detail semester - Start
  const [showDetailForm, setDetailForm] = useState(false);
  const toggleShowDetailForm = () => {
    setDetailForm(!showDetailForm);
  };
  // Show form Detail semester - End

  const [filters, setFilters] = useState({
    semesterId: "",
    status: "",
  });

  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableStatuses] = useState([
    { id: 1, label: "Đang diễn ra" },
    { id: 0, label: "Đã kết thúc" },
    { id: 2, label: "Chưa bắt đầu" },
  ]);

  useEffect(() => {
    // Extract unique semester codes for the filter options
    setAvailableSemesters(
      Array.from(new Set(semesterData.map((item) => item.semesterId)))
    );
  }, [semesterData]);

  useEffect(() => {
    // Filter data based on selected filters
    const filteredData = semesterData.filter(
      (item) =>
        (!filters.semesterId || item.semesterId === filters.semesterId) &&
        (!filters.status || item.status === Number(filters.status))
    );
    setFilteredSemesters(filteredData);
  }, [filters, semesterData]);

  const [filteredSemesters, setFilteredSemesters] = useState(semesterData);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const [sortConfig, setSortConfig] = useState({
    key: "semesterId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredSemesters].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  //#region Paging
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
  //#endregion

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
      const response = await importSemesters(selectedFile);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        handleSemesterReload();
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
  //#region  Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(currentData.map((data) => data.semesterId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectSemester = (semesterId) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(semesterId)
          ? prevSelected.filter((id) => id !== semesterId) // Bỏ chọn nếu đã có
          : [...prevSelected, semesterId] // Thêm nếu chưa
    );
  };

  const handleChangeSelectedStatus = async (semesterId, status) => {
    try {
      const response = await changeSelectedSemesterStatus(semesterId, status);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setSelectedIds([]);
        handleSemesterReload();
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
          <p className="mt-8 text-3xl font-bold">Quản lý học kỳ</p>
        </div>
        <div className="flex ml-3 mt-2">
          <p>Tìm kiếm</p>
          <span className="text-gray-700 md:w-[200px] text-sm  ml-auto mr-[230px]">
            {selectedFile
              ? "File đã chọn: " + selectedFile.name
              : "Chưa chọn file"}
          </span>
        </div>{" "}
        {/* Filter Section */}
        <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-auto md:mb-0">
            {/* Select Semester Code */}
            <select
              name="semesterId"
              value={filters.semesterId}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl"
            >
              <option value="">Mã kỳ học</option>
              {availableSemesters.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
            {/* Select Status */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
            >
              <option value="">Trạng thái</option>
              {availableStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Button Import Zone */}
          <button
            type="button"
            className="ml-auto border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold hover:scale-95 transition-all duration-300"
            onClick={() => handleExportSemester(filters)} // Sử dụng callback hàm
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export Dữ liệu học kỳ
          </button>

          <button
            type="button"
            className="ml-2 border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold  hover:scale-95 transition-all duration-300"
            onClick={() => handleExportEmptyFormSemester()} // Sử dụng callback hàm
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export mẫu thêm học kỳ
          </button>

          <div className="ml-2 flex rounded-full transition-all duration-300 hover:scale-95  mt-2 md:mt-0">
            <button
              type="button"
              className=" border border-white rounded-xl w-full md:w-[112px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleImport}
            >
              <i className="fa fa-check mr-2" aria-hidden="true"></i>
              Import
            </button>{" "}
          </div>
          {/* Button Thêm môn học */}
          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95 mt-2 md:mt-0">
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
              className="ml-2 border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <i className="fa fa-upload mr-2" aria-hidden="true"></i>
              Chọn file Excel thêm học kỳ
            </button>
          </div>
          {/* Button Import Zone */}

          {/* Add Semester Button */}
          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={toggleShowForm}
            >
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              Thêm học kỳ
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
          <table className="min-w-full text-left table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>  {" "}
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("semesterId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Mã học kỳ
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("semesterName")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Tên học kỳ
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Ngày bắt đầu
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("endDate")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Ngày kết thúc
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
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Trạng thái
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
                <th className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue ">
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Thao tác
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                     <td className="p-4 text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.semesterId)}
                        onChange={() =>
                          handleSelectSemester(item.semesterId)
                        }
                      />
                    </td>{" "}
                  <td className="p-4 text-center align-middle">
                    {item.semesterId}
                  </td>
                  <td className="p-4 text-center align-middle">
                    {item.semesterName}
                  </td>
                  <td className="p-4 text-center align-middle">
                    {formatDate(item.startDate)}
                  </td>
                  <td className="p-4 text-center align-middle">
                    {formatDate(item.endDate)}
                  </td>
                  <td className="p-4 text-center align-middle">
                    {item.status === 1
                      ? "Đang diễn ra"
                      : item.status === 2
                      ? "Đã kết thúc"
                      : "Chưa bắt đầu"}
                  </td>
                  <td className="p-4 text-center align-middle">
                    {/* Edit and Detail Buttons */}
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
              ))}
            </tbody>
          </table>

          <div className="w-[600px]">
            <h1 className="text-left ml-1">
              Thay đổi trạng học kỳ đã được chọn:{" "}
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
        {/* Phân trang - start */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        ></Pagination>
        {/* Phân trang - end */}
        {/* Show Form Add New Semester - Start */}
        {showAddForm && (
          <FormAddSemester onSemesterAdded={handleSemesterReload} />
        )}
        {/* Show Form Add New Semester - End */}
        {/* Show Form Update Semester - Start */}
        {showUpdateForm && (
          <>
            <FormUpdateSemester
              semesterToUpdate={semesterToUpdate}
              onSemesterUpdated={handleSemesterReload}
            />
          </>
        )}
        {/* Show Form Update Semester - End */}
        {/* Show Form Detail Semester - Start */}
        {showDetailForm && (
          <>
            <FormDetailSemester
              semesterDetail={semesterDetail}
              onSemesterDetailUpdated={handleSemesterReload}
            ></FormDetailSemester>
          </>
        )}
        {/* Show Form Detail Semester - End */}
      </div>
    </>
  );
}

export default ManageSemester;
