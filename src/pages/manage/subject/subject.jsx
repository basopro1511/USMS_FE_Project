import { useEffect, useState } from "react";
import FormAddSubject from "../../../components/management/Subject/FormAddSubject";
import FormUpdateSubject from "../../../components/management/Subject/FormUpdateSubject";
import FormDetailSubject from "../../../components/management/Subject/FormDetailSubject";
import {
  changeSelectedSubjecttatus,
  getSubjects,
  handleExportEmptyFormSubject,
  handleExportSubject,
  importSubjects,
} from "../../../services/subjectService";
import Pagination from "../../../components/management/HeaderFooter/Pagination";

function ManageSubject() {
  // Dữ liệu gốc
  const [subjectData, setSubjectData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  // Lấy dữ liệu môn học ngay khi load component
  useEffect(() => {
    const fetchSubjectData = async () => {
      const data = await getSubjects();
      setSubjectData(data.result || []);
    };
    fetchSubjectData();
  }, []);

  // Reload lại dữ liệu (ví dụ: sau khi thêm, sửa...)
  const handleSubjectReload = async () => {
    const data = await getSubjects();
    setSubjectData(data.result || []);
  };

  // Quản lý form Thêm môn học
  const [showAddForm, setShowAddForm] = useState(false);
  const toggleShowAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  // Quản lý form Cập nhật môn học
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [subjectToUpdate, setSubjectToUpdate] = useState(null);
  const toggleShowUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };
  const handleUpdateClick = (subject) => {
    setSubjectToUpdate(subject);
    toggleShowUpdateForm();
  };

  // Quản lý form Chi tiết môn học
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [subjectDetail, setSubjectDetail] = useState(null);
  const toggleShowDetailForm = () => {
    setShowDetailForm(!showDetailForm);
  };
  const handleDetailClick = (subject) => {
    setSubjectDetail(subject);
    toggleShowDetailForm();
  };

  const [filters, setFilters] = useState({
    majorId: "",
    term: "",
    subjectId: "",
    status: "",
  });

  // Trạng thái cố định
  const [availableStatuses] = useState([
    { id: 0, label: "Vô hiệu hóa" },
    { id: 1, label: "Đang diễn ra" },
    { id: 2, label: "Đang tạm hoãn" },
  ]);

  // Mảng cho term, subjectId
  const [availableTerms, setAvailableTerms] = useState([]);
  const [availableSubjectIds, setAvailableSubjectIds] = useState([]);
  
  const availableMajors = Array.from(
    new Set(
      subjectData.map((d) => (d.majorId === null ? "Null" : d.majorId))
    )
  );
  // Lắng nghe thay đổi filter/subjectData
  useEffect(() => {
    let dataByMajor;
    if (filters.majorId) {
      if (filters.majorId === "Null") {
        dataByMajor = subjectData.filter((item) => item.majorId === null);
      } else {
        dataByMajor = subjectData.filter(
          (item) => item.majorId === filters.majorId
        );
      }
    } else {
      dataByMajor = subjectData;
    }

    // Lấy danh sách term duy nhất
    const termSet = new Set(dataByMajor.map((item) => item.term));
    setAvailableTerms(Array.from(termSet));

    // 2) Lọc tiếp theo term
    let dataByTerm = dataByMajor;
    if (filters.term) {
      const termNumber = parseInt(filters.term, 10);
      dataByTerm = dataByTerm.filter((item) => item.term === termNumber);
    }

    // Lấy subjectId duy nhất
    const subjectIdSet = new Set(dataByTerm.map((item) => item.subjectId));
    setAvailableSubjectIds(Array.from(subjectIdSet));
  }, [filters, subjectData]);

  // Áp dụng filter cuối cùng cho bảng
  const filteredData = subjectData.filter((item) => {
    // so sánh majorId
    if (filters.majorId) {
      if (filters.majorId === "Null") {
        if (item.majorId !== null) return false;
      } else {
        if (item.majorId !== filters.majorId) return false;
      }
    }
    // term
    if (filters.term && item.term !== parseInt(filters.term)) return false;
    // subjectId
    if (filters.subjectId && item.subjectId !== filters.subjectId) return false;
    // status
    if (filters.status && item.status !== parseInt(filters.status))
      return false;

    return true;
  });


  const [sortConfig, setSortConfig] = useState({
    key: "subjectId",
    direction: "asc",
  });
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
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
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // reset về trang 1 mỗi khi lọc
  };
  //#region  Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(currentData.map((data) => data.subjectId));
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
      const response = await changeSelectedSubjecttatus(classSubjectId, status);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setSelectedIds([]);
        handleSubjectReload();
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái các môn học:", error);
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
  const HandleImport = async () => {
    if (!selectedFile) {
      setShowAlert("error");
      setErrorMessage("Vui lòng chọn một file Excel trước khi import!");
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    try {
      const response = await await importSubjects(selectedFile);
      if (response.isSuccess) {
        handleSubjectReload();
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
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
          <p className="mt-8 text-3xl font-bold">Quản lý môn học</p>
        </div>
        <div className="flex ml-3 mt-4">
          <p>Tìm kiếm</p>
          <span className="text-gray-700 md:w-[200px] text-sm  ml-auto mr-[240px]">
            {selectedFile ? "File đã chọn: " + selectedFile.name : "Chưa chọn file"}
          </span>
        </div>
        {/* Filter Section */}
        <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
          {/* majorId (chuyên ngành) */}
          <select
            name="majorId"
            value={filters.majorId}
            onChange={handleFilterChange}
            className=" ml-3 h-12 w-full md:w-[180px] border border-black rounded-xl"
          >
            <option value="">Chọn chuyên ngành</option>
            {availableMajors.map((major) => {
              if (major === "Null") {
                return (
                  <option key={major} value="Null">
                    Môn chung
                  </option>
                );
              }
              return (
                <option key={major} value={major}>
                  {major}
                </option>
              );
            })}
          </select>
          {/* term (kì học) */}
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
            className=" ml-3 h-12 w-full md:w-[130px] border border-black rounded-xl"
          >
            <option value="">Kì học</option>
            {availableTerms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {/* subjectId */}
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleFilterChange}
            className="ml-3 h-12 w-full md:w-[180px] border border-black rounded-xl"
          >
            <option value="">Mã môn học</option>
            {availableSubjectIds.map((subId) => (
              <option key={subId} value={subId}>
                {subId}
              </option>
            ))}
          </select>
          {/* status */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className=" ml-3 h-12 w-full md:w-[168px] border border-black rounded-xl"
          >
            <option value="">Trạng thái</option>
            {availableStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
          
          <button
            type="button"
            className="ml-3 border border-white rounded-xl w-full md:w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => handleExportSubject(filters)} // Sử dụng callback hàm
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export Dữ liệu môn học
          </button>
          <button
            type="button"
            className="ml-3 border border-white rounded-xl w-full md:w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => handleExportEmptyFormSubject()} // Sử dụng callback hàm
          >
            <i className="fa fa-download mr-2" aria-hidden="true"></i>
            Export mẫu thêm môn học
          </button>
          {/* Button Xác nhận Import */}
         
          <div className="flex ml-auto  rounded-full transition-all duration-300 hover:scale-95 mr-1 mt-2 md:mt-0">
          <button
            type="button"
            className="ml-auto border border-white rounded-xl w-full md:w-[112px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={HandleImport}
          >
            <i className="fa fa-check mr-2" aria-hidden="true"></i>
            Import
          </button>{" "}
          </div>
          {/* Button Thêm môn học */}
          <div className="flex  rounded-full transition-all duration-300 hover:scale-95 mr-1 mt-2 md:mt-0">
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
              className="border border-white rounded-xl w-full md:w-[150px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <i className="fa fa-upload mr-2" aria-hidden="true"></i>
              Chọn file Excel thêm môn học
            </button>
          </div>
          <div className="flex rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
            {/* Button Import */}

            <button
              type="button"
              className="border border-white rounded-xl w-full md:w-[160px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
              onClick={toggleShowAddForm}
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
                {[
                  { key: "stt", label: "STT" },
                  { key: "subjectId", label: "Mã môn" },
                  { key: "subjectName", label: "Tên môn học" },
                  { key: "majorId", label: "Chuyên ngành" },
                  { key: "term", label: "Kì học" },
                  { key: "numberOfSlot", label: "Số buổi học" },
                  { key: "status", label: "Trạng thái" },
                ].map((col) => (
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
              {currentData.map((item, index) => {
                // Tính STT nối tiếp giữa các trang
                const stt = indexOfFirstItem + (index + 1);
                // Hiển thị major
                // Nếu item.majorId===null => "Môn chung", ngược lại item.majorId
                const displayMajor =
                  item.majorId === null ? "Môn chung" : item.majorId;

                return (
                  <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                    {" "}
                    <td className="p-4 text-center">
                      {" "}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.subjectId)}
                        onChange={() => handleSelectStudent(item.subjectId)}
                      />
                    </td>{" "}
                    <td className="p-4 text-center">{stt}</td>
                    <td className="p-4 text-center">{item.subjectId}</td>
                    <td className="p-4 text-center">{item.subjectName}</td>
                    <td className="p-4 text-center">{displayMajor}</td>
                    <td className="p-4 text-center">{item.term}</td>
                    <td className="p-4 text-center">{item.numberOfSlot}</td>
                    <td className="p-4 text-center">
                      {item.status === 0
                        ? "Vô hiệu hóa"
                        : item.status === 1
                        ? "Đang diễn ra"
                        : item.status === 2
                        ? "Đang tạm hoãn"
                        : "Chưa bắt đầu"}
                    </td>
                    <td className="p-4 text-center align-middle">
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
                );
              })}
            </tbody>
          </table>{" "}
          <div className="">
            <h1 className="text-left ml-1 mt-2">
              Thay đổi trạng môn học đã được chọn:{" "}
            </h1>
            <div className="flex h-10 mb-2 ml-1 ">
              <button
                type="button"
                className=" w-full max-w-[120px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 0)}
              >
                Vô hiệu hóa
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px] mr-2 border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 1)}
              >
                Đang diễn ra
              </button>
              <button
                type="button"
                className="w-full max-w-[140px] h-[40px] sm:h-[40px]border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                onClick={() => handleChangeSelectedStatus(selectedIds, 2)}
              >
                Đang tạm hoãn
              </button>
            </div>
          </div>
        </div>

        {/* Phân trang - Start */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
        {/* Phân trang - End */}
        {/* Form Add Subject */}
        {showAddForm && <FormAddSubject onSubjectAdded={handleSubjectReload} />}
        {/* Form Update Subject */}
        {showUpdateForm && (
          <FormUpdateSubject
            subjectToUpdate={subjectToUpdate}
            onSubjectUpdated={handleSubjectReload}
          />
        )}
        {/* Form Detail Subject */}
        {showDetailForm && (
          <FormDetailSubject
            subjectDetail={subjectDetail}
            onSubjectDetailUpdated={handleSubjectReload}
          />
        )}
      </div>
    </>
  );
}

export default ManageSubject;
