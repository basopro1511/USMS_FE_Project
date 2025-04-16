import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { getSlots } from "../../../services/slotService";
import {
  ChangeScheduleStatus,
  getSchedule,
  getScheduleForStaff,
  UpdateSchedule,
} from "../../../services/scheduleService";
import {
  getClassesIdByMajorId,
  GetClassSubjectById,
} from "../../../services/classService";
import { getRooms } from "../../../services/roomService";
import FormAddSchedule from "../../../components/management/Schedule/FormAddSchedule";
import FormUpdateSchedule from "../../../components/management/Schedule/FormUpdateSchedule";
import PopUpDeleteSchedule from "../../../components/management/Schedule/PopUpRemoveSchedule";
import FormAddAutoSchedule from "../../../components/management/Schedule/FormAddAutoSchedule";
import FormAddScheduleFillByWeek from "../../../components/management/Schedule/FormAddScheduleFillByWeek";

function ManageScheduleByWeek() {
  //#region State & Error
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [filterData, setFilterData] = useState({
    majorId: "",
    classId: "",
    term: 0,
    startDay: "",
    endDay: "",
  });
  // Các state lưu dữ liệu từ API
  const [scheduleData, setScheduleData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [classIdsData, setClassIdsData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [classSubjectData, setClassSubjectData] = useState([]);
  // State cho giá trị của select "Thời gian": JSON chứa { startDate, endDate } của tuần
  const [selectedWeekOption, setSelectedWeekOption] = useState("");
  // State cho ngày đầu tuần hiện tại (dùng để tính toán)
  const [currentWeek, setCurrentWeek] = useState(new Date());
  // State lưu thông tin dành cho form và thao tác khác
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState("");
  const [dataToUpdate, setDataToUpdate] = useState(null);
  // State để lưu ID của lịch cần xóa & hiển thị popup xóa
  const [deleteId, setDeleteId] = useState(null);
  //#endregion

  //#region State ẩn & hiện form
  const [showAddAutoForm, setAddAutoForm] = useState(false);
  const toggleShowAutoForm = () => setAddAutoForm((prev) => !prev);
  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => setAddForm((prev) => !prev);
  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = (data) => {
    setDataToUpdate(data);
    setUpdateForm((prev) => !prev);
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // Fetch lại danh sách sau khi xóa mà không cần reload
  const handleDeleteSuccess = (id) => {
    setScheduleData((prev) => prev.filter((item) => item.scheduleId !== id));
    setShowDeletePopup(false);
  };

  // Khi bấm nút xóa, mở popup xác nhận
  const handleDeleteSchedule = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const [showAddFormFill, setAddFormFill] = useState(false);
  const [preFillData, setPreFillData] = useState(null);
  const openAddScheduleFormByWeekWithPrefill = (date, roomId, slotId) => {
    setPreFillData({ date, roomId, slotId });
    setAddFormFill((prev) => !prev);
  };
  //#endregion

  //#region Fetch Data từ API
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        let scheduleRes;
        if (
          filterData.majorId &&
          filterData.classId &&
          filterData.term &&
          filterData.startDay &&
          filterData.endDay
        ) {
          // Khi đã có đủ filter, gọi API lấy lịch theo bộ lọc
          scheduleRes = await getScheduleForStaff(
            filterData.majorId,
            filterData.classId,
            filterData.term,
            filterData.startDay,
            filterData.endDay
          );
        } else {
          // Nếu thiếu filter, gọi API lấy tất cả lịch
          scheduleRes = await getSchedule();
        }
        setScheduleData(scheduleRes.result || []);
        console.log("Lịch được fetch:", scheduleRes.result);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setScheduleData([]);
      }
    };
    fetchScheduleData();
  }, [
    filterData.majorId,
    filterData.classId,
    filterData.term,
    filterData.startDay,
    filterData.endDay,
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      // Lấy danh sách id duy nhất từ scheduleData
      const distinctIds = Array.from(
        new Set(scheduleData.map((s) => s.classSubjectId))
      );
      const newMap = { ...classSubjectData };
      for (const id of distinctIds) {
        // Nếu đã có trong subjectMap rồi thì bỏ qua
        if (newMap[id]) continue;
        try {
          // Gọi hàm GetClassSubjectById (đảm bảo hàm này trả về đối tượng có property chứa mã môn học,
          // ví dụ: result.subjectCode hoặc thuộc tính tương tự)
          const res = await GetClassSubjectById(id);
          if (res && res.result) {
            // Giả sử result trả về đối tượng với thuộc tính "subjectCode"
            newMap[id] = res.result.classId + "_" + res.result.subjectId;
          }
        } catch (err) {
          console.error("Error fetching subject for id", id, err);
        }
      }
      setClassSubjectData(newMap);
    };

    if (scheduleData.length > 0) {
      fetchSubjects();
    }
  }, [scheduleData]);

  const handleReload = async () => {
    try {
      let scheduleRes;
      if (
        filterData.majorId &&
        filterData.classId &&
        filterData.term &&
        filterData.startDay &&
        filterData.endDay
      ) {
        scheduleRes = await getScheduleForStaff(
          filterData.majorId,
          filterData.classId,
          filterData.term,
          filterData.startDay,
          filterData.endDay
        );
      } else {
        scheduleRes = await getSchedule();
      }
      setScheduleData(scheduleRes.result || []);
    } catch (err) {
      console.error("Error reloading schedule data:", err);
    }
  };
  // --- Fetch dữ liệu chuyên ngành ---
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const majorRes = await getMajors();
        setMajorData(majorRes.result || []);
      } catch (err) {
        console.error("Error fetching majors:", err);
        setMajorData([]);
      }
    };
    fetchMajorData();
  }, []);

  // --- Fetch dữ liệu slot ---
  useEffect(() => {
    const fetchSlotData = async () => {
      try {
        const slotRes = await getSlots();
        setSlotData(slotRes.result || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotData([]);
      }
    };
    fetchSlotData();
  }, []);

  // --- Fetch dữ liệu phòng học ---
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRes = await getRooms();
        // Lấy những phòng có trạng thái active (status === 1)
        const activeRooms = roomRes.result.filter((room) => room.status === 1);
        setRoomData(activeRooms || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRoomData([]);
      }
    };
    fetchRoomData();
  }, []);

  // --- Fetch danh sách ClassId theo MajorId ---
  useEffect(() => {
    const fetchClassIds = async () => {
      if (!filterData.majorId) {
        setClassIdsData([]);
        return;
      }
      try {
        const classIdsRes = await getClassesIdByMajorId(filterData.majorId);
        setClassIdsData(classIdsRes.result || []);
      } catch (err) {
        console.error("Error fetching class IDs:", err);
        setClassIdsData([]);
      }
    };
    fetchClassIds();
  }, [filterData.majorId]);
  //#endregion

  //#region Xử lý Filter Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Nếu thay đổi majorId, reset scheduleData
    if (name === "majorId") {
      setScheduleData([]);
    }
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
    setFilterData((prev) => ({ ...prev, classId: e.target.value }));
  };

  const handleMajorChange = (e) => {
    setSelectedMajorId(e.target.value);
    setFilterData((prev) => ({ ...prev, majorId: e.target.value }));
  };
  //#endregion

  //#region Time Calculator & Xử lý Thời gian

