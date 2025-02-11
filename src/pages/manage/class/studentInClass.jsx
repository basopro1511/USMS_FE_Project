import  { useState, useEffect } from "react";
import FormAddStudentInClass from "../../../components/management/StudentInClass/FormAddStudentInClass";
import PopUpRemoveStudentInClass from "../../../components/management/StudentInClass/PopUpRemoveStudentInClass";
function StudentInClass() {
  const [studentData,] = useState([
    {
      studentId: "ThangNT",
      lastName: "Nguyễn",
      middleName: "Toàn",
      firstName: "Thắng",
      phoneNumber: "0123123123",
      email: "ThangNT23912@gmail.com",
      major: "Kỹ thuật phần mềm",
      dateOfBirth: "2002-04-01",
      createdAt: "2020-01-01",
      updatedAt: "2020-01-01",
      personalEmail: "Ex@email.com",
      userAvatar:
        "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg",
    },
    {
      studentId: "ThangNT266",
      lastName: "Nguyễn",
      middleName: "Toàn",
      firstName: "Thắng2",
      phoneNumber: "0123123124",
      email: "ThangNT239@gmail.com",
      major: "Kỹ thuật phần mềm",
      dateOfBirth: "2002-04-01",
      createdAt: "2020-01-01",
      updatedAt: "2020-01-01",
      personalEmail: "Ex@email.com",
      userAvatar:
        "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg",
    },
     {
      studentId: "ThangNT8888",
      lastName: "Nguyễn",
      middleName: "Toàn",
      firstName: "Thắng",
      phoneNumber: "0123123123",
      email: "ThangNT23912@gmail.com",
      major: "Kỹ thuật phần mềm",
      dateOfBirth: "2002-04-01",
      createdAt: "2020-01-01",
      updatedAt: "2020-01-01",
      personalEmail: "Ex@email.com",
      userAvatar:
        "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg",
    },
    {
      studentId: "ThangNT2888",
      lastName: "Nguyễn",
      middleName: "Toàn",
      firstName: "Thắng2",
      phoneNumber: "0123123124",
      email: "ThangNT239@gmail.com",
      major: "Kỹ thuật phần mềm",
      dateOfBirth: "2002-04-01",
      createdAt: "2020-01-01",
      updatedAt: "2020-01-01",
      personalEmail: "Ex@email.com",
      userAvatar:
        "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg",
    },
  ]);

  // Fetch Data Student - Start
  // const handleStudentReload = async () => {
  //   const data = await getStudents(); // Call API to fetch students
  //   setStudentData(data.result); // Update student data
  // };
  // Fetch Data Student - End

  // Add Student Form visibility toggle
  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => setAddForm(!showAddForm);
  // Delete Student

  // const [studentToDelete, setStudentToDelete] = useState(null);
  // const handleDeleteClick = (student) => {
  //   setStudentToDelete(student);
  //   toggleShowDeletePopup();
  // };
 const [showDeletePopup, setDeletePopup] = useState(false);
 const toggleShowDeletePopup =() => setDeletePopup(!showDeletePopup);
  // Filter settings
  const [filters, setFilters] = useState({
    studentId: "",
    studentName: "",
  });

  // Filter and sort functionality
  const [filteredStudents, setFilteredStudents] = useState(studentData);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const filteredData = studentData.filter(
      (item) =>
        // Kiểm tra theo studentId nếu có
        (!filters.studentId || item.studentId.includes(filters.studentId)) &&
        // Kiểm tra theo họ và tên
        (!filters.studentName ||
          (item.firstName +
            " " +
            item.middleName +
            " " +
            item.lastName).toLowerCase().includes(filters.studentName.toLowerCase())) &&
        // Kiểm tra theo chuyên ngành nếu có
        (!filters.major || item.major === filters.major)
    );
    setFilteredStudents(filteredData);
  }, [filters, studentData]);

  const [sortConfig, setSortConfig] = useState({
    key: "studentId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

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
        <p className="mt-8 text-3xl font-bold">Sinh viên trong lớp</p>
      </div>
      <p className="ml-4 mt-5">Tìm kiếm: </p>
      {/* Filter Section */}
      <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
        <div className="flex w-full md:w-auto md:mb-0">
          {/* Select Student Code */}
          <input
            type="text"
            name="studentId"
            value={filters.studentId}
            onChange={handleFilterChange}
            className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
            placeholder="Mã sinh viên"
          />
        </div>
        {/* Button Container */}
        <div className="flex ml-auto space-x-4 mt-2 md:mt-0 mr-4">
          {/* Add Student Button */}
          <button
            type="button"
            className="border border-white rounded-xl w-full md:w-[181px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm sinh viên
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
        <table className="min-w-full text-left table-auto bg-white">
          <thead className="bg-gray-100">
            <tr>
            <th
                  className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("teacherId")}
                >
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
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                <span>Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((student, index) => (
              <tr
                key={student.studentId}
                className="hover:bg-gray-50 even:bg-gray-50"
              >
                <td className="p-4 border-b text-center">{index + 1}</td>
                <td className="p-4 border-b text-center">{student.studentId}</td>
                <td className="p-4 border-b text-center">
                  {student.lastName+ " " + student.middleName + " " + student.firstName}
                </td>
                <td className="p-4 border-b text-center">{student.email}</td>
                <td className="p-4 border-b text-center">{student.phoneNumber}</td>
                <td className="p-4 border-b text-center">{student.major}</td>
                <td className="p-4 border-b text-center">
                  <button
                    onClick={toggleShowDeletePopup}
                    type="button"
                    className="border border-white w-[45px] h-[35px] bg-red-600 text-white font-bold rounded-[10px] transition-all duration-300  hover:scale-95"
                  >
                    <i
                      className="fa fa-trash  w-13 h-21 text-white m-auto"
                      aria-hidden="true"
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Add Student Form */}
      {showAddForm && <FormAddStudentInClass onClose={toggleShowForm} />}
      {showDeletePopup && <PopUpRemoveStudentInClass onClose={toggleShowDeletePopup}/>}
    </div>
  );
}

export default StudentInClass;
