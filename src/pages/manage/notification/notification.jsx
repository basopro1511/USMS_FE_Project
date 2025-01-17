import { useState } from "react";

function Notifications() {
    const [notifications] = useState([
        {
            requestId: "REQ001",
            creator: "Nguyen Van A",
            subject: "PRN221",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-02",
            status: "Đã duyệt",
        },
        {
            requestId: "REQ002",
            creator: "Tran Thi B",
            subject: "PRM123",
            createdAt: "2023-01-03",
            updatedAt: "2023-01-04",
            status: "Chờ xử lý",
        },
        {
            requestId: "REQ003",
            creator: "Le Van C",
            subject: "OCC202",
            createdAt: "2023-02-01",
            updatedAt: "2023-02-02",
            status: "Bị từ chối",
        },
        {
            requestId: "REQ004",
            creator: "Pham Thi D",
            subject: "PRF123",
            createdAt: "2023-03-01",
            updatedAt: "2023-03-02",
            status: "Đang xử lý",
        },
        {
            requestId: "REQ005",
            creator: "Hoang Van E",
            subject: "MLN122",
            createdAt: "2023-04-01",
            updatedAt: "2023-04-02",
            status: "Đã duyệt",
        },
        {
            requestId: "REQ006",
            creator: "Nguyen Thi F",
            subject: "BLN212",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-02",
            status: "Chờ xử lý",
        },
        {
            requestId: "REQ007",
            creator: "Bui Van G",
            subject: "OLM123",
            createdAt: "2023-06-01",
            updatedAt: "2023-06-02",
            status: "Đã duyệt",
        },
        {
            requestId: "REQ008",
            creator: "Do Thi H",
            subject: "PRM223",
            createdAt: "2023-07-01",
            updatedAt: "2023-07-02",
            status: "Bị từ chối",
        },
        {
            requestId: "REQ009",
            creator: "Ngo Van I",
            subject: "AVC123",
            createdAt: "2023-08-01",
            updatedAt: "2023-08-02",
            status: "Đang xử lý",
        },
        {
            requestId: "REQ010",
            creator: "Tran Thi J",
            subject: "JPD123",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-02",
            status: "Đã duyệt",
        },
        {
            requestId: "REQ011",
            creator: "Tran Thi J",
            subject: "JPD223",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-02",
            status: "Đã duyệt",
        },
        {
            requestId: "REQ012",
            creator: "Tran Thi J",
            subject: "MAS123",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-02",
            status: "Đã duyệt",
        },
    ]);

    const [filters, setFilters] = useState({
        searchQuery: "",
        creator: "",
        subject: "",
        status: "",
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // khai báo phần sort trên cột table
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    // hàm xử lí khi tìm kiếm trên thanh search
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };
    // logic xử lí sort  
    const sortedNotifications = [...notifications].sort((a, b) => {
        if (!sortConfig.key) return 0; // Không sắp xếp nếu chưa có key

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (sortConfig.key.includes("At")) { // Sắp xếp ngày tháng
            return sortConfig.direction === "asc"
                ? new Date(aValue) - new Date(bValue)
                : new Date(bValue) - new Date(aValue);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });
    // xử lí trùng lặp bộ lọc với thằng sort
    const filteredNotifications = sortedNotifications.filter((notification) => {
        const matchesRequestId = notification.requestId
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());
        const matchesCreator = filters.creator
            ? notification.creator.toLowerCase().includes(filters.creator.toLowerCase())
            : true;
        const matchesSubject = filters.subject
            ? notification.subject.toLowerCase().includes(filters.subject.toLowerCase())
            : true;
        const matchesStatus = filters.status
            ? notification.status === filters.status
            : true;

        return matchesRequestId && matchesCreator && matchesSubject && matchesStatus;
    });

    // hàm xử lí khi chuyển trang
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentData = filteredNotifications.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= Math.ceil(filteredNotifications.length / pageSize)
        ) {
            setCurrentPage(newPage);
        }
    };
    // hàm xử lí khi sort
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    return (
        <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
            <div className="flex justify-center">
                <p className="mt-8 text-3xl font-bold">Quản lý thông báo</p>
            </div>

            {/* Bộ lọc */}
            <div className="ml-4 mt-5">
                <p>Tìm kiếm:</p>
                <div className="flex gap-4">
                    <input
                        name="searchQuery"
                        placeholder="Mã yêu cầu"
                        className="h-12 w-[200px] border border-black rounded-xl px-2"
                        value={filters.searchQuery}
                        onChange={handleFilterChange}
                    />
                    <input
                        name="creator"
                        placeholder="Người tạo"
                        className="h-12 w-[200px] border border-black rounded-xl px-2"
                        value={filters.creator}
                        onChange={handleFilterChange}
                    />
                    <input
                        name="subject"
                        placeholder="Môn học"
                        className="h-12 w-[200px] border border-black rounded-xl px-2"
                        value={filters.subject}
                        onChange={handleFilterChange}
                    />
                    <select
                        name="status"
                        className="h-12 w-[200px] border border-black rounded-xl px-2"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Đã duyệt">Đã duyệt</option>
                        <option value="Chờ xử lý">Chờ xử lý</option>
                        <option value="Bị từ chối">Bị từ chối</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                    </select>
                    <div className="flex ml-auto space-x-4 mt-2 md:mt-0 mr-4">
                        {/* Nút hiển thị danh sách chờ xử lí */}
                        <button
                            type="button"
                            className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                            onClick={"toggleShowForm"}
                        >
                            <i className="fa fa-arrows-rotate mr-2" aria-hidden="true"></i>
                            Chờ xử lí
                        </button>

                        {/* Nút hiển thị danh sách đã xử lí */}
                        <button
                            type="button"
                            className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
                            onClick={"toggleShowForm"}
                        >
                            <i className="fa fa-check mr-2" aria-hidden="true"></i>
                            Đã xử lí
                        </button>
                    </div>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="w-[1570px] ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
                <table className="w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
                                onClick={() => handleSort("requestId")}

                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Mã yêu cầu
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
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
                                onClick={() => handleSort("creator")}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Người tạo
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
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
                                onClick={() => handleSort("subject")}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Môn học
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
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
                                onClick={() => handleSort("createdAt")}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Ngày tạo
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
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
                                onClick={() => handleSort("updatedAt")}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="m-auto transition-all hover:scale-105">
                                        Ngày chỉnh sửa
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
                                className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold cursor-pointer"
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
                            <th className="p-4 text-center align-middle bg-secondaryBlue text-white font-semibold">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((notification, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center align-middle">{notification.requestId}</td>
                                <td className="p-4 text-center align-middle">{notification.creator}</td>
                                <td className="p-4 text-center align-middle">{notification.subject}</td>
                                <td className="p-4 text-center align-middle">{notification.createdAt}</td>
                                <td className="p-4 text-center align-middle">{notification.updatedAt}</td>
                                <td className="p-4 text-center align-middle">{notification.status}</td>
                                <td className="p-4 text-center align-middle">
                                    <button className="w-8 h-8 mr-2 bg-primaryBlue text-white rounded-xl hover:bg-blue-700">
                                        <i className="fa-solid fa-pen-fancy"></i>
                                    </button>
                                    <button className="w-8 h-8 bg-green-600 text-white rounded-xl hover:bg-green-700">
                                        <i className="fa-regular fa-address-card"></i>
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
        </div>
    );
}

export default Notifications;
