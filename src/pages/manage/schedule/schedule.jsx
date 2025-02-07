import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { getSlots } from "../../../services/slotService";
import { getScheduleForStaff } from "../../../services/scheduleService";
import { getClassesIdByMajorId } from "../../../services/classService";
import FormAddSchedule from "../../../components/management/Schedule/FormAddSchedule";

function ManageSchedule() {
  //#region State & Error
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu lỗi khi fetch dữ liệu
  const [, setSelectedWeek] = useState(1); // Số thứ tự của tuần được chọn

  const [showAddForm, setAddForm] = useState(false); // Dùng để hiển thị form
  const toggleShowForm = () => {
      setAddForm(!showAddForm);
  };
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

  const [selectedClassId, setSelectedClassId] = useState(""); // 🔹 Thêm state lưu ClassId

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
      setLoading(true);
      setError(null);

      const fetchScheduleData = async () => {
        try {
          const scheduleRes = await getScheduleForStaff(
            filterData.majorId,
            filterData.classId,
            filterData.term,
            filterData.startDay,
            filterData.endDay
          );

          if (scheduleRes && scheduleRes.result && scheduleRes.result.length > 0) {
            setScheduleData(scheduleRes.result);
            setError(null); // xoá lỗi cũ nếu có
          } else {
            setScheduleData([]);
            setError("Không tìm thấy dữ liệu lịch theo bộ lọc");
          }
        } catch (err) {
          console.error("Error fetching schedules:", err);
          setScheduleData([]);
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

    //Update bảng mà không cần reload
      const handleReload = async () => {
          const data = await getScheduleForStaff(   filterData.majorId,
            filterData.classId,
            filterData.term,
            filterData.startDay,
            filterData.endDay); // Gọi API để lấy lại tất cả các kì
            setScheduleData(data.result); // Cập nhật lại dữ liệu kì
      };
      //Update bảng mà không cần reload


  // --- Fetch dữ liệu chuyên ngành ---
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        setError(null); // reset error trước khi fetch majors
        const majorRes = await getMajors();
        if (majorRes && majorRes.result) {
          setMajorData(majorRes.result);
        } else {
          setMajorData([]);
          setError("Không tìm thấy dữ liệu chuyên ngành");
        }
      } catch (err) {
        console.error("Error fetching majors:", err);
        setMajorData([]);
        setError("Có lỗi xảy ra khi tải dữ liệu chuyên ngành");
      }
    };
    fetchMajorData();
  }, []);

  // --- Fetch dữ liệu slot ---
  useEffect(() => {
    const fetchSlotData = async () => {
      try {
        setError(null); // reset error trước khi fetch slots
        const slotRes = await getSlots();
        if (slotRes && slotRes.result) {
          setSlotData(slotRes.result);
        } else {
          setSlotData([]);
          setError("Không tìm thấy dữ liệu slot");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotData([]);
        setError("Có lỗi xảy ra khi tải dữ liệu slot");
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
        setError(null);
        const classIdsRes = await getClassesIdByMajorId(filterData.majorId);
        if (classIdsRes && classIdsRes.result) {
          setClassIdsData(classIdsRes.result);
        } else {
          setClassIdsData([]);
          setError("Không tìm thấy dữ liệu lớp cho chuyên ngành này");
        }
      } catch (err) {
        console.error("Error fetching class IDs:", err);
        setClassIdsData([]);
        setError("Có lỗi xảy ra khi tải danh sách lớp.");
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
      setError(null);
      setLoading(true);
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
        const slotInfo = slotData.find((item) => item.slotId === schedule.slotId);
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

  // Render các dòng (dựa theo slot, giả sử có 5 slot)
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
                {formatDateFilter(week.startDate)} - {formatDateFilter(week.endDate)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-full transition-all duration-300 hover:scale-95 ml-auto mr-4">
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
        {showAddForm && <FormAddSchedule  selectedClassId={selectedClassId} onAdded={handleReload} />}

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
