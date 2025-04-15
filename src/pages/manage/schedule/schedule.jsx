import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { getSlots } from "../../../services/slotService";
import {
  ChangeScheduleStatus,
  getScheduleForStaff,
} from "../../../services/scheduleService";
import { getClassesIdByMajorId } from "../../../services/classService";
import FormAddSchedule from "../../../components/management/Schedule/FormAddSchedule";
import FormUpdateSchedule from "../../../components/management/Schedule/FormUpdateSchedule";
import PopUpDeleteSchedule from "../../../components/management/Schedule/PopUpRemoveSchedule";
import FormAddAutoSchedule from "../../../components/management/Schedule/FormAddAutoSchedule";

function ManageSchedule() {
  //#region State & Error
  const [, setSelectedWeek] = useState(1); // Số thứ tự của tuần được chọn
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  // State cho dữ liệu filter (majorId, classId, term, startDay, endDay)
  const [filterData, setFilterData] = useState({
    majorId: "",
    classId: "",
    term: 1,
    startDay: "",
    endDay: "",
  });

  // Các state lưu dữ liệu từ API
  const [scheduleData, setScheduleData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [classIdsData, setClassIdsData] = useState([]);

  // State cho giá trị của select "Thời gian" (JSON string: { startDate, endDate })
  const [selectedWeekOption, setSelectedWeekOption] = useState("");
  // State cho ngày đầu tuần hiện tại (dùng để tính toán thời gian hiển thị)
  const [currentWeek, setCurrentWeek] = useState(new Date());
  // Thêm state lưu ClassId
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMajorId, setselectedMajorId] = useState("");
  const [dataToUpdate, setDataUpdate] = useState(null);
  // State để lưu ID của lịch cần xóa
  const [deleteId, setDeleteId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  //#endregion

  //#region State ẩn & hiện form

  const [showAddAutoForm, setAddAutoForm] = useState(false); // Dùng để hiển thị form
  const toggleShowAutoForm = () => {
    setAddAutoForm(!showAddAutoForm);
  };

  const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
  const toggleShowForm = () => {
    setAddForm(!showAddForm);
  };
  const [showUpdateForm, setUpdateForm] = useState(false); // Dùng để hiển thị form
  const toggleShowUpdateForm = (data) => {
    setDataUpdate(data);
    setUpdateForm(!showUpdateForm);
  };

  
  // Fetch lại danh sách sau khi xóa mà không cần reload
  const handleDeleteSuccess = (id) => {
    setScheduleData((prev) =>
      prev.filter((item) => item.scheduleId !== id)
    );
    setShowDeletePopup(false);
  };

  // Khi bấm nút xóa, mở popup xác nhận
  const handleDeleteSchedule = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  //#endregion

  //#region Fetch Data từ API

  // --- Fetch lịch theo filter ---
  useEffect(() => {
    // Nếu đủ thông tin để fetch (chọn đầy đủ major, class, term, startDay, endDay)
    if (
      filterData.majorId &&
      filterData.classId &&
      filterData.term &&
      filterData.startDay &&
      filterData.endDay
    ) {
      // Đặt loading về true và reset error mỗi khi fetch dữ liệu mới
      const fetchScheduleData = async () => {
        try {
          const scheduleRes = await getScheduleForStaff(
            filterData.majorId,
            filterData.classId,
            filterData.term,
            filterData.startDay,
            filterData.endDay
          );

          if (
            scheduleRes &&
            scheduleRes.result &&
            scheduleRes.result.length > 0
          ) {
            setScheduleData(scheduleRes.result);
            console.log(scheduleRes.data);
          } else {
            setScheduleData([]);
          }
        } catch (err) {
          console.error("Error fetching schedules:", err);
          setScheduleData([]);
        }
      };
      fetchScheduleData();
    }
  }, [
    filterData.majorId,
    filterData.classId,
    filterData.term,
    filterData.startDay,
    filterData.endDay,
  ]);

  //Update bảng mà không cần reload
  const handleReload = async () => {
    const data = await getScheduleForStaff(
      filterData.majorId,
      filterData.classId,
      filterData.term,
      filterData.startDay,
      filterData.endDay
    ); // Gọi API để lấy lại tất cả các kì
    setScheduleData(data.result); // Cập nhật lại dữ liệu kì
  };
  //Update bảng mà không cần reload

  // --- Fetch dữ liệu chuyên ngành ---
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const majorRes = await getMajors();
        if (majorRes && majorRes.result) {
          setMajorData(majorRes.result);
        } else {
          setMajorData([]);
        }
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
        if (slotRes && slotRes.result) {
          setSlotData(slotRes.result);
        } else {
          setSlotData([]);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotData([]);
      }
    };
    fetchSlotData();
  }, []);

  //--- Fetch dữ liệu ClassId bởi Major Id
  useEffect(() => {
    const fetchClassIds = async () => {
      // Nếu chưa chọn majorId thì clear
      if (!filterData.majorId) {
        setClassIdsData([]);
        return;
      }
      try {
        const classIdsRes = await getClassesIdByMajorId(filterData.majorId);
        if (classIdsRes && classIdsRes.result) {
          setClassIdsData(classIdsRes.result);
        } else {
          setClassIdsData([]);
        }
      } catch (err) {
        console.error("Error fetching class IDs:", err);
        setClassIdsData([]);
      }
    };
    fetchClassIds();
  }, [filterData.majorId]);

  //#endregion

  //#region Xử lý Filter Input
  // Khi thay đổi input filter (majorId, classId, term, ...)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Nếu thay đổi majorId (hoặc có thể các trường quan trọng khác), reset dữ liệu lịch và lỗi
    if (name === "majorId") {
      setScheduleData([]);
    }
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };

  // Khi chọn class từ dropdown
  const handleClassChange = (event) => {
    setSelectedClassId(event.target.value);
  };
  // Khi chọn majorId từ dropdown
  const handleMajorChange = (event) => {
    setselectedMajorId(event.target.value);
  };
  //#endregion

  //#region Time Calculator & Xử lý Thời gian
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
    const matchingWeek = weeksOfYear.find(
      (week) =>
        new Date(week.startDate).toDateString() ===
        getStartOfWeek(currentWeek).toDateString()
    );
    if (matchingWeek) {
      setSelectedWeek(matchingWeek.weekNumber);
      const weekOption = JSON.stringify({
        startDate: matchingWeek.startDate.toISOString().split("T")[0],
        endDate: matchingWeek.endDate.toISOString().split("T")[0],
      });
      setSelectedWeekOption(weekOption);
      setFilterData((prev) => ({
        ...prev,
        startDay: matchingWeek.startDate.toISOString().split("T")[0],
        endDay: matchingWeek.endDate.toISOString().split("T")[0],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Khi người dùng chọn tuần từ select "Thời gian"
  const handleWeekChange = (e) => {
    const selectedWeekObj = JSON.parse(e.target.value);
    const matchingWeek = weeksOfYear.find(
      (week) =>
        week.startDate.toISOString().split("T")[0] === selectedWeekObj.startDate
    );
    if (matchingWeek) {
      setCurrentWeek(new Date(matchingWeek.startDate));
      setSelectedWeek(matchingWeek.weekNumber);
      setFilterData((prev) => ({
        ...prev,
        startDay: selectedWeekObj.startDate,
        endDay: selectedWeekObj.endDate,
      }));
      setSelectedWeekOption(e.target.value);
    }
  };
  //#endregion

  const handleChangeScheduleStatus = async (majorId, classId, term, status) => {
    try {
      const response = await ChangeScheduleStatus(
        filterData.majorId,
        filterData.classId,
        filterData.term,
        status
      );
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        handleReload();
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

  //#region Render Lịch (TimeTable)
  // Render các ô lịch cho 1 ngày và slot cụ thể
  const renderCellForDay = (day, slotId) => {
    const daySchedules = scheduleData.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const weekDay = scheduleDate.getDay(); // 0: CN, 1: Thứ 2,...
      return weekDay === day && schedule.slotId === slotId;
    });

    if (daySchedules.length > 0) {
      return daySchedules.map((schedule) => {
        const formatTime = (timeStr) => (timeStr ? timeStr.slice(0, 5) : "N/A");
        const slotInfo = slotData.find(
          (item) => item.slotId === schedule.slotId
        );
        const startTime = slotInfo ? formatTime(slotInfo.startTime) : "N/A";
        const endTime = slotInfo ? formatTime(slotInfo.endTime) : "N/A";

        return (
          <td key={schedule.classScheduleId} className="pt-1 pb-1 flex">
            <div className="p-2 border border-black w-[190px] h-auto m-auto rounded-2xl bg-whiteBlue">
              <div>
                Mã môn học:
                <span className="ml-1 font-bold text-boldBlue">
                  {schedule.subjectId}
                </span>
              </div>
              <div>
                Thời gian:
                <span className="ml-1 font-bold text-quaternartyGreen">
                  {startTime} - {endTime}
                </span>
              </div>
              <div>
                Phòng học:
                <span className="ml-1 ">
                  {schedule.roomId ? schedule.roomId : "Trống"}
                </span>
              </div>
              <div>
                Giáo viên:
                <span className="ml-1 font-bold text-red-500">
                  {schedule.teacherId ? schedule.teacherId : "Trống"}
                </span>
              </div>
              <div>
                Tiết học số:
                <span className="ml-1 font-bold text-red-500">
                  {schedule.slotNoInSubject}
                </span>
              </div>
              <div className="flex">
                <div className="flex m-auto">
                  <button
                    type="button"
                    className="border border-white w-[70px] h-[30px] bg-btnBlue text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
                    onClick={() => toggleShowUpdateForm(schedule)}
                  >
                    <i
                      className="fa fa-pencil-square w-13 h-21 text-black m-auto"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div style={{ marginRight: "auto" }}>
                  <button
                    type="button"
                    className="border border-white w-[70px] h-[30px] bg-red-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
                    onClick={() =>
                      handleDeleteSchedule(schedule.scheduleId)
                    }
                  >
                    <i
                      className="fa fa-trash w-13 h-21 text-black m-auto"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </td>
        );
      });
    }
    return null;
  };

  // Render các dòng (dựa theo slot, giả sử có 5 slot)
  const renderTableRows = () => {
    const slots = [1, 2, 3, 4, 5];
    return slots.map((slotId) => {
      let extraClass = slotId === 5 ? " rounded-b-xl" : "";
      return (
        <tr key={slotId}>
          <td
            className={`border-t border-l border-black font-bold text-center${extraClass}`}
          >
            Slot {slotId}
          </td>
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <td
              key={`${slotId}-${day}`}
              className="border-t border-l border-black"
            >
              {renderCellForDay(day, slotId)}
            </td>
          ))}
        </tr>
      );
    });
  };
  //#endregion

  //#region Render Giao diện (UI)
  return (
    <>
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
      <div className="border border-white mt-4 w-[1600px] h-auto bg-white rounded-2xl mb-5">
        <div className="flex">
          <p className="m-auto text-3xl font-bold mt-8">Thời Khóa Biểu</p>
        </div>

        {/* --- Filter --- */}
        <div className="flex w-auto h-12 mt-5">
          <div className="flex">
            {/* Select chuyên ngành */}
            <select
              className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
              name="majorId"
              value={filterData.majorId}
              onChange={(e) => {
                handleInputChange(e);
                handleMajorChange(e);
              }}
            >
              <option value="" disabled>
                Chọn chuyên ngành
              </option>
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
              <option value="" disabled>
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
              <option value="" disabled>
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

            {/* Select Thời gian */}
            <select
              className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
              value={selectedWeekOption}
              onChange={handleWeekChange}
            >
              <option value="" disabled>
                Thời gian
              </option>
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

        {/* --- Bảng thời khóa biểu --- */}
        <div className="ml-3 mr-3 mt-5 h-auto">
          <table className="w-[1570px] border rounded-2xl border-separate border-spacing-0 border-b-black border-r-black">
            <thead>
              <tr className="bg-secondaryBlue text-white rounded-xl">
                <th className="border-t border-l border-black rounded-tl-xl">
                  Buổi
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
                      className={`border-t border-l border-black ${extraClass}`}
                    >
                      {dayLabel}
                      <br />
                      {formatDate(date)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          {/* --- End Bảng thời khóa biểu --- */}

          <div className="">
            <h1 className="text-left mt-1">
              Trạng thái thời khóa biểu:{"  "}
              <span
                className={`text-lg font-bold ${
                  scheduleData && scheduleData.length > 0
                    ? scheduleData[0].status === 1
                      ? "text-green-500"
                      : "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {scheduleData && scheduleData.length > 0
                  ? scheduleData[0].status === 1
                    ? "Đang khả dụng"
                    : "Vô hiệu hóa"
                  : "Không có dữ liệu"}
              </span>
            </h1>

            <div className="flex w-full mt-1">
              <button
                type="button"
                className=" w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                onClick={() =>
                  handleChangeScheduleStatus(
                    filterData.majorId,
                    filterData.classId,
                    filterData.term,
                    0
                  )
                }
              >
                Vô hiệu hóa
              </button>
              <button
                type="button"
                className="ml-1 w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-green-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-green-600 mt-auto mb-auto"
                onClick={() =>
                  handleChangeScheduleStatus(
                    filterData.majorId,
                    filterData.classId,
                    filterData.term,
                    1
                  )
                }
              >
                Khả dụng
              </button>
            </div>
          </div>

          {/* Ẩn & hiện form start */}
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
          {/* Ẩn & hiện form end */}

          {/* --- Phân trang --- */}
          <div className="flex mt-5 mb-5">
            <button
              onClick={handlePreviousWeek}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
            >
              <span className="font-bold text-xl">&lt;</span> Tuần Trước
            </button>

            <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
              {formatDate(weekDates[0])} Đến {formatDate(weekDates[6])}
            </div>

            <button
              onClick={handleNextWeek}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
            >
              Tuần Sau <span className="font-bold text-xl">&gt;</span>
            </button>
          </div>
          {/* --- End Phân trang --- */}
        </div>
      </div>
    </>
  );
  //#endregion
}
export default ManageSchedule;
