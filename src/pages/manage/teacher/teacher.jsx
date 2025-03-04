import React, { useState, useEffect } from "react";
import FormUpdateTeacher from "../../../components/management/Teacher/FormUpdateTeacher";
import FormAddTeacher from "../../../components/management/Teacher/FormAddTeacher";
import FormDetailTeacher from "../../../components/management/Teacher/FormDetailTeacher";
import { getTeachers } from "../../../services/TeacherService";
import { getMajors } from "../../../services/majorService";

function ManageTeacher() {
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
    major: "", // Lưu majorId được chọn
  });

  // Cập nhật filters khi nhập/chọn
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Lọc dữ liệu
  const [filteredTeachers, setFilteredTeachers] = useState(teacherData);

  useEffect(() => {
    const filteredData = teacherData.filter((item) => {
      // Tìm majorName
      // let majorName = "";
      // const foundMajor = majorData.find((m) => m.majorId === item.majorId);
      // if (foundMajor) majorName = foundMajor.majorName;

      // 1. Filter theo userId
      const matchUserId =
        !filters.userId ||
        item.userId.toLowerCase().includes(filters.userId.toLowerCase());

      // 2. Filter theo họ tên (gộp first + middle + last)
      const fullName = `${item.lastName} ${item.middleName} ${item.firstName}`
        .trim()
        .toLowerCase();
      const matchName =
        !filters.teacherName ||
        fullName.includes(filters.teacherName.toLowerCase());

      // 3. Filter theo majorId
      const matchMajor = !filters.major || item.majorId === filters.major;

      return matchUserId && matchName && matchMajor;
    });
    setFilteredTeachers(filteredData);
  }, [filters, teacherData]);

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

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
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
        <p className="mt-8 text-3xl font-bold">Quản lý giáo viên</p>
      </div>

      <p className="ml-4 mt-5">Tìm kiếm: </p>

      {/* Filter Section */}
      <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
        {/* Cột lọc */}
        <div className="flex w-full md:w-auto md:mb-0">
          {/* Lọc theo chuyên ngành */}
          <select
            name="major"
            value={filters.major}
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

          {/* Lọc theo Mã giáo viên */}
          <input
            type="text"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
            placeholder="Mã giáo viên"
          />

          {/* Lọc theo Họ và tên */}
          <input
            type="text"
            name="teacherName"
            value={filters.teacherName}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
            placeholder="Họ và tên"
          />
        </div>

        {/* Button Container */}
        <div className="flex ml-auto space-x-4 mt-2 md:mt-0 mr-4">
          {/* Import Teacher Button */}
          <button
            type="button"
            className="border border-white rounded-xl w-full md:w-[181px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowForm}
          >
            <i className="fa fa-upload mr-2" aria-hidden="true"></i>
            Import giáo viên
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
              <th
                className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                onClick={() => handleSort("userId")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto transition-all hover:scale-105">Mã GV</p>
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
                  <p className="m-auto transition-all hover:scale-105">Email</p>
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
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => {
              // Tìm majorName tương ứng
              const foundMajor = majorData.find(
                (m) => m.majorId === item.majorId
              );
              const majorName = foundMajor
                ? foundMajor.majorName
                : item.majorId;
              return (
                <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
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
                  <td className="p-4 text-center align-middle">{item.email}</td>
                  <td className="p-4 text-center align-middle">{majorName}</td>
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
      </div>

      {/* Phân trang */}
      <div className="flex mt-5">
        {/* Button: Previous */}
        <button
          type="button"
          className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="font-bold text-xl">&lt;</span> Trang Trước
        </button>

        {/* Hiển thị trang hiện tại */}
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
  );
}

export default ManageTeacher;
