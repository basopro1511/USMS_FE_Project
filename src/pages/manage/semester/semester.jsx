import  { useState, useEffect } from "react";
import FormUpdateSemester from "../../../components/management/Semester/FormUpdateSemester";
import FormAddSemester from "../../../components/management/Semester/FormAddSemester";
import FormDetailSemester from "../../../components/management/Semester/FormDetailSemester";
import { getSemesters } from "../../../services/semesterService";
function ManageSemester() {

// Fetch Data Semester - Start
  const [semesterData, setSemesterData] = useState([]);
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
        { id: 2, label: "Chưa bắt đầu" }
    ]);

    useEffect(() => {
        // Extract unique semester codes for the filter options
        setAvailableSemesters(Array.from(new Set(semesterData.map(item => item.semesterId))));
    }, [semesterData]);

    useEffect(() => {
        // Filter data based on selected filters
        const filteredData = semesterData.filter(item =>
            (!filters.semesterId || item.semesterId === filters.semesterId) &&
            (!filters.status || item.status === Number(filters.status))
        );
        setFilteredSemesters(filteredData);
    }, [filters, semesterData]);

    const [filteredSemesters, setFilteredSemesters] = useState(semesterData);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const [sortConfig, setSortConfig] = useState({ key: "semesterId", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

        const handleSort = (key) => {
            const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
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
                <p className="mt-8 text-3xl font-bold">Quản lý kỳ học</p>
            </div>
            <p className="ml-4 mt-5">Tìm kiếm: </p>
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

                {/* Add Semester Button */}
                <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
                    <button
                        type="button"
                        className="border border-white rounded-xl w-full md:w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                        onClick={toggleShowForm}
                    >
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Thêm kỳ học
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                <table className="min-w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                                onClick={() => handleSort("semesterId")}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Mã kỳ học
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
                                        Tên kỳ học
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
                            <th
                                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                            >
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
                                <td className="p-4 text-center align-middle">{item.semesterId}</td>
                                <td className="p-4 text-center align-middle">{item.semesterName}</td>
                                <td className="p-4 text-center align-middle">{item.startDate}</td>
                                <td className="p-4 text-center align-middle">{item.endDate}</td>
                                <td className="p-4 text-center align-middle">
                                {item.status === 1 ? "Đang diễn ra" : item.status === 0 ? "Đã kết thúc" : "Chưa bắt đầu"}
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

            {/* Show Form Add New Semester - Start */}
            {showAddForm && <FormAddSemester onSemesterAdded={handleSemesterReload} />}
            {/* Show Form Add New Semester - End */}
            
            {/* Show Form Update Semester - Start */}
            {showUpdateForm && (
                <>
                    <FormUpdateSemester semesterToUpdate={semesterToUpdate} onSemesterUpdated={handleSemesterReload} />
                </>
            )}
            {/* Show Form Update Semester - End */}
            {/* Show Form Detail Semester - Start */}
            {showDetailForm && (
                <>
                    <FormDetailSemester semesterDetail={semesterDetail} onSemesterDetailUpdated={handleSemesterReload}></FormDetailSemester>
                </>
            )}
            {/* Show Form Detail Semester - End */}
        </div>
    );
}

export default ManageSemester;
