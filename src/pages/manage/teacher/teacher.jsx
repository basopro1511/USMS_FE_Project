import React, { useState, useEffect } from "react";
import FormUpdateTeacher from "../../../components/management/Teacher/FormUpdateTeacher";
import FormAddTeacher from "../../../components/management/Teacher/FormAddTeacher";
import FormDetailTeacher from "../../../components/management/Teacher/FormDetailTeacher";

function ManageTeacher() {
    const [teacherData, setTeacherData] = useState([
        { teacherId: "HieuNT", lastName: "Nguyễn", middleName: "Trung", firstName: "Hiếu", phoneNumber: "0123123123", email: "HieuNT239@gmail.com", major: "Kỹ thuật phần mềm", dateOfBirth: "1999-04-01", createdAt: "2023-01-01", updatedAt: "2023-01-01",personalEmail:"Ex@email.com", userAvatar:"https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg" },
        { teacherId: "TuanV", lastName: "Vũ", middleName: "Tuấn", firstName: "Anh", phoneNumber: "0123123124", email: "TuanV@gmail.com", major: "Công nghệ thông tin", dateOfBirth: "1999-04-01", createdAt: "2023-01-01", updatedAt: "2023-01-01",personalEmail:"Ex@email.com", userAvatar:"https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg" },
        { teacherId: "MinhT", lastName: "Trần", middleName: "Minh", firstName: "Tuấn", phoneNumber: "0123123125", email: "MinhT@gmail.com", major: "Hệ thống thông tin", dateOfBirth: "1999-04-01", createdAt: "2023-01-01", updatedAt: "2023-01-01" ,personalEmail:"Ex@email.com", userAvatar:"https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg"},
        // Add more teachers as needed
    ]);
    
    // Add Teacher Form visibility toggle
    const [showAddForm, setAddForm] = useState(false);
    const toggleShowForm = () => setAddForm(!showAddForm);

    // Update Teacher Data
    const [teacherToUpdate, setTeacherToUpdate] = useState(null);
    const handleUpdateClick = (teacher) => {
        setTeacherToUpdate(teacher);
        toggleShowUpdateForm();
    };

    // Update Teacher Form visibility toggle
    const [showUpdateForm, setUpdateForm] = useState(false);
    const toggleShowUpdateForm = () => setUpdateForm(!showUpdateForm);

    // Teacher Details
    const [teacherDetail, setTeacherDetail] = useState(null);
    const handleDetailClick = (teacher) => {
        setTeacherDetail(teacher);
        toggleShowDetailForm();
    };

    // Teacher Detail Form visibility toggle
    const [showDetailForm, setDetailForm] = useState(false);
    const toggleShowDetailForm = () => setDetailForm(!showDetailForm);

    // Filter settings
    const [filters, setFilters] = useState({ teacherId: "", teacherName: "", major: "" });

    // Get unique majors for filtering
    const [availableMajors, setAvailableMajors] = useState([]);
    useEffect(() => {
        setAvailableMajors(Array.from(new Set(teacherData.map(item => item.major))));
    }, [teacherData]);

    // Filter and sort functionality
    const [filteredTeachers, setFilteredTeachers] = useState(teacherData);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };


    useEffect(() => {
        const filteredData = teacherData.filter(item =>
            // Kiểm tra theo teacherId nếu có
            (!filters.teacherId || item.teacherId.includes(filters.teacherId)) &&
            // Kiểm tra theo họ và tên
            (!filters.teacherName ||
                (item.firstName + " " + item.middleName + " " + item.lastName).toLowerCase().includes(filters.teacherName.toLowerCase())) &&
            // Kiểm tra theo chuyên ngành nếu có
            (!filters.major || item.major === filters.major)
        );
        setFilteredTeachers(filteredData);
    }, [filters, teacherData]);

    const [sortConfig, setSortConfig] = useState({ key: "teacherId", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortedData = [...filteredTeachers].sort((a, b) => {
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
                <p className="mt-8 text-3xl font-bold">Quản lý giáo viên</p>
            </div>
            <p className="ml-4 mt-5">Tìm kiếm: </p>
            {/* Filter Section */}
            <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
                <div className="flex w-full md:w-auto md:mb-0">
                    {/* Select Major */}
                    <select
                        name="major"
                        value={filters.major}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
                    >
                        <option value="">Chuyên ngành</option>
                        {availableMajors.map((major, index) => (
                            <option key={index} value={major}>
                                {major}
                            </option>
                        ))}
                    </select>
                    {/* Select Teacher Code */}
                    <input
                        type="text"
                        name="teacherId"
                        value={filters.teacherId}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
                        placeholder="Mã giáo viên"
                    />
                    {/* Select Teacher Name */}
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
                                className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                                onClick={() => handleSort("teacherId")}
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
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                            <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center align-middle">{item.teacherId}</td>
                                <td className="p-4 text-center align-middle">
                                    {item.lastName} {item.middleName} {item.firstName}
                                </td>
                                <td className="p-4 text-center align-middle">{item.phoneNumber}</td>
                                <td className="p-4 text-center align-middle">{item.email}</td>
                                <td className="p-4 text-center align-middle">{item.major}</td>
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

            {/* Form for Add Teacher */}
            {showAddForm && <FormAddTeacher onClose={toggleShowForm}  />}
            {showUpdateForm && (
                <>
                    <FormUpdateTeacher teacherToUpdate={teacherToUpdate} ></FormUpdateTeacher>
                </>
            )}
            {showDetailForm && (
                <>
                    <FormDetailTeacher teacherDetail={teacherDetail} ></FormDetailTeacher>
                </>
            )}
        </div>


    );
}

export default ManageTeacher;
