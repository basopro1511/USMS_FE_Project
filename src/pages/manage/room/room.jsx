import { useEffect, useState } from "react";
import FormAddRoom from "../../../components/management/Room/FormAddRoom";
import {
  changeSelectedRoomStatus,
  getRooms,
  handleExportEmptyFormRoom,
  handleExportRoom,
  importRooms,
} from "../../../services/roomService";
import FormUpdateRoom from "../../../components/management/Room/FormUpdateRoom";
import FormDetailRoom from "../../../components/management/Room/FormDetailRoom";
import Pagination from "../../../components/management/HeaderFooter/Pagination";

function ManageRoom() {

  const [roomData, setRoomData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); 

  //#region Fetch Data
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
  //#endregion

  //#region Show & Hide form

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
  //#endregion

  //#region  Sort & filter & paging

  //Tìm kiếm - start
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const [filters, setFilters] = useState({
    status: "",
  });
  const [availableStatuses] = useState([
    { id: 1, label: "Đang khả dụng" },
    { id: 0, label: "Vô hiệu hóa" },
    { id: 2, label: "Đang bảo trì" },
  ]);
  const [filteredRooms, setFilteredRooms] = useState(roomData);
  useEffect(() => {
    const filteredData = roomData.filter((room) =>
      (room.roomId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filters.status || room.status === Number(filters.status))
    );
    setFilteredRooms(filteredData);
  }, [filters, roomData, searchQuery]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
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
  // Giả sử sortedData, currentPage, và pageSize đã được tính sẵn
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

  //#region  Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(currentData.map((data) => data.roomId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStudent = (classSubjectId) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(classSubjectId)
          ? prevSelected.filter((id) => id !== classSubjectId) // Bỏ chọn nếu đã có
          : [...prevSelected, classSubjectId] // Thêm nếu chưa
    );
  };

  const handleChangeSelectedStatus = async (classSubjectId, status) => {
    try {
      const response = await changeSelectedRoomStatus(classSubjectId, status);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setSelectedIds([]);
        handleRoomReload();
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái các sinh viên:", error);
      setShowAlert("error");
      setErrorMessage(error.message);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  //#endregion

  //#region chọn import file excel
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleImport = async () => {
    if (!selectedFile) {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn một file Excel trước khi import!");
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    try {
      const response = await await importRooms(selectedFile);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        handleRoomReload();
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      setShowAlert("error");
      setErrorMessage("Import thất bại. Vui lòng thử lại!");
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Lỗi khi thêm giáo viên:", error);
    }
  };

  //#endregion

  return (
    <>
      {" "}
      {/* Notification Start */}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
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
              {showAlert === "error" ? (
                <span>
                  <strong>Thất bại:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Thành công:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Notification End */}
      <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
        <div className="flex justify-center">
          <p className="mt-8 text-3xl font-bold">Quản lý phòng học</p>
        </div>
        <div className="flex ml-3 mt-2">
          <p>Tìm kiếm</p>
          <span className="text-gray-700 md:w-[200px] text-sm  ml-auto mr-[250px]">
            {selectedFile
              ? "File đã chọn: " + selectedFile.name
              : "Chưa chọn file"}
          </span>
        </div>{" "}
        {/* Filter Section */}
        <div className="flex w-auto h-12">
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
          {/* Button Import Zone */}
          <button
            type="button"
            className="ml-auto border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold hover:scale-95 transition-all duration-300"
            onClick={() => handleExportRoom(filteredRooms)}
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export Dữ liệu phòng học
          </button>

          <button
            type="button"
            className="ml-2 border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold  hover:scale-95 transition-all duration-300"
            onClick={() => handleExportEmptyFormRoom()}
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export mẫu thêm phòng học
          </button>

          <div className="ml-2 flex rounded-full transition-all duration-300 hover:scale-95  mt-2 md:mt-0">
            <button
              type="button"
              className=" border border-white rounded-xl w-full md:w-[112px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleImport}
            >
              <i className="fa fa-check mr-2" aria-hidden="true"></i>
              Import
            </button>{" "}
          </div>
          {/* Button Thêm môn học */}
          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95 mt-2 md:mt-0">
            {/* Input ẩn để chọn file */}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="mr-2 border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <i className="fa fa-upload mr-2" aria-hidden="true"></i>
              Chọn file Excel thêm phòng học
            </button>
          </div>
          {/* Button Import Zone */}

          <div className="flex mr-4 rounded-full transition-all duration-300 hover:scale-95">
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
                {" "}
                <th className="p-4 font-semibold cursor-pointer transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedIds.length === currentData.length &&
                      currentData.length > 0
                    }
                  />
                </th>{" "}
                <th
                  className="p-4 font-semibold cursor-pointer  transition-all hover:bg-primaryBlue text-white text-center align-middle bg-secondaryBlue "
                  onClick={() => handleSort("stt")}
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
              {currentData.map((item, index) => {
                const stt = indexOfFirstItem + (index + 1);

                return (
                  <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                    <td className="p-4 text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.roomId)}
                        onChange={() => handleSelectStudent(item.roomId)}
                      />
                    </td>{" "}
                    <td className="p-4 text-center align-middle">{stt}</td>
                    <td className="p-4 text-center align-middle">
                      {item.roomId}
                    </td>
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
                );
              })}
            </tbody>
          </table>{" "}
          <div className="">
            <h1 className="text-left ml-1">
              Thay đổi trạng phòng học đã được chọn:{" "}
            </h1>
            <div className="flex w-full h-10 mb-2 ml-1 ">
              <button
                type="button"
                className=" w-full max-w-[120px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 0)}
              >
                Vô hiệu hóa{" "}
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 1)}
              >
                Đang khả dụng
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px]border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 2)}
              >
                Đang bảo trì
              </button>
            </div>
          </div>
        </div>
        {/* table - End */}
        {/* Phân trang - Start */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        ></Pagination>
        {/* Phân trang - End */}
        {/* Show Form Add New Room - Start */}
        {showAddForm && <FormAddRoom onRoomAdded={handleRoomReload} />}
        {/* Show Form Add New Room - End */}
        {/* Show Form Update Room - Start */}
        {showUpdateForm && (
          <>
            <FormUpdateRoom
              roomToUpdate={roomToUpdate}
              onRoomUpdated={handleRoomReload}
            />
          </>
        )}
        {/* Show Form Update Room - End */}
        {/* Show Form Detail Room - Start */}
        {showDetailForm && (
          <>
            <FormDetailRoom
              roomDetail={roomDetail}
              onRoomDetailUpdated={handleRoomReload}
            ></FormDetailRoom>
          </>
        )}
        {/* Show Form Detail Room - End */}
      </div>
    </>
  );
}

export default ManageRoom;
