import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { getSlots } from "../../../services/slotService";
import { getScheduleForStaff } from "../../../services/scheduleService";

function ManageSchedule() {
  //#region State & Error
  const [loading, setLoading] = useState(true); // State hiển thị trạng thái tải dữ liệu
  const [error, setError] = useState(null); // State lưu lỗi khi fetch dữ liệu
  const [selectedWeek, setSelectedWeek] = useState(1); // Lưu tuần được chọn (theo số thứ tự)
  
  // State cho dữ liệu filter (bao gồm: majorId, classId, term, startDay, endDay)
  const [filterData, setFilterData] = useState({
    majorId: "",
    classId: "",
    term: 1,
    startDay: "",
    endDay: "",
  });
  
  // Các state lưu dữ liệu nhận về từ API
  const [scheduleData, setScheduleData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  
  // State dùng cho select "Thời gian", lưu dưới dạng JSON string { startDate, endDate }
  const [selectedWeekOption, setSelectedWeekOption] = useState("");
  
  // State dùng cho ngày đầu tuần hiện tại (để tính toán các ngày trong tuần)
  const [currentWeek, setCurrentWeek] = useState(new Date());
  //#endregion

  //#region Fetch Data từ API
  // --- Fetch lịch theo bộ lọc ---
  useEffect(() => {
    if (
      filterData.majorId &&
      filterData.classId &&
      filterData.term &&
      filterData.startDay &&
      filterData.endDay
    ) {
      const fetchScheduleData = async () => {
        try {
          const scheduleRes = await getScheduleForStaff(
            filterData.majorId,
            filterData.classId,
            filterData.term,
            filterData.startDay,
            filterData.endDay
          );
          if (scheduleRes && scheduleRes.result) {
            setScheduleData(scheduleRes.result);
          } else {
            setError("Không tìm thấy dữ liệu lịch theo bộ lọc");
          }
        } catch (error) {
          console.error("Error fetching schedules:", error);
          setError("Có lỗi xảy ra khi tải lịch.");
        } finally {
          setLoading(false);
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

  // --- Fetch dữ liệu chuyên ngành ---
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const majorRes = await getMajors();
        if (majorRes && majorRes.result) {
          setMajorData(majorRes.result);
        } else {
          setError("Không tìm thấy dữ liệu chuyên ngành");
        }
      } catch (err) {
        console.error("Error fetching majors:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu chuyên ngành");
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
          setError("Không tìm thấy dữ liệu slot");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu slot");
      }
    };
    fetchSlotData();
  }, []);
  //#endregion

  //#region Xử lý Filter Input
  // Hàm xử lý thay đổi các input của filter (majorId, classId, term)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };
  //#endregion

  //#region Time Calculator & Xử lý Thời gian
  // Hàm trả về ngày đầu tuần của một ngày cho trước (giả sử tuần bắt đầu từ thứ 2)
  const getStartOfWeek = (date) => {
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0: CN, 1: Thứ 2,...
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(currentDate.setDate(diff));
  };

  // Hàm tính danh sách các tuần trong năm (52 tuần)
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

  // Hàm trả về danh sách 7 ngày của tuần hiện tại
  const getWeekDates = () => {
    const startOfWeek = getStartOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  // Hàm format ngày tháng dd/mm để hiển thị trong bảng
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  // Hàm format ngày tháng dd/mm/yyyy để hiển thị trong select filter
  const formatDateFilter = (date) => {
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const weekDates = getWeekDates();

  // useEffect này dùng để đồng bộ currentWeek với filterData và selectedWeekOption
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
  }, [currentWeek]);

  // Xử lý chuyển sang "Tuần trước"
  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      const startOfWeek = getStartOfWeek(newDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Cập nhật filterData và selectedWeekOption
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

  // Xử lý chuyển sang "Tuần sau"
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

  // Xử lý khi người dùng chọn tuần từ select "Thời gian"
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

  //#region Render Lịch (TimeTable)
  // Hàm render ô lịch cho một slot và một ngày cụ thể
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
              <div className="flex">
                <div className="flex m-auto">
                  <button
                    type="button"
                    className="border border-white w-[70px] h-[30px] bg-btnBlue text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
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

  // Hàm render các dòng của bảng theo slot (giả sử có 5 slot)
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="text-center">
            Đang tải dữ liệu...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="8" className="text-center text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    // Nếu không có lịch (data rỗng)
    if (!scheduleData || scheduleData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center">
            Không có dữ liệu lịch
          </td>
        </tr>
      );
    }

    const slots = [1, 2, 3, 4, 5];
    return slots.map((slotId) => {
      let extraClass = slotId === 5 ? " rounded-b-xl" : "";
      return (
        <tr key={slotId}>
          <td
            className={`border-t border-l border-black font-bold text-center ${extraClass}`}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Lớp
            </option>
            <option value="SE1702">SE1702</option>
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

          <div className="flex ml-2 rounded-full transition-all duration-300 hover:scale-95">
            <button
              type="button"
              className="border border-black rounded-xl w-[130px] bg-primaryBlue text-white font-600"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i>
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="flex rounded-full transition-all duration-300 hover:scale-95 ml-auto mr-4">
          <button
            type="button"
            className="border border-white rounded-xl w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
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
                Slot
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
  );
  //#endregion
}

export default ManageSchedule;
