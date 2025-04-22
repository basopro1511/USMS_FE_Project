import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormAddClass from "../../../components/management/Class/FormAddClass";
import FormUpdateClass from "../../../components/management/Class/FormUpdateClass";
import {
  changeSelectedClassStatus,
  getClasses,
  handleExportClass,
} from "../../../services/classService";
import Pagination from "../../../components/management/HeaderFooter/Pagination";
import FormAutoAddClass from "../../../components/management/Class/FormAutoAddClass";

function ManageClass() {
  //#region State
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    majorId: "",
    subjectId: "",
    classId: "",
    semesterId: "",
    status: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  // Bảng hiển thị
  const [sortConfig, setSortConfig] = useState({
    key: "classId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const pageSize = 9; // Số item mỗi trang

  //#endregion

  //#region Fetch Data
  useEffect(() => {
    const fetchClassData = async () => {
      const response = await getClasses();
      setData(response.result || []);
    };
    fetchClassData();
  }, []);
  //#endregion

  //#region Filter logic phân tầng
  useEffect(() => {
    // Bước 1: Nếu có chọn majorName, lọc dữ liệu theo majorName. Nếu chưa, lấy toàn bộ data.
    let dataByMajor = filters.majorId
      ? data.filter((item) => item.majorId === filters.majorId)
      : data;

    // Lấy tất cả subjectId duy nhất sau khi lọc
    const subjects = Array.from(
      new Set(dataByMajor.map((item) => item.subjectId))
    );
    setAvailableSubjects(subjects);

    // Bước 2: Nếu có chọn subjectId, tiếp tục lọc trên dataByMajor
    let dataBySubject = filters.subjectId
      ? dataByMajor.filter((item) => item.subjectId === filters.subjectId)
      : dataByMajor;

    // Lấy tất cả classId duy nhất sau khi lọc
    const classes = Array.from(
      new Set(dataBySubject.map((item) => item.classId))
    );
    setAvailableClasses(classes);

    // Bước 3: Nếu có chọn classId, tiếp tục lọc trên dataBySubject
    let dataByClass = filters.classId
      ? dataBySubject.filter((item) => item.classId === filters.classId)
      : dataBySubject;

    // Lấy tất cả semesterId duy nhất sau khi lọc
    const semesters = Array.from(
      new Set(dataByClass.map((item) => item.semesterId))
    );
    setAvailableSemesters(semesters);
  }, [filters, data]);
  //#endregion

  //#region Filter cuối cùng để hiển thị ra bảng
  const filteredData = data.filter((item) => {
    if (filters.majorId && item.majorId !== filters.majorId) return false;
    if (filters.subjectId && item.subjectId !== filters.subjectId) return false;
    if (filters.classId && item.classId !== filters.classId) return false;
    if (filters.semesterId && item.semesterId !== filters.semesterId)  return false;
    if (filters.status !== "" && item.status !== parseInt(filters.status)) return false;
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

  //#region Show & Hide form + Reload
  const handleClassReload = async () => {
    const response = await getClasses();
    setData(response.result || []);
  };

  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };
  const [showAutoAddForm, setAutoAddForm] = useState(false);
  const toggleShowAutoAddForm = () => {
    setAutoAddForm(!showAutoAddForm);
  };
  const [classToUpdate, setClassToUpdate] = useState(null);
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => {
    setUpdateForm(!showUpdateForm);
  };

  const handleUpdateClick = (classItem) => {
    setClassToUpdate(classItem);
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
      setSelectedIds(currentData.map((data) => data.classSubjectId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStudent = (classSubjectId) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(classSubjectId)
          ? prevSelected.filter((id) => id !== classSubjectId) // Bỏ chọn nếu đã có
          : [...prevSelected, classSubjectId] // Thêm nếu chưa
    );
  };

  const handleChangeSelectedStatus = async (classSubjectId, status) => {
    try {
      const response = await changeSelectedClassStatus(classSubjectId, status);
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

  return (
    <>
      {" "}
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
          <p className="mt-8 text-3xl font-bold">Quản lý lớp học</p>
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
            {Array.from(new Set(data.map((d) => d.majorId))).map((major) => (
              <option key={major} value={major}>
                {major}
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

          {/* Select lớp (theo subjectId đã chọn) */}
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
          </select>

          {/* Select kỳ học (tùy chọn) */}
          <select
            name="semesterId"
            value={filters.semesterId}
            onChange={handleFilterChange}
            className="max-w-sm ml-3 h-12 w-[120px] border border-black rounded-xl"
          >
            <option value="">Mã học kỳ</option>
            {availableSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
          
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[140px] border border-black rounded-xl"
          >
            <option value="">Trạng thái</option>
            <option value="0">Chưa bắt đầu</option>
            <option value="1">Đang diễn ra</option>
            <option value="2">Đã kết thúc</option>
          </select>
          <button
          type="button"
          className="ml-auto border border-white rounded-xl w-full md:w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold hover:scale-95 transition-all duration-300"
          onClick={() => handleExportClass(filters)} // Sử dụng callback hàm
        >
          <i className="fa fa-download mr-2" aria-hidden="true"></i>
          Export Dữ liệu lớp học
        </button>
          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95 mt-2 md:mt-0">
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[140px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold mr-2"
              onClick={toggleShowAutoAddForm}
            >
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              Thêm lớp học tự động
            </button>
          </div>
          <div className="flex rounded-full transition-all duration-300 hover:scale-95 mr-6 mt-2 md:mt-0">
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={toggleShowForm}
            >
              <i className="fa fa-plus mr-2" aria-hidden="true"></i>
              Thêm lớp học
            </button>
          </div>
        </div>

        {/* Bảng hiển thị */}
        <div className="w-[1565px] ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
          <table className="w-full text-left table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                {" "}
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
                  onClick={() => handleSort("classId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto transition-all hover:scale-105">
                      Mã lớp
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("semesterId")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Mã học kỳ</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("majorName")}
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("term")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Kì học</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                  onClick={() => handleSort("numberOfStudentInClasss")}
                >
                  <div className="flex items-center justify-between">
                    <p className="m-auto">Sĩ số</p>
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
                  className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
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
                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const stt = indexOfFirstItem + (index + 1);
                return (
                  <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                    <td className="p-4 text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.classSubjectId)}
                        onChange={() =>
                          handleSelectStudent(item.classSubjectId)
                        }
                      />
                    </td>{" "}
                    <td className="p-4 text-center align-middle">{stt}</td>
                    <td className="p-4 text-center align-middle">
                      {item.classId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.subjectId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.semesterId}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.majorName}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.term}
                    </td>
                    <td className="p-4 text-center align-middle">
                      {item.numberOfStudentInClasss}/40
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
                      {/* Button 2: Xem chi tiết hoặc danh sách sinh viên */}
                      <Link
                        to={`/studentInClass/${item.classSubjectId}/${item.classId}/${item.subjectId}`}
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
        {/* Phân trang - Start */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        ></Pagination>
        {/* Phân trang - End */}
        {/* Form thêm lớp học */}
        {showAddForm && <FormAddClass onClassAdded={handleClassReload} />}
        {showAutoAddForm && <FormAutoAddClass onClassesCreated={handleClassReload} />}

        {/* Form cập nhật lớp học */}
        {showUpdateForm && (
          <FormUpdateClass
            classToUpdate={classToUpdate}
            onClassUpdated={handleClassReload}
          />
        )}
      </div>
    </>
  );
}

export default ManageClass;
