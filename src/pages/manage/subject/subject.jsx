import { useEffect, useState } from "react";
import FormAddSubject from "../../../components/management/Subject/FormAddSubject";
import FormUpdateSubject from "../../../components/management/Subject/FormUpdateSubject";
import FormDetailSubject from "../../../components/management/Subject/FormDetailSubject";

function ManageSubject() {
    const [subjectData] = useState([
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "SSE203", subjectName: "Intertional", majorId: "2", numberOfSlot: "29", status: "2" },
        { subjectId: "MLN122", subjectName: "Langue", majorId: "1", numberOfSlot: "30", status: "0" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "2" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "27", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "16", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "15", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "PRF192", subjectName: "Program", majorId: "0", numberOfSlot: "30", status: "1" },
        { subjectId: "SSE203", subjectName: "Intertional", majorId: "2", numberOfSlot: "29", status: "2" },
        { subjectId: "SSE203", subjectName: "Intertional", majorId: "1", numberOfSlot: "11", status: "1" },

    ]);
    //Update bảng mà không cần reload
    const handleSubjectReload = async () => {
        const data = await getSemesters(); // Gọi API để lấy lại tất cả các kìkì
        setSemesterData(data.result); // Cập nhật lại dữ liệu kìkì
    };
    // Show form Add New semester - Start
    const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
    const toggleShowForm = () => {
        setAddForm(!showAddForm);
    };
    // Quản lý trạng thái form Edit
    const [subjectToUpdate, setSubjectToUpdate] = useState(null);
    // Hàm xử lý khi bấm nút sửa
    const handleUpdateClick = (subject) => {
        setSubjectToUpdate(subject);
        toggleShowUpdateForm();
    };
    const [showUpdateForm, setUpdateForm] = useState(false);
    const toggleShowUpdateForm = () => {
        setUpdateForm(!showUpdateForm);
    };
    // Hàm xử lí nút edit tới đây hết
    // Dưới đây là hàm xử lí khi nhấn vào nút detail
    const [subjectDetail, setSubjectDetail] = useState(null);
    //Hàm này xử lí khi người dùng ấn vào nút detail
    const handleDetailClick = (subject) => {
        setSubjectDetail(subject);
        //Hiển thị cái trang detail ra
        toggleShowDetailForm();
    };
    const [showDetailForm, setDetailForm] = useState(false);
    const toggleShowDetailForm = () => {
        setDetailForm(!showDetailForm);
    };
    // Hết hàm xử lí khi nhắn nút detail 
    //Hàm xử lí filter
    const [filteredSubjects, setFilteredSubjects] = useState(subjectData);
    const [filter, setFilters] = useState({
        subjectId: "",
        status: "",
    });
    const majors = [
        { id: "0", name: "Kỹ thuật phần mềm" },
        { id: "1", name: "Ngôn ngữ Anh" },
        { id: "2", name: "Quản trị kinh doanh" },
    ];
    // Function to get the major name by majorId
    const getMajorName = (majorId) => {
        const major = majors.find((m) => m.id === majorId);
        return major ? major.name : "Unknown";
    };
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableStatuses] = useState([
        { id: "1", label: "Đang diễn ra" },
        { id: "2", label: "Đã kết thúc" },
        { id: "0", label: "Chưa bắt đầu" }
    ]);

    const [sortConfig, setSortConfig] = useState({ key: "subjectId", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        setAvailableSubjects(Array.from(new Set(subjectData.map(item => item.subjectId))));
    }, [subjectData]);

    useEffect(() => {
        const filteredData = subjectData.filter(item =>
            (!filter.subjectId || item.subjectId === filter.subjectId) &&
            (!filter.status || item.status === filter.status)
        );
        setFilteredSubjects(filteredData);
    }, [filter, subjectData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortedData = [...filteredSubjects].sort((a, b) => {
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
                <p className="mt-8 text-3xl font-bold">Quản lý môn học</p>
            </div>
            <p className="ml-4 mt-5">Tìm kiếm</p>

            {/* Filter Section */}
            <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
                <div className="flex w-full md:w-auto md:mb-0">
                    <select
                        name="subjectId"
                        value={filter.subjectId}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl"
                    >
                        <option value="">Mã môn học</option>
                        {availableSubjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={filter.status}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
                    >
                        <option value="">Trạng thái</option>
                        {availableStatuses.map((status) => (
                            <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                    </select>
                </div>
                {/* Add Semester Button moved to the right */}
                <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
                    <button
                        type="button"
                        className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                        onClick={toggleShowForm}
                    >
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Thêm môn học
                    </button>
                </div>
            </div>
            {/* Table Section */}
            <div className="w-[1570px] overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                <table className="min-w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            {[
                                { key: "subjectId", label: "Mã môn học" },
                                { key: "subjectName", label: "Tên môn học" },
                                { key: "majorId", label: "Chuyên ngành" },
                                { key: "numberOfSlot", label: "Số buổi học" },
                                { key: "status", label: "Trạng thái" }
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
                            <th className="p-4 font-semibold text-center bg-secondaryBlue text-white">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center">{item.subjectId}</td>
                                <td className="p-4 text-center">{item.subjectName}</td>
                                <td className="p-4 text-center">{getMajorName(item.majorId)}</td>
                                <td className="p-4 text-center">{item.numberOfSlot}</td>
                                <td className="p-4 text-center">
                                    {item.status === "1" ? "Đang diễn ra" : item.status === "2" ? "Đã kết thúc" : "Chưa bắt đầu"}
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
            {/* Đường dẫn tới formAddSubject - Start */}
            {showAddForm && <FormAddSubject onSubjectAdded={handleSubjectReload} />}
            {/* Đường dẫn tới formAddSubject - End */}
            {/* Đường dẫn tới form edit - Start */}
            {showUpdateForm && (
                <FormUpdateSubject subjectToUpdate={subjectToUpdate} onSubjectUpdated={handleSubjectReload} />
            )}
            {/* Đường dẫn tới form edit - End */}
            {/*Đường dẫn tới trang form detail - Star */}
            {showDetailForm && (
                <>
                <FormDetailSubject subjectDetail={subjectDetail} onSubjectDetailUpdated={handleSubjectReload}></FormDetailSubject>
                </>
            )}
            {/*Đường dẫn tới trang form detail - End*/}
        </div>
    );
}

export default ManageSubject;
