import { useEffect, useState } from "react";
import FormAddRoom from "../../../components/management/Room/FormAddRoom";
import { getRooms } from "../../../services/roomService";
import FormUpdateRoom from "../../../components/management/Room/FormUpdateRoom";
import FormDetailRoom from "../../../components/management/Room/FormDetailRoom";

function ManageRoom() {
  // Fetch Data Room - Start
  const [roomData, setRoomData] = useState([]);
  useEffect(() => {
    const fetchRoomData = async () => {
      const data = await getRooms(); //Lấy ra list room rtong database
      setRoomData(data.result);
    };
    fetchRoomData();
  }, []);
  //Fetch Data Room - End

  //Update bảng mà không cần reload
  const handleRoomReload = async () => {
    const data = await getRooms(); // Gọi API để lấy lại tất cả các phòng
    setRoomData(data.result); // Cập nhật lại dữ liệu phòng
  };
  //Update bảng mà không cần reload

  // Show form Add New Room - Start
  const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };
  // Show form Add New Room - End

  //Lấy Data gắn qua form Update
  const [roomToUpdate, setRoomToUpdate] = useState(null);
  const handleUpdateClick = (room) => {
    setRoomToUpdate(room);
    toggleShowUpdateForm(); // Show form update
  };

  // Show form Update Room - Start
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = () => {
    setUpdateForm(!showUpdateForm);
  };
  // Show form Update Room - End

  //Lấy Data gắn qua form Update
  const [roomDetail, setRoomDetail] = useState(null);
  const handleDetailClick = (room) => {
    setRoomDetail(room);
    toggleShowDetailForm(); // Show the update form
  };

  // Show form Detail Room - Start
  const [showDetailForm, setDetailForm] = useState(false);
  const toggleShowDetailForm = () => {
    setDetailForm(!showDetailForm);
  };
  // Show form Detail Room - End

   
  //Tìm kiếm - start
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredRooms = roomData.filter((room) =>
    room.roomId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //Tìm kiếm - End
  
  // Sort, Lọc, Phân trang- Start
  const [sortConfig, setSortConfig] = useState({
    key: "roomId",
    direction: "asc",
  }); // Sort state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const pageSize = 9; // Items per page
  // Handle sorting logic
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  // Sort data based on current sort config
  const sortedData = [...filteredRooms].sort((a, b) => {
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
        <p className="mt-8 text-3xl font-bold">Quản lý phòng học</p>
      </div>
      <p className="fixed ml-4">Tìm kiếm: </p>
      {/* Filter Section */}
      <div className="flex  w-auto h-12 mt-5 ">
        <div className="flex">
          {/* Select Chuyên ngành */}
          <input
            name="roomId"
            placeholder="Mã phòng học"
            className="max-w-sm mx-auto ml-3 h-12 w-[300px] border border-black rounded-xl px-2"
            value={searchQuery}
            onChange={handleSearchChange}
          ></input>
        </div>
        <div className="flex ml-auto mr-4 rounded-full transition-all duration-300 hover:scale-95">
          <button
            type="button"
            className="border border-white rounded-xl w-auto p-2 bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm phòng học
          </button>
        </div>
      </div>

      {/* table - Start */}
      <div className="w-[1570px] ml-3 relative flex flex-col mt-4 bg-white shadow-md rounded-2xl border border-gray overflow-hidden">
        <table className="w-full text-left table-auto bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                onClick={() => handleSort("roomId")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto transition-all hover:scale-105">
                    Mã phòng học
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
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto">Vị trí </p>
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
                className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto">Trạng thái</p>
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
                className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                onClick={() => handleSort("createAtFormatted")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto">Thời gian tạo </p>
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
                className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                onClick={() => handleSort("updateAtFormatted")}
              >
                <div className="flex items-center justify-between">
                  <p className="m-auto">Thời gian cập nhật</p>
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

              <th className="p-4 font-semibold cursor-pointer hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue ">
                <div className="flex items-center justify-between">
                  <p className="m-auto">Thao tác</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">{item.roomId}</td>
                <td className="p-4 text-center align-middle">
                  {item.location}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.status === 0
                    ? "Vô hiệu hóa"
                    : item.status === 1
                    ? "Đang khả dụng"
                    : item.status === 2
                    ? "Đang bảo trì"
                    : "Không xác định"}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.createAtFormatted}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.updateAtFormatted}
                </td>

                <td className="p-4 text-center align-middle">
                  {/* Update Button */}
                  <button
                    className="w-8 h-8 ml-auto mr-2 bg-primaryBlue text-white rounded-xl shadow-md hover:bg-blue-700 transition-all hover:scale-125"
                    onClick={() => handleUpdateClick(item)}
                  >
                    <i className="fa-solid fa-pen-fancy"></i>
                  </button>
                  {/* Detail button */}
                  <button
                    className="w-8 h-8 mr-auto bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all  hover:scale-125"
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
      {/* table - End */}

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

      {/* Show Form Add New Room - Start */}
      {showAddForm && <FormAddRoom onRoomAdded={handleRoomReload} />}
      {/* Show Form Add New Room - End */}
      {/* Show Form Update Room - Start */}
      {showUpdateForm && (
        <>
          <FormUpdateRoom roomToUpdate={roomToUpdate}  onRoomUpdated={handleRoomReload}/>
        </>
      )}

      {/* Show Form Update Room - End */}
      {/* Show Form Detail Room - Start */}
      {showDetailForm && (
        <>
          <FormDetailRoom roomDetail={roomDetail} onRoomDetailUpdated={handleRoomReload}></FormDetailRoom>
        </>
      )}
      {/* Show Form Detail Room - End */}
    </div>
  );
}

export default ManageRoom;
