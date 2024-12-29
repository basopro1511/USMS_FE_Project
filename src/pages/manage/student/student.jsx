import { useEffect, useState } from "react";
import FormAddStudent from "../../../components/management/Student/FormAddStudent";
import FormUpdateStudent from "../../../components/management/Student/FormUpdateStudent";
import FormDetailStudent from "../../../components/management/Student/FormDetailStudent";

function ManageStudent() {
    const [studentData] = useState([
        { studentId: "CE160815", firstName: "Nguyen", middleName: "Toan", lastName: "Thang", majorId: "0", age: 22, startYear: 2016, email: "ThangNTCE160815@example.com", phone: "0123456789", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang theo học" },
        { studentId: "CE160461", firstName: "Nguyen", middleName: "Tuan", lastName: "Thinh", majorId: "1", age: 22, startYear: 2016, email: "lethib@example.com", phone: "0987654321", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang tạm hoãn" },
        { studentId: "CE170288", firstName: "Nguyen", middleName: "Quoc", lastName: "Hoang", majorId: "2", age: 21, startYear: 2017, email: "HoangNQCE170288@fpt.edu.vn", phone: "0112233445", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đã tốt nghiệp" },
        { studentId: "CE170724", firstName: "Phan", middleName: "Le Thai", lastName: "Nam", majorId: "0", age: 21, startYear: 2017, email: "NamPLTCE170724@fpt.edu.vn", phone: "0223344556", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang theo học" },
        { studentId: "CE170717", firstName: "Le", middleName: "Duc", lastName: "An", majorId: "0", age: 21, startYear: 2017, email: "anldce170717@fpt.edu.vn", phone: "0223244556", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đã tốt nghiệp" },
        { studentId: "CE160815", firstName: "Nguyen", middleName: "Toan", lastName: "Thang", majorId: "0", age: 22, startYear: 2016, email: "ThangNTCE160815@example.com", phone: "0123456789", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang tạm hoãn" },
        { studentId: "CE160461", firstName: "Nguyen", middleName: "Tuan", lastName: "Thinh", majorId: "1", age: 22, startYear: 2016, email: "lethib@example.com", phone: "0987654321", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đã tốt nghiệp" },
        { studentId: "CE170288", firstName: "Nguyen", middleName: "Quoc", lastName: "Hoang", majorId: "2", age: 21, startYear: 2017, email: "HoangNQCE170288@fpt.edu.vn", phone: "0112233445", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang tạm hoãn" },
        { studentId: "CE170724", firstName: "Phan", middleName: "Le Thai", lastName: "Nam", majorId: "0", age: 21, startYear: 2017, email: "NamPLTCE170724@fpt.edu.vn", phone: "0223344556", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang theo học" },
        { studentId: "CE170717", firstName: "Le", middleName: "Duc", lastName: "An", majorId: "0", age: 21, startYear: 2017, email: "anldce170717@fpt.edu.vn", phone: "0223244556", dateOfBirth: "2002-02-20", userAvatar: "https://binhminhdigital.com/StoreData/PageData/3429/Tim-hieu-ve-ban-quyen-hinh-anh%20(3).jpg", status:"Đang theo học" },
    ]);

    const majorMapping = {
        "0": "Khoa học máy tính",
        "1": "Công nghệ phần mềm",
        "2": "Kỹ thuật mạng"
    };
    //Update bảng mà không cần reload
    const handleStudentReload = async () => {
        const data = await getStudents(); // Gọi API để lấy lại tất cả các kìkì
        studentData(data.result); // Cập nhật lại dữ liệu kìkì
    };
    // Show form Add New Student - Start
    const [showStudentForm, setAddForm] = useState(false); // Dùng để hiển thị form
    const toggleShowForm = () => {
        setAddForm(!showStudentForm);
    };
    // Show form Add New Room - End

    //Lấy Data gắn qua form Update
    const [studentToUpdate, setStudentToUpdate] = useState(null);
    const handleUpdateClick = (student) => {
        setStudentToUpdate(student);
        toggleShowUpdateForm(); // Show form update
    };

    // Show form Update Student - Start
    const [showUpdateForm, setUpdateForm] = useState(false);
    const toggleShowUpdateForm = () => {
        setUpdateForm(!showUpdateForm);
    };
    // Show form Update Room - End

    //Lấy Data gắn qua form Update
    const [studentDetail, setStudentDetail] = useState(null);
    const handleDetailClick = (student) => {
        setStudentDetail(student);
        toggleShowDetailForm(); // Show the update form
    };

    // Show form Detail Room - Start
    const [showDetailForm, setDetailForm] = useState(false);
    const toggleShowDetailForm = () => {
        setDetailForm(!showDetailForm);
    };
    // Show form Detail Room - End

    const [filteredStudents, setFilteredStudents] = useState(studentData);
    const [filter, setFilters] = useState({
        studentId: "",
        startYear: "",
    });

    const [sortConfig, setSortConfig] = useState({ key: "studentId", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        const filteredData = studentData.filter(item =>
            (!filter.majorId || item.majorId === filter.majorId) &&
            (!filter.startYear || item.startYear === parseInt(filter.startYear)) &&
            (!filter.studentId || item.studentId.includes(filter.studentId)) &&
            (!filter.fullName || (`${item.firstName} ${item.middleName} ${item.lastName}`.toLowerCase().includes(filter.fullName.toLowerCase())))
        );
        setFilteredStudents(filteredData);
    }, [filter, studentData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortedData = [...filteredStudents].sort((a, b) => {
        if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
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
    // Sort, Filter Paging - End

    return (
        <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
            <div className="flex justify-center">
                <p className="mt-8 text-3xl font-bold">Quản lý sinh viên</p>
            </div>
            <p className="ml-4 mt-5">Tìm kiếm</p>
            {/* Filter Section */}
            <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
                <div className="flex w-full md:w-auto md:mb-0">
                    <select
                        name="majorId"
                        value={filter.majorId}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl"
                    >
                        <option value="">Chuyên ngành</option>
                        {[...new Set(studentData.map(student => student.majorId))].map((majorId) => (
                            <option key={majorId} value={majorId}>
                                {majorMapping[majorId]}
                            </option>
                        ))}
                    </select>;

                    <select
                        name="startYear"
                        value={filter.startYear}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
                    >
                        <option value="">Kỳ học</option>
                        {[...new Set(studentData.map(item => item.startYear))].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="studentId"
                        placeholder="Tìm kiếm theo mã số sinh viên"
                        value={filter.studentId}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl px-3"
                    />

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Tìm kiếm theo họ và tên"
                        value={filter.fullName}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl px-3"
                    />
                </div>
                {/* Add Semester Button moved to the right */}
                <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
                    <button
                        type="button"
                        className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                        onClick={toggleShowForm}
                    >
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Thêm sinh viên
                    </button>
                </div>
            </div>
            {/*Bảng hiển thị thông tin học sinh*/}
            <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                <table className="min-w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            {[{ key: "studentId", label: "Mã sinh viên" },
                            { key: "fullName", label: "Họ và Tên" },
                            { key: "majorId", label: "Chuyên ngành" },
                            { key: "email", label: "Email" },
                            { key: "phone", label: "Số điện thoại" },
                            { key: "startYear", label: "Kỳ học" },
                            { key: "status", label: "Trạng thái" },
                            ].map(col => (
                                <th
                                    key={col.key}
                                    className="p-4 font-semibold cursor-pointer text-center bg-secondaryBlue text-white"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="m-auto">{col.label}</p>
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
                            ))}
                            <th className="p-4 font-semibold text-center bg-secondaryBlue text-white">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center">{item.studentId}</td>
                                <td className="p-4 text-center">{`${item.firstName} ${item.middleName} ${item.lastName}`}</td>
                                <td className="p-4 text-center">{majorMapping[item.majorId]}</td>
                                <td className="p-4 text-center">{item.email}</td>
                                <td className="p-4 text-center">{item.phone}</td>
                                <td className="p-4 text-center">{item.startYear}</td>
                                <td className="p-4 text-center">{item.status}</td>
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
                {/* Phân trang - start */}
                <div className="flex mt-5 mb-8">
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
                {/* Đường dẫn tới formAddSubject - Start */}
                {showStudentForm && <FormAddStudent onStudentAdded={handleStudentReload} />}
                {/* Đường dẫn tới formAddSubject - End */}
                {/* Show Form Update Room - Start */}
                {showUpdateForm && (
                    <>
                        <FormUpdateStudent studentToUpdate={studentToUpdate} onStudentUpdated={handleStudentReload} />
                    </>
                )}
                {showDetailForm && (
                    <>
                        <FormDetailStudent studentDetail={studentDetail} onStudentDetailUpdated={handleStudentReload}></FormDetailStudent>
                    </>
                )}
                {/* Show Form Detail Room - End */}
            </div>
        </div>
    );
}

export default ManageStudent;
