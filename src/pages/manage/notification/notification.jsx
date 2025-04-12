import { useEffect, useState } from "react";
import { getRequests } from "../../../services/requestService";
import Pagination from "../../../components/management/HeaderFooter/Pagination";
import FormDetailRequest from "../../../components/management/Request/FormDetailRequest";
import FormUpdateRequest from "../../../components/management/Request/FormUpdateRequest";

function Notifications() {
  const [requestData, setRequestData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const pageSize = 9; // Số item mỗi trang
  const [sortConfig, setSortConfig] = useState({
    key: "requestId",
    direction: "asc",
  });

  //#region Fetch Data
  useEffect(() => {
    const fetchRequestData = async () => {
      const response = await getRequests();
      setRequestData(response.result || []);
    };
    fetchRequestData();
  }, []); // Chạy chỉ 1 lần khi component mount
  //#endregion

  //#region Sort
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  const sortedData = [...requestData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  //#endregion

  //#region Paging
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  //#endregion

  //#region Hide & Show Form
  // State requestDetail để lưu request được chọn để xem chi tiết
  const [selectedRequest, setSelectedRequest] = useState(null);
  // State hiển thị form chi tiết
  const [showDetailForm, setShowDetailForm] = useState(false);
  const handleDetailClick = (item) => {
    setSelectedRequest(item);
    setShowDetailForm(true);
  };

  // Hàm toggle để đóng form chi tiết
  const toggleShowDetailForm = () => {
    setShowDetailForm(false);
    setSelectedRequest(null);
  };
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const toggleUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedRequest(null);
  };
  //#region Update Detail Modal
  const handleUpdateClick = (item) => {
    setSelectedRequest(item);
    setShowUpdateForm(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await getRequests();
      setRequestData(response.result || []);
    } catch (error) {
      console.error("Error updating request:", error);
    }
    // Đóng modal cập nhật
    toggleUpdateForm();
  };
  //#endregion

  //#endregion

  //#region Format Date
  // Hàm format date theo kiểu dd/MM/yyyy HH:mm
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Nếu đối tượng Date không hợp lệ, trả về chuỗi rỗng
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  //#endregion
 
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
            name="creator"
            placeholder="Người tạo"
            className="h-12 w-[200px] border border-black rounded-xl px-2"
          />
          <select
            name="status"
            className="h-12 w-[200px] border border-black rounded-xl px-2"
          >
            <option value="">Loại yêu cầu</option>
            <option value="1">Đổi giáo viên dạy</option>
            <option value="2">Đổi lịch dạy</option>
          </select>
          <select
            name="status"
            className="h-12 w-[200px] border border-black rounded-xl px-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Chưa xử lý</option>
            <option value="1">Đã xử lý</option>
          </select>
          <div className="flex ml-auto space-x-4 mt-2 md:mt-0 mr-4">
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => {
                /* toggleShowForm code */
              }}
            >
              <i className="fa fa-arrows-rotate mr-2" aria-hidden="true"></i>
              Chờ xử lí
            </button>
            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => {
                /* toggleShowForm code */
              }}
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
                  <p className="m-auto transition-all hover:scale-105">STT</p>
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
                onClick={() => handleSort("userId")}
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
                onClick={() => handleSort("requestType")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto transition-all hover:scale-105">
                    Loại yêu cầu
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
                onClick={() => handleSort("requestDate")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto transition-all hover:scale-105">
                    Ngày tạo yêu cầu
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
            {currentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">
                  {item.requestId}
                </td>
                <td className="p-4 text-center align-middle">{item.userId}</td>
                <td className="p-4 text-center align-middle">
                  {item.requestType === 1 ? "Đổi giáo viên" : "Đổi lịch dạy"}
                </td>
                <td className="p-4 text-center align-middle">
                  {formatDateTime(item.requestDate)}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.status === 0 ? "Chưa xử lý" : "Đã xử lý"}
                </td>
                <td className="p-4 text-center align-middle">
                  <button
                    className="w-8 h-8 mr-2 bg-primaryBlue text-white rounded-xl hover:bg-blue-700"
                    onClick={() => handleUpdateClick(item)}
                  >
                    <i className="fa-solid fa-pen-fancy"></i>
                  </button>
                  <button
                    className="w-8 h-8 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    onClick={() => handleDetailClick(item)}
                  >
                    <i className="fa-regular fa-address-card"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
      {showDetailForm && (
        <FormDetailRequest
          requestDetail={selectedRequest}
          onClose={toggleShowDetailForm}
        />
      )}{" "}
      {showUpdateForm && selectedRequest && (
        <FormUpdateRequest
          requestDetail={selectedRequest}
          onClose={toggleUpdateForm}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Notifications;
