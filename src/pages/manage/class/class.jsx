import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ManageClass() {
  const [data] = useState([
    { id: "1",  classId: "SE1702", subjectId: "PRM392", semesterId: "FA24", major: "Information Technology", term: "9", status: "1" },
    { id: "2",  classId: "SE1702", subjectId: "PRN231", semesterId: "FA24", major: "Information Technology", term: "9", status: "0" },
    { id: "3",  classId: "SE1703", subjectId: "PRM101", semesterId: "FA24", major: "Computer Science", term: "8", status: "2" },
    { id: "4",  classId: "SE1704", subjectId: "PRM102", semesterId: "FA24", major: "Information Technology", term: "9", status: "1" },
    { id: "5",  classId: "SE1705", subjectId: "PRN202", semesterId: "FA24", major: "Computer Science", term: "8", status: "2" },
    { id: "6",  classId: "SE1706", subjectId: "PRM232", semesterId: "FA24", major: "Mathematics", term: "2", status: "0" },
    { id: "7",  classId: "SE1707", subjectId: "PRM303", semesterId: "FA24", major: "Physics", term: "8", status: "1" },
    { id: "8",  classId: "SE1708", subjectId: "PRM404", semesterId: "FA24", major: "Engineering", term: "9", status: "2" },
    { id: "9",  classId: "SE1709", subjectId: "PRN101", semesterId: "FA25", major: "Information Technology", term: "9", status: "0" },
    { id: "10", classId: "SE1710", subjectId: "PRN102", semesterId: "FA24", major: "Computer Science", term: "8", status: "1" },
    { id: "11", classId: "SE1711", subjectId: "PRM303", semesterId: "FA24", major: "Physics", term: "8", status: "2" },
    { id: "12", classId: "SE1712", subjectId: "PRM404", semesterId: "FA24", major: "Engineering", term: "9", status: "0" },
    { id: "13", classId: "SE1713", subjectId: "PRM503", semesterId: "FA25", major: "Mathematics", term: "9", status: "1" },
    { id: "14", classId: "SE1714", subjectId: "PRN211", semesterId: "FA24", major: "Engineering", term: "9", status: "2" },
    { id: "15", classId: "SE1715", subjectId: "PRM512", semesterId: "FA24", major: "Physics", term: "8", status: "1" },
    { id: "16", classId: "SE1716", subjectId: "PRM400", semesterId: "FA24", major: "Computer Science", term: "9", status: "0" },
    { id: "17", classId: "SE1717", subjectId: "PRM301", semesterId: "FA24", major: "Information Technology", term: "8", status: "2" },
    { id: "18", classId: "SE1718", subjectId: "PRM201", semesterId: "FA25", major: "Mathematics", term: "9", status: "0" },
    { id: "19", classId: "SE1719", subjectId: "PRM302", semesterId: "FA25", major: "Engineering", term: "9", status: "1" },
    { id: "20", classId: "SE1720", subjectId: "PRM303", semesterId: "FA24", major: "Computer Science", term: "8", status: "2" },
    { id: "21", classId: "SE1721", subjectId: "PRM202", semesterId: "FA24", major: "Physics", term: "9", status: "1" },
    { id: "22", classId: "SE1722", subjectId: "PRM301", semesterId: "FA25", major: "Mathematics", term: "9", status: "2" },
    { id: "23", classId: "SE1723", subjectId: "PRM404", semesterId: "FA24", major: "Engineering", term: "9", status: "0" },
    { id: "24", classId: "SE1724", subjectId: "PRM503", semesterId: "FA25", major: "Computer Science", term: "9", status: "1" },
    { id: "25", classId: "SE1725", subjectId: "PRM601", semesterId: "FA24", major: "Information Technology", term: "8", status: "2" },
    { id: "26", classId: "SE1726", subjectId: "PRM404", semesterId: "FA24", major: "Mathematics", term: "8", status: "1" },
    { id: "27", classId: "SE1727", subjectId: "PRN101", semesterId: "FA24", major: "Computer Science", term: "9", status: "0" },
    { id: "28", classId: "SE1728", subjectId: "PRN202", semesterId: "FA25", major: "Physics", term: "9", status: "1" },
    { id: "29", classId: "SE1729", subjectId: "PRM202", semesterId: "FA24", major: "Engineering", term: "8", status: "0" },
    { id: "30", classId: "SE1730", subjectId: "PRM303", semesterId: "FA24", major: "Information Technology", term: "9", status: "1" }
  ]);
  
  const [filters, setFilters] = useState({
    major: "",
    classId: "",
    subjectId: "",
    semesterId: "",
  });

  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  // Get all unique values for major, classId, subjectId, and semesterId
  const majors = Array.from(new Set(data.map(item => item.major)));

  useEffect(() => {
    // Bước 1: Lọc theo major (nếu có filter major)
    let filteredSubjects = data.filter(item => filters.major ? item.major === filters.major : true);
  
    // Bước 2: Lọc subjectId duy nhất từ filteredSubjects
    filteredSubjects = Array.from(new Set(filteredSubjects.map(item => item.subjectId)))
      .map(subjectId => filteredSubjects.find(item => item.subjectId === subjectId));
    setAvailableSubjects(filteredSubjects);
  
    // Bước 3: Lọc các lớp (classes) theo subjectId nếu có filter subjectId
    let filteredClasses = filteredSubjects;
    if (filters.subjectId) {
      filteredClasses = filteredSubjects.filter(item => item.subjectId === filters.subjectId);
    }
    
    // Bước 4: Lọc classId duy nhất từ filteredClasses
    filteredClasses = Array.from(new Set(filteredClasses.map(item => item.classId)))
      .map(classId => filteredClasses.find(item => item.classId === classId));
    setAvailableClasses(filteredClasses);
  
    // Bước 5: Lọc semesterId duy nhất từ filteredClasses (theo classId hoặc subjectId nếu có filter)
    let filteredSemesters = filteredClasses;
    if (filters.subjectId) {
      filteredSemesters = filteredClasses.filter(item => item.subjectId === filters.subjectId);
    }
    if (filters.classId) {
      filteredSemesters = filteredSemesters.filter(item => item.classId === filters.classId);
    }
    setAvailableSemesters(Array.from(new Set(filteredSemesters.map(item => item.semesterId))));
  
  }, [filters, data]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data based on selected filters
  const filteredData = data.filter(item => {
    return (
      (!filters.major || item.major === filters.major) &&
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
  

  return (
    <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Quản lý lớp học</p>
      </div>

      {/* Filter Section */}
      <div className="flex w-auto h-12 mt-5">
        <div className="flex">
          {/* Select Chuyên ngành */}
          <select
            name="major"
            value={filters.major}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
          >
            <option value="">Chuyên ngành</option>
            {majors.map((major, index) => (
              <option key={index} value={major}>
                {major}
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

          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95">
            <button
              type="button"
              className="border border-black rounded-xl w-[130px] bg-primaryBlue text-white font-600"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i>
              Tìm kiếm
            </button>
          </div>
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
                  <p className="m-auto transition-all hover:scale-105">Mã lớp</p>
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
                onClick={() => handleSort("major")}
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
                <td className="p-4 text-center align-middle">{item.major}</td>
                <td className="p-4 text-center align-middle">{item.term}</td>
                <td className="p-4 text-center align-middle">
                  {item.status === "0"
                    ? "Chưa bắt đầu"
                    : item.status === "1"
                    ? "Đang diễn ra"
                    : item.status === "2"
                    ? "Đã kết thúc"
                    : "Không xác định"}
                </td>
                <td className="p-4 text-center align-middle">
                  <button className="w-8 h-8 ml-auto mr-2 bg-primaryBlue text-white rounded-xl shadow-md hover:bg-blue-700 transition-all hover:scale-125">
                  <i className="fa-solid fa-pen-fancy"></i>
                  </button>
                  {/* Button 2 */}
                  <Link to={"/studentInClass"}>
                  <button className="w-8 h-8 mr-auto bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all  hover:scale-125">
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
    </div>
  );
}

export default ManageClass;
