import { useEffect, useState } from "react";
import { getRequests } from "../../../services/requestService";
import TeacherViewRequestDetail from "../../../components/user/Teacher/TeacherViewDetailRequest";

function TeacherRequestNotifications() {
  const teacherId = localStorage.getItem("userId");
  const [requestData, setRequestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //#region paging
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "requestId",
    direction: "asc",
  });
  const [filterStatus, setFilterStatus] = useState("");

  //#endregion
  //#region format date
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
  //#region fetch api
  // Lấy dữ liệu request từ API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getRequests();
        if (response.isSuccess && response.result) {
          // Lọc dữ liệu để chỉ lấy các request của giáo viên hiện tại
          const myRequests = response.result.filter(
            (item) => item.userId === teacherId
          );
          setRequestData(myRequests);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [teacherId]);

  const handleReload = async () => {
    const response = await getRequests();
    if (response.isSuccess && response.result) {
      // Lọc dữ liệu để chỉ lấy các request của giáo viên hiện tại
      const myRequests = response.result.filter(
        (item) => item.userId === teacherId
      );
      setRequestData(myRequests);
    setRequestData(myRequests);
  };}
  //#endregion
  //#region fitler data
  // Lọc theo trạng thái nếu có bộ lọc
  useEffect(() => {
    let data = [...requestData];
    if (filterStatus !== "") {
      data = data.filter((item) => String(item.status) === filterStatus);
    }
    setFilteredData(data);
    setCurrentPage(1); // Reset trang khi thay đổi filter
  }, [requestData, filterStatus]);

  // Sắp xếp dữ liệu
  const sortedData = [...filteredData].sort((a, b) => {
    const key = sortConfig.key;
    if (a[key] < b[key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Phân trang
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

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
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
  //#endregion
  return (
    <div className="p-8 bg-white rounded-xl mx-auto max-w-[1600px] ">
      <h1 className="text-3xl font-bold text-center mb-6">Yêu cầu của tôi</h1>
      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Trạng thái:</label>
          <select
            className="border rounded px-2 py-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="0">Chưa xử lý</option>
            <option value="1">Đã xử lý</option>
            <option value="2">Đã hủy</option>
          </select>
        </div>
      </div>
      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => handleSort("requestId")}
              >
                STT
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => handleSort("requestType")}
              >
                Loại yêu cầu
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => handleSort("requestDate")}
              >
                Ngày tạo
              </th>
              <th className="py-2 px-4 border">Trạng thái</th>
              <th className="py-2 px-4 border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                const stt = indexOfFirstItem + (index + 1);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">{stt}</td>
                    <td className="py-2 px-4 border text-center">
                      {item.requestType === 2
                        ? "Đổi thời gian dạy"
                        : item.requestType === 1
                        ? "Đổi người dạy thay thế"
                        : ""}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {" "}
                      {formatDateTime(item.requestDate)}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {item.status === 0 ? "Chưa xử lý" : item.status === 1 ? "Đã xử lý" : "Đã hủy" }
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2 hover:scale-95 transition-all duration-300"
                        onClick={() => handleDetailClick(item)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      <div className="flex items-center items-center mt-5 mb-2">
        <div className="flex items-center space-x-4 ml-auto mr-72">
          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-gray-300 hover:scale-95 border border-white w-[130px] h-[40px] bg-gray-200 text-black font-semibold flex items-center justify-center"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trang Trước
          </button>
          <div className="border-1 border-black rounded-xl w-[220px] h-[40px] bg-gray-100 flex flex-col items-center justify-center">
            <p>{`Trang ${currentPage} trên ${totalPages}`}</p>
          </div>
          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-gray-300 hover:scale-95 border border-white w-[130px] h-[40px] bg-gray-200 text-black font-semibold flex items-center justify-center"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Trang Sau
          </button>
        </div>
        <div>
          <p className="mr-8">{`Mỗi trang: ${pageSize} mục - Tổng: ${totalItems}`}</p>
        </div>
      </div>
      {showDetailForm && (
        <TeacherViewRequestDetail
          requestDetail={selectedRequest}
          onClose={toggleShowDetailForm}
          onReload={handleReload}
        />
      )}{" "}
    </div>
  );
}

export default TeacherRequestNotifications;
