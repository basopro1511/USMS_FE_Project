import { useState, useEffect } from "react";
function FormAddStudentInClass({ onStudentAdded }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // Use alertType to handle success/error

    const [studentData, setStudentData] = useState([
        { studentId: "ThangNT", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng", phoneNumber: "0123123123", email: "ThangNT23912@gmail.com", major: "Kỹ thuật phần mềm", dateOfBirth: "2002-04-01", createdAt: "2020-01-01", updatedAt: "2020-01-01", personalEmail: "Ex@email.com", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg" },
        { studentId: "ThangNT2", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng2", phoneNumber: "0123123124", email: "ThangNT239@gmail.com", major: "Kỹ thuật phần mềm", dateOfBirth: "2002-04-01", createdAt: "2020-01-01", updatedAt: "2020-01-01", personalEmail: "Ex@email.com", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg" },
        { studentId: "ThangNT3", lastName: "Nguyễn", middleName: "Toàn", firstName: "Quoc", phoneNumber: "0123123125", email: "ThangNT23913@gmail.com", major: "Kỹ thuật phần mềm", dateOfBirth: "2002-04-01", createdAt: "2020-01-01", updatedAt: "2020-01-01", personalEmail: "Ex@email.com", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg" },
    ]);

    const [isFormVisible, setIsFormVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const [sortConfig, setSortConfig] = useState({ key: "studentId", direction: "asc" });

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };
    const [filters, setFilters] = useState({ studentId: "", firstName: "" });
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };
    // Add the filteredStudents state here
    const [filteredStudents, setFilteredStudents] = useState(studentData);
    useEffect(() => {
        const filteredData = studentData.filter(
            (item) =>
                // Filter by studentId if available
                (!filters.studentId || item.studentId.includes(filters.studentId)) &&
                // Filter by first name if available
                (!filters.firstName || item.firstName.toLowerCase().includes(filters.firstName.toLowerCase()))
        );
        setFilteredStudents(filteredData);
    }, [filters, studentData]);
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

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await AddStudent(newStudent); // Replace with actual service call
            if (response.isSuccess) {
                setAlertType("success");
                setSuccessMessage(response.message);
                onStudentAdded(response.student);
                setTimeout(() => setAlertType(""), 3000); // Hide alert after 3 seconds
                setIsFormVisible(false);
            } else {
                setAlertType("error");
                setErrorMessage(response.message);
                setTimeout(() => setAlertType(""), 3000); // Hide alert after 3 seconds
            }
        } catch (error) {
            console.error("Error adding student:", error);
            setAlertType("error");
            setErrorMessage("An unexpected error occurred.");
            setTimeout(() => setAlertType(""), 3000);
        }
    };

    const [selectedStudents, setSelectedStudents] = useState([]);

    // Hàm chọn tất cả hoặc bỏ chọn tất cả
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedStudents(filteredStudents.map((student) => student.studentId));
        } else {
            setSelectedStudents([]);
        }
    };

    // Hàm chọn hoặc bỏ chọn một student
    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };
    return (
        <>
            {alertType && (
                <div
                    className={`fixed top-5 right-0 z-50 ${alertType === "error"
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
                            <p className="ml-4 mt-5 text-left">Tìm kiếm: </p>
                            {/* Filter Section */}
                            <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
                                <div className="flex w-full md:w-auto md:mb-0">
                                    {/* Filter by student ID */}
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={filters.studentId}
                                        onChange={handleFilterChange}
                                        className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
                                        placeholder="Mã sinh viên"
                                    />
                                    {/* Filter by first name */}
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={filters.firstName}
                                        onChange={handleFilterChange}
                                        className="max-w-sm mx-auto ml-3 h-12 px-3 w-full md:w-[230px] border border-black rounded-xl"
                                        placeholder="Tên sinh viên"
                                    />
                                </div>
                            </div>
                            <form onSubmit={handleAddStudent}>
                                <div className="w-full overflow-x-auto relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                                    <table className="min-w-full text-left table-auto bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                {/* Table headers */}
                                                <th
                                                    className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                        className="cursor-pointer" // Thêm kích thước rõ ràng cho checkbox
                                                    />
                                                </th>


                                                <th
                                                    className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
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
                                                </th><th
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
                                                </th><th
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
                                                </th><th
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
                                                </th><th
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
                                                </th><th
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
                                                <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((student, index) => (
                                                <tr key={student.studentId} className="hover:bg-gray-50 even:bg-gray-50">
                                                    <td className="p-4 border-b text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(student.studentId)}
                                                            onChange={() => handleSelectStudent(student.studentId)}
                                                            className="cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-4 border-b text-center">{index + 1}</td>
                                                    <td className="p-4 border-b text-center">{student.studentId}</td>
                                                    <td className="p-4 border-b text-center">
                                                        {student.lastName} {student.middleName} {student.firstName}
                                                    </td>
                                                    <td className="p-4 border-b text-center">{student.email}</td>
                                                    <td className="p-4 border-b text-center">{student.phoneNumber}</td>
                                                    <td className="p-4 border-b text-center">{student.major}</td>
                                                    <td className="p-4 border-b text-center">
                                                        <button
                                                            onClick={() => handleAddStudent(student)}
                                                            type="button"
                                                            className="border border-white w-[70px] h-[30px] bg-green-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
                                                        >
                                                            <i className="fa fa-plus text-white"></i>
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
                                <div className="flex justify-center gap-8 mt-10 mb-8">
                                    <button
                                        type="submit"
                                        className="w-[180px] h-[45px] bg-secondaryBlue text-white rounded-md font-bold"
                                        onClick={() => handleAddStudent(student)}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        className="w-[180px] h-[45px] bg-red-500 text-white rounded-md font-bold"
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
}

export default FormAddStudentInClass;
