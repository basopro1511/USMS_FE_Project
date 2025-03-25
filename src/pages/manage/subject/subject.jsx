import { useEffect, useState } from "react";
import FormAddSubject from "../../../components/management/Subject/FormAddSubject";
import FormUpdateSubject from "../../../components/management/Subject/FormUpdateSubject";
import FormDetailSubject from "../../../components/management/Subject/FormDetailSubject";
import { getSubjects } from "../../../services/subjectService";

function ManageSubject() {
  // Dữ liệu gốc
  const [subjectData, setSubjectData] = useState([]);

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

  // -------------------------------
  //            FILTER
  // -------------------------------
  const [filters, setFilters] = useState({
    majorId: "",
    term: "",
    subjectId: "",
    status: "",
  });

  // Trạng thái cố định
  const [availableStatuses] = useState([
    { id: 0, label: "Chưa bắt đầu" },
    { id: 1, label: "Đang diễn ra" },
    { id: 2, label: "Đã kết thúc" },
  ]);

  // Mảng cho term, subjectId
  const [availableTerms, setAvailableTerms] = useState([]);
  const [availableSubjectIds, setAvailableSubjectIds] = useState([]);

  // Tính danh sách major: *kể cả* null => "__NULL__"
  // Lưu ý: "Chung" => ta quy ước hiển thị
  const availableMajors = Array.from(
    new Set(
      subjectData.map((d) =>
        d.majorId === null ? "__NULL__" : d.majorId
      )
    )
  );

  // Lắng nghe thay đổi filter/subjectData
  useEffect(() => {
    // 1) Lọc theo majorId (nếu có)
    // Chuyển filters.majorId="__NULL__" => item.majorId===null
    let dataByMajor;
    if (filters.majorId) {
      if (filters.majorId === "__NULL__") {
        dataByMajor = subjectData.filter((item) => item.majorId === null);
      } else {
        dataByMajor = subjectData.filter((item) => item.majorId === filters.majorId);
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
      if (filters.majorId === "__NULL__") {
        // user muốn "Môn chung"
        if (item.majorId !== null) return false;
      } else {
        // user chọn majorId thực
        if (item.majorId !== filters.majorId) return false;
      }
    }
    // term
    if (filters.term && item.term !== parseInt(filters.term)) return false;
    // subjectId
    if (filters.subjectId && item.subjectId !== filters.subjectId) return false;
    // status
    if (filters.status && item.status !== parseInt(filters.status)) return false;

    return true;
  });

  // -------------------------------
  //            SORT
  // -------------------------------
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

  // -------------------------------
  //            PAGING
  // -------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(sortedData.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // reset về trang 1 mỗi khi lọc
  };

  return (
    <div className="border mt-4 h-auto pb-7 w-[1600px] bg-white rounded-2xl">
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Quản lý môn học</p>
      </div>
      <p className="ml-4 mt-5">Tìm kiếm</p>

      {/* Filter Section */}
      <div className="flex w-full h-12 flex-wrap md:flex-nowrap">
        {/* majorId (chuyên ngành) */}
        <select
          name="majorId"
          value={filters.majorId}
          onChange={handleFilterChange}
          className=" ml-3 h-12 w-full md:w-[160px] border border-black rounded-xl"
        >
          <option value="">Chọn chuyên ngành</option>
          {availableMajors.map((major) => {
            if (major === "__NULL__") {
              return (
                <option key={major} value="__NULL__">
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

        {/* Button Thêm môn học */}
        <div className="flex ml-auto rounded-full transition-all duration-300 hover:scale-95 mr-4 mt-2 md:mt-0">
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
              const displayMajor = item.majorId === null ? "Môn chung" : item.majorId;

              return (
                <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                  <td className="p-4 text-center">{stt}</td>
                  <td className="p-4 text-center">{item.subjectId}</td>
                  <td className="p-4 text-center">{item.subjectName}</td>
                  <td className="p-4 text-center">{displayMajor}</td>
                  <td className="p-4 text-center">{item.term}</td>
                  <td className="p-4 text-center">{item.numberOfSlot}</td>
                  <td className="p-4 text-center">
                    {item.status === 1
                      ? "Đang diễn ra"
                      : item.status === 2
                      ? "Đã kết thúc"
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
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex mt-5">
        <button
          type="button"
          className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="font-bold text-xl">&lt;</span> Trang Trước
        </button>

        <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
          <p>{`Trang ${currentPage}`}</p>
        </div>

        <button
          type="button"
          className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Trang Sau <span className="font-bold text-xl">&gt;</span>
        </button>
      </div>

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
  );
}

export default ManageSubject;