// Thay thế formatDateISO
const formatDateISO = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  // Lấy ngày đầu tuần của 1 ngày (giả sử tuần bắt đầu từ thứ 2)
  const getStartOfWeek = (date) => {
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0: CN, 1: Thứ 2,...
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(currentDate.setDate(diff));
  };

  // Tính danh sách các tuần trong năm (giả sử 52 tuần)
  const getWeeksOfYear = (year) => {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    let startOfWeek = getStartOfWeek(startDate);

    for (let i = 1; i <= 52; i++) {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      weeks.push({
        weekNumber: i,
        startDate: new Date(startOfWeek),
        endDate: new Date(endOfWeek),
      });
      startOfWeek.setDate(startOfWeek.getDate() + 7);
    }
    return weeks;
  };

  const weeksOfYear = getWeeksOfYear(new Date().getFullYear());

  // Lấy danh sách 7 ngày của tuần hiện tại
  const getWeekDates = () => {
    const startOfWeek = getStartOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  // Hàm format ngày (dd/mm)
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  // Hàm format ngày (dd/mm/yyyy) dùng cho select filter
  const formatDateFilter = (date) => {
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const weekDates = getWeekDates();

  // Đồng bộ currentWeek với filterData và selectedWeekOption
  useEffect(() => {
    const startOfWeek = getStartOfWeek(currentWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weekOption = JSON.stringify({
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: endOfWeek.toISOString().split("T")[0],
    });
    setSelectedWeekOption(weekOption);
    setFilterData((prev) => ({
      ...prev,
      startDay: startOfWeek.toISOString().split("T")[0],
      endDay: endOfWeek.toISOString().split("T")[0],
    }));
  }, [currentWeek]);

  // Chuyển sang "Tuần trước"
  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      const startOfWeek = getStartOfWeek(newDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      setFilterData((prevFilter) => ({
        ...prevFilter,
        startDay: startOfWeek.toISOString().split("T")[0],
        endDay: endOfWeek.toISOString().split("T")[0],
      }));
      setSelectedWeekOption(
        JSON.stringify({
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        })
      );
      return newDate;
    });
  };

  // Chuyển sang "Tuần sau"
  const handleNextWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      const startOfWeek = getStartOfWeek(newDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      setFilterData((prevFilter) => ({
        ...prevFilter,
        startDay: startOfWeek.toISOString().split("T")[0],
        endDay: endOfWeek.toISOString().split("T")[0],
      }));
      setSelectedWeekOption(
        JSON.stringify({
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        })
      );
      return newDate;
    });
  };

  const handleWeekChange = (e) => {
    const selectedWeekObj = JSON.parse(e.target.value);
    const matchingWeek = weeksOfYear.find(
      (week) =>
        week.startDate.toISOString().split("T")[0] === selectedWeekObj.startDate
    );
    if (matchingWeek) {
      setCurrentWeek(new Date(matchingWeek.startDate));
      setFilterData((prev) => ({
        ...prev,
        startDay: selectedWeekObj.startDate,
        endDay: selectedWeekObj.endDate,
      }));
      setSelectedWeekOption(e.target.value);
    }
  };
  //#endregion

  //#region Drag & Drop Handlers
  const handleDragStart = (e, schedule) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        scheduleId: schedule.scheduleId,
        originalDate: schedule.date,
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, toRoomId, toSlotId, toDate) => {
    e.preventDefault();
    try {
      const { scheduleId } = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const original = scheduleData.find((s) => s.scheduleId === scheduleId);
      if (!original) return;
      const updated = {
        ...original,
        roomId: toRoomId !== null ? toRoomId : original.roomId,
        slotId: toSlotId !== null ? toSlotId : original.slotId,
        date: toDate || filterData.date,
      };
      const response = await UpdateSchedule(updated);
      if (response && response.isSuccess) {
        setSuccessMessage(response.message);
        setShowAlert("success");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        handleReload();
      } else {
        setErrorMessage(response.message);
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 2000);
      }
    } catch (err) {
      console.error("DragDrop update failed", err);
    }
  };
  //#endregion

  //#region Render Giao diện (UI)
  return (
    <>
      {" "}
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
      {/* --- Filter --- */}
      <div className="flex">
        <p className="ml-3  ">Sắp lịch học theo tuần:</p>
        <p className="ml-24">Filter:</p>
      </div>
      <div className="flex w-auto h-12">
        <div className="flex">
          {/* Select Thời gian */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
            value={selectedWeekOption}
            onChange={handleWeekChange}
          >
            <option value="">Thời gian</option>
            {weeksOfYear.map((week) => (
              <option
                key={week.weekNumber}
                value={JSON.stringify({
                  startDate: week.startDate.toISOString().split("T")[0],
                  endDate: week.endDate.toISOString().split("T")[0],
                })}
              >
                {formatDateFilter(week.startDate)} -{" "}
                {formatDateFilter(week.endDate)}
              </option>
            ))}
          </select>

          {/* Select chuyên ngành */}
          <select
            className="max-w-sm mx-auto ml-6 h-12 w-[230px] border border-black rounded-xl"
            name="majorId"
            value={filterData.majorId}
            onChange={(e) => {
              handleInputChange(e);
              handleMajorChange(e);
            }}
          >
            <option value="">Chọn chuyên ngành</option>
            {majorData.map((major) => (
              <option key={major.majorId} value={major.majorId}>
                {major.majorName}
              </option>
            ))}
          </select>

          {/* Select lớp */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
            name="classId"
            value={filterData.classId}
            onChange={(e) => {
              handleInputChange(e);
              handleClassChange(e);
            }}
          >
            <option value="" selected>
              Lớp
            </option>
            {classIdsData.map((classId) => (
              <option key={classId} value={classId}>
                {classId}
              </option>
            ))}
          </select>

          {/* Select kì học */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
            name="term"
            value={filterData.term}
            onChange={handleInputChange}
          >
            <option value="" selected>
              Kì học
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>
        <div className="flex rounded-full transition-all duration-300 hover:scale-95 ml-auto mr-2">
          <button
            type="button"
            className="border border-white rounded-xl w-[200px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowAutoForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm TKB Tự động
          </button>
        </div>
        <div className="flex rounded-full transition-all duration-300 hover:scale-95  mr-4">
          <button
            type="button"
            className="border border-white rounded-xl w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm TKB
          </button>
        </div>
      </div>
      {/* --- End Filter --- */}
      {/* --- Bảng thời khóa biểu - Manager View theo tuần --- */}
      <div className="ml-3 mr-3 mt-5 h-auto">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">Lịch học trong tuần</h2>
          {/* --- Phân trang --- */}
          <div className="flex mt-5 mb-5  mt-auto ml-3">
            <button
              onClick={handlePreviousWeek}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
            >
              Tuần Trước
            </button>

            <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
              {formatDate(weekDates[0])} Đến {formatDate(weekDates[6])}
            </div>

            <button
              onClick={handleNextWeek}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
            >
              Tuần Sau
            </button>
          </div>
          {/* --- End Phân trang --- */}
        </div>
        <table className="w-full  border-separate border-spacing-0 mb-4">
          <thead>
            <tr>
              <th className="border-t border-l border-black rounded-tl-xl  p-2 bg-secondaryBlue text-white">
                Phòng học
              </th>
              {weekDates.map((date, index) => {
                let dayLabel;
                let extraClass = "";
                if (index + 2 > 7) {
                  dayLabel = "Chủ Nhật";
                  extraClass = "border-r rounded-tr-xl";
                } else {
                  dayLabel = `Thứ ${index + 2}`;
                }
                return (
                  <th
                    key={index}
                    className={`border-t border-l border-black p-2 bg-secondaryBlue text-white ${extraClass}`}
                  >
                    {dayLabel}
                    <br />
                    {formatDateFilter(date)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {roomData.map((room, roomIndex) => {
              const isLastRow = roomIndex === roomData.length - 1;
              return (
                <tr key={room.roomId}>
                  <td className={`border border-black p-2 font-bold ${isLastRow ? 'rounded-bl-xl' : ''}`}>{room.roomId}</td>
                  {weekDates.map((date, idx) => {
                    const cellDate = formatDateISO(date);
                    const isLastCell = idx === weekDates.length - 1;
                    const extraClass = isLastRow && isLastCell ? 'rounded-br-xl' : '';
                    return (
                      <td
                        key={cellDate}
                        className={`border border-black text-center w-[360px] ${extraClass}`}
                        onDragOver={handleDragOver}
                      >
                        {slotData.map((slot) => {
                          // filter schedules for this room, date and slot
                          const schedulesForSlot = scheduleData.filter(
                            (s) => s.roomId === room.roomId && s.date === cellDate && s.slotId === slot.slotId
                          );
                          return schedulesForSlot.length > 0 ? (
                            schedulesForSlot.map((schedule, i) => (
                              <div
                                key={`${slot.slotId}-${i}`}
                                className="border border-black rounded mt-1 mb-1 ml-auto mr-auto bg-gray-100 text-sm flex max-w-[270px]"
                                draggable
                                onDragStart={(e) => handleDragStart(e, schedule)}
                                onDrop={(e) => handleDrop(e, room.roomId, slot.slotId, cellDate)}
                              >
                                <strong>[Slot {slot.slotId}]</strong> {schedule.teacherId}_
                                {classSubjectData[schedule.classSubjectId] || schedule.classSubjectId}
                                <button
                                  type="button"
                                  className="ml-1 border border-white w-[24px] h-[24px] bg-btnBlue text-white font-bold rounded-xl transition-all duration-300 hover:scale-95"
                                  onClick={() => toggleShowUpdateForm(schedule)}
                                >
                                  <i className="fa fa-pencil-square text-black"></i>
                                </button>
                                <button
                                  type="button"
                                  className="border w-[25px] h-[25px] bg-red-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-95"
                                  onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                                >
                                  <i className="fa fa-trash text-black"></i>
                                </button>
                              </div>
                            ))
                          ) : (
                            <div
                              key={slot.slotId}
                              className="relative group"
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, room.roomId, slot.slotId, cellDate)}
                            >
                               <span className="font-bold text-sm mr-auto">[Slot {slot.slotId}]</span>
                               <span className="text-green-500 font-bold group-hover:hidden">
                                Trống 
                              </span>
                              <button
                                className="hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[30px] bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center justify-center"
                                onClick={() => openAddScheduleFormByWeekWithPrefill(cellDate, room.roomId, slot.slotId)}
                              >
                                Thêm lịch
                              </button>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* end Bảng thời khóa biểu */}
      {/* Ẩn & Hiện form */}
      {showAddFormFill && (
        <FormAddScheduleFillByWeek
          onAdded={handleReload}
          initialData={preFillData}
        />
      )}
      {showAddForm && (
        <FormAddSchedule
          selectedClassId={selectedClassId}
          selectedMajorId={selectedMajorId}
          onAdded={handleReload}
        />
      )}
      {showAddAutoForm && (
        <FormAddAutoSchedule
          selectedClassId={selectedClassId}
          selectedMajorId={selectedMajorId}
          onAdded={handleReload}
        />
      )}
      {showUpdateForm && (
        <FormUpdateSchedule
          selectedClassId={selectedClassId}
          selectedMajorId={selectedMajorId}
          dataToUpdate={dataToUpdate}
          onAdded={handleReload}
        />
      )}
      {showDeletePopup && (
        <PopUpDeleteSchedule
          scheduleId={deleteId}
          selectedMajorId={selectedMajorId}
          onDeleted={handleDeleteSuccess}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </>
  );
}
export default ManageScheduleByWeek;
