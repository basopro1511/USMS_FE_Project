import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormAddClass from "../../../components/management/Class/FormAddClass";
import FormUpdateClass from "../../../components/management/Class/FormUpdateClass";
import { getClasses } from "../../../services/classService";
function ManageClass() {

  //#region State Error
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    majorName: "",
    classId: "",
    subjectId: "",
    semesterId: "",
  });

  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  //#endregion

  //#region Fetch Data

  // Fetch Data Slot - Start
  useEffect(() => {
    const fetchRoomData = async () => {
      const data = await getClasses(); //Lấy ra list room rtong database
      setData(data.result);
    };
    fetchRoomData();
  }, []);
  //Fetch Data Room - End

  //#endregion

  //#region Filter, Paging, Sort
  // Get all unique values for major, classId, subjectId, and semesterId
  const majors = Array.from(new Set(data.map((item) => item.majorName)));

  useEffect(() => {
    // Bước 1: Lọc theo major (nếu có filter major)
    let filteredSubjects = data.filter((item) =>
      filters.majorName ? item.majorName === filters.majorName : true
    );

    // Bước 2: Lọc subjectId duy nhất từ filteredSubjects
    filteredSubjects = Array.from(
      new Set(filteredSubjects.map((item) => item.subjectId))
    ).map((subjectId) =>
      filteredSubjects.find((item) => item.subjectId === subjectId)
    );
    setAvailableSubjects(filteredSubjects);

    // Bước 3: Lọc các lớp (classes) theo subjectId nếu có filter subjectId
    let filteredClasses = filteredSubjects;
    if (filters.subjectId) {
      filteredClasses = filteredSubjects.filter(
        (item) => item.subjectId === filters.subjectId
      );
    }

    // Bước 4: Lọc classId duy nhất từ filteredClasses
    filteredClasses = Array.from(
      new Set(filteredClasses.map((item) => item.classId))
    ).map((classId) =>
      filteredClasses.find((item) => item.classId === classId)
    );
    setAvailableClasses(filteredClasses);

    // Bước 5: Lọc semesterId duy nhất từ filteredClasses (theo classId hoặc subjectId nếu có filter)
    let filteredSemesters = filteredClasses;
    if (filters.subjectId) {
      filteredSemesters = filteredClasses.filter(
        (item) => item.subjectId === filters.subjectId
      );
    }
    if (filters.classId) {
      filteredSemesters = filteredSemesters.filter(
        (item) => item.classId === filters.classId
      );
    }
    setAvailableSemesters(
      Array.from(new Set(filteredSemesters.map((item) => item.semesterId)))
    );
  }, [filters, data]);

  // Filter data based on selected filters
  const filteredData = data.filter((item) => {
    return (
      (!filters.majorName || item.majorName === filters.majorName) &&
      (!filters.classId || item.classId === filters.classId) &&
      (!filters.subjectId || item.subjectId === filters.subjectId) &&
      (!filters.semesterId || item.semesterId === filters.semesterId)
    );
  });

  const [sortConfig, setSortConfig] = useState({
    key: "classId",
    direction: "asc",
  }); // Sort state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const pageSize = 9; // Items per page

  // Handle sorting logic
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Sort data based on current sort config
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Calculate which items to show based on current page
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(sortedData.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  //#endregion

  //#region Show & Hide from, Handle Reload
  //Update bảng mà không cần reload
  const handleClassReload = async () => {
    const data = await getClasses(); // Gọi API để lấy lại tất cả các lớp
    setData(data.result); // Cập nhật lại dữ liệu lớp
  };
  //Update bảng mà không cần reload
  // Show form Add New class - Start
  const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };
  // Show form Add New class - End

  //Lấy Data gắn qua form Update
  const [classToUpdate, setClassToUpdate] = useState(null);
  const handleUpdateClick = (classItem) => {
    setClassToUpdate(classItem);
    toggleShowUpdateForm(); // Show form update
  };

  // Show form Update semester - Start
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => {
    setUpdateForm(!showUpdateForm);
  };
  // Show form Update semester - End

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  //#endregion

  //#region Render UI
  return (
    <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Quản lý lớp học</p>
      </div>

      {/* Filter Section */}
      <p className="ml-4 mt-5">Tìm kiếm</p>
      <div className="flex w-auto h-12">
        <div className="flex">
          {/* Select Chuyên ngành */}
          <select
            name="major"
            value={filters.majorName}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
          >
            <option value="">Chuyên ngành</option>
            {majors.map((majorName, index) => (
              <option key={index} value={majorName}>
                {majorName}
              </option>
            ))}
          </select>

          {/* Select Môn */}
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
          >
            <option value="">Môn</option>
            {availableSubjects.map((item) => (
              <option key={item.subjectId} value={item.subjectId}>
                {item.subjectId}
              </option>
            ))}
          </select>

          {/* Select Lớp */}
          <select
            name="classId"
            value={filters.classId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
          >
            <option value="">Lớp</option>
            {availableClasses.map((item) => (
              <option key={item.classId} value={item.classId}>
                {item.classId}
              </option>
            ))}
          </select>

          {/* Select Kỳ học */}
          <select
            name="semesterId"
            value={filters.semesterId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[100px] border border-black rounded-xl"
          >
            <option value="">Mã Kì học</option>
            {availableSemesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>
        <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-6 mt-2 md:mt-0">
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

      {/* table - Start */}
      <div className="w-[1565px] ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
        <table className="w-full text-left table-auto bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
            {currentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">{item.classId}</td>
                <td className="p-4 text-center align-middle">
                  {item.subjectId}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.semesterId}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.majorName}
                </td>
                <td className="p-4 text-center align-middle">{item.term}</td>
                <td className="p-4 text-center align-middle">{item.numberOfStudentInClasss}/40</td>
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
                    to={`/studentInClass/${item.classSubjectId}/${item.classId}`}
                  >
                    <button className="w-8 h-8 mr-auto bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all hover:scale-125">
                      <i className="fa-regular fa-address-card"></i>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* table - End */}

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
      {/* Show Form Add New Class - Start */}
      {showAddForm && <FormAddClass onClassAdded={handleClassReload} />}
      {/* Show Form Add New Class - End */}
      {/* Show Form Update Class - Start */}
      {showUpdateForm && (
        <>
          <FormUpdateClass
            classToUpdate={classToUpdate}
            onClassUpdated={handleClassReload}
          />
        </>
      )}
      {/* Show Form Update Class - End */}
    </div>
  );
  //#endregion
}

export default ManageClass;
