import React, { useState, useEffect } from "react";

function Semester() {
    const [semesterData] = useState([
        { id: "1", semesterCode: "FA24", semesterName: "Fall2024", startDate: "01/02/2024", endDate: "29/04/2025", status: "2" },
        { id: "2", semesterCode: "SU23", semesterName: "Summer23", startDate: "05/05/2023", endDate: "05/08/2023", status: "2" },
        { id: "3", semesterCode: "SU24", semesterName: "Summer24", startDate: "05/06/2024", endDate: "05/09/2024", status: "2" },
        { id: "4", semesterCode: "SP24", semesterName: "Spring24", startDate: "01/02/2024", endDate: "01/05/2024", status: "2" },
        { id: "5", semesterCode: "SP25", semesterName: "Spring25", startDate: "01/04/2025", endDate: "01/07/2025", status: "1" },
        { id: "6", semesterCode: "SU24", semesterName: "Summer24", startDate: "01/06/2024", endDate: "01/09/2024", status: "1" },
        { id: "7", semesterCode: "FA23", semesterName: "Fall23", startDate: "01/03/2023", endDate: "01/06/2023", status: "1" },
        { id: "8", semesterCode: "FA21", semesterName: "Fall21", startDate: "01/02/2021", endDate: "01/05/2021", status: "1" },
        { id: "9", semesterCode: "SU21", semesterName: "Summer21", startDate: "01/06/2021", endDate: "01/09/2021", status: "1" },
        { id: "10", semesterCode: "SP22", semesterName: "Spring22", startDate: "01/04/2022", endDate: "01/07/2022", status: "1" },
        { id: "11", semesterCode: "SU25", semesterName: "Summer25", startDate: "01/07/2025", endDate: "01/10/2025", status: "1" },
        { id: "12", semesterCode: "SU2020", semesterName: "Summer2020", startDate: "01/08/2020", endDate: "01/11/2020", status: "1" }
    ]);

    const [filters, setFilters] = useState({
        semesterCode: "",
        status: "",
    });

    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [availableStatuses, setAvailableStatuses] = useState([
        { id: "1", label: "Đang diễn ra" },
        { id: "2", label: "Đã kết thúc" },
        { id: "0", label: "Chưa bắt đầu" }
    ]);

    useEffect(() => {
        // Extract unique semester codes for the filter options
        setAvailableSemesters(Array.from(new Set(semesterData.map(item => item.semesterCode))));
    }, [semesterData]);

    useEffect(() => {
        // Filter data based on selected filters
        const filteredData = semesterData.filter(item =>
            (!filters.semesterCode || item.semesterCode === filters.semesterCode) &&
            (!filters.status || item.status === filters.status)
        );
        setFilteredSemesters(filteredData);
    }, [filters, semesterData]);

    const [filteredSemesters, setFilteredSemesters] = useState(semesterData);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const [sortConfig, setSortConfig] = useState({ key: "semesterCode", direction: "asc" });
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
                <p className="mt-8 text-3xl font-bold">Quản lý kì học</p>
            </div>
            {/* Filter Section */}
            <div className="flex w-full h-12 mt-5 flex-wrap md:flex-nowrap">
                <div className="flex w-full md:w-auto mb-2 md:mb-0">
                    {/* Select Semester Code */}
                    <select
                        name="semesterCode"
                        value={filters.semesterCode}
                        onChange={handleFilterChange}
                        className="max-w-sm mx-auto ml-3 h-12 w-full md:w-[230px] border border-black rounded-xl"
                    >
                        <option value="">Mã Kỳ học</option>
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

                    {/* Search Button */}
                    <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95 w-full md:w-auto">
                        <button
                            type="button"
                            className="border border-black rounded-xl w-full md:w-[130px] bg-primaryBlue text-white font-semibold"
                        >
                            <i className="fa fa-search mr-2" aria-hidden="true"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Add Semester Button moved to the right */}
                <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
                    <button
                        type="button"
                        className="border border-white rounded-xl w-full md:w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                    >
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Thêm kì học
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                <table className="min-w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Mã kì học</p>
                                </div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Tên kì học</p>
                                </div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Ngày bắt đầu</p>
                                </div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Ngày kết thúc</p>
                                </div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Trạng thái</p>
                                </div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer text-center align-middle bg-secondaryBlue">
                                <div className="flex items-center justify-between">
                                    <p className="m-auto">Thao Tác</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center align-middle">{item.semesterCode}</td>
                                <td className="p-4 text-center align-middle">{item.semesterName}</td>
                                <td className="p-4 text-center align-middle">{item.startDate}</td>
                                <td className="p-4 text-center align-middle">{item.endDate}</td>
                                <td className="p-4 text-center align-middle">
                                    {item.status === "1" ? "Đang diễn ra" : "Đã kết thúc"}
                                </td>
                                <td className="p-4 text-center align-middle">
                                    {/* Edit and Detail Buttons */}
                                    <div className="flex justify-center space-x-2">
                                        <button className="w-8 h-8 bg-primaryBlue text-white rounded-xl shadow-md hover:bg-blue-700 transition-all hover:scale-125">
                                            <i className="fa-solid fa-pen-fancy"></i>
                                        </button>
                                        <button className="w-8 h-8 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all hover:scale-125">
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
        </div>
    );
}

export default Semester;
