import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getScheduleForStudent } from "../../../services/scheduleService";
import { getSlots } from "../../../services/slotService";

const StudentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  //#region State & Error
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [, setSelectedWeek] = useState(1); // Số thứ tự của tuần được chọn
  const [slotData, setSlotData] = useState([]);

  //#region  Login Data
  const userId = localStorage.getItem("userId");
  // Dung de check Role la Student hay la Teacher de hien thi nut bam tuong ung voi ROLE
  //#endregion

  // State cho dữ liệu filter (majorId, classId, term, startDay, endDay)
  const [filterData, setFilterData] = useState({
    studentId: userId,
    startDay: "",
    endDay: "",
  });

  // State cho giá trị của select "Thời gian" (JSON string: { startDate, endDate })
  const [selectedWeekOption, setSelectedWeekOption] = useState("");
  // State cho ngày đầu tuần hiện tại (dùng để tính toán thời gian hiển thị)
  const [currentWeek, setCurrentWeek] = useState(new Date());
  //#endregion

  //#region Fetch Data từ API

  // --- Fetch lịch theo filter ---
  useEffect(() => {
    // Nếu đủ thông tin để fetch (chọn đầy đủ major, class, term, startDay, endDay)
    if (filterData.studentId && filterData.startDay && filterData.endDay) {
      // Đặt loading về true và reset error mỗi khi fetch dữ liệu mới
      setLoading(true);
      const fetchScheduleData = async () => {
        try {
          const scheduleRes = await getScheduleForStudent(
            filterData.studentId,
            filterData.startDay,
            filterData.endDay
          );
          if (
            scheduleRes &&
            scheduleRes.result &&
            scheduleRes.result.length > 0
          ) {
            const available = scheduleRes.result.filter(
              (item) => item.status === 1
            );
            setScheduleData(available);
            console.log(available);
          } else {
            setScheduleData([]);
          }
        } catch (err) {
          console.error("Error fetching schedules:", err);
          setScheduleData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchScheduleData();
    }
  }, [filterData.studentId, filterData.startDay, filterData.endDay]);

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
  //#endregion

  //#region Xử lý Filter Input

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

  // #region Render Lịch (TimeTable)

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
          <td key={schedule.scheduleId} className="pt-1 pb-1  flex ">
            <div className="p-2 border border-black w-[190px] h-auto m-auto rounded-2xl bg-whiteBlue">
              <div className="text-left">
              <div className="text-[14px] sm:text-[16px] md:text-[18px]">
                Môn:{" "}
                <Link                       
                 to={`/studentActivityDetail/${schedule.scheduleId}`}
                  className="text-blue-600 font-bold hover:text-blue-900 cursor-pointer hover:underline"
                >
                  {schedule.subjectId}
                </Link>
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
            Buổi {slotId}
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
  return (
    <div className="w-full max-w-[1920px] mb-5 p-4">
      <div className="m-auto mt-2 w-full max-w-[1600px] text-center">
        {/* Title */}
        <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-primaryGreen mb-6">
          Lịch học hàng tuần
        </h1>

        {/* Select Inputs */}
        <div className="flex mb-3">
          <div className="flex flex-row items-center mb-4 ml-auto mr-auto">
            <label className="text-[18px] sm:text-[24px] mx-2 ml-5">
              Chọn Thời gian:
            </label>
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
        </div>

        {/* Schedule Table */}
        <div className="overflow-auto border border-gray-300 ">
          <table className="table-auto w-full">
            <thead className="bg-tritenaryGreen">
              <tr>
                <th className="text-white text-[16px] sm:text-[18px] md:text-[24px] border border-black p-2">
                  Buổi
                </th>
                {weekDates.map((date, index) => {
                  let dayLabel;
                  if (index + 2 > 7) {
                    dayLabel = "Chủ Nhật";
                  } else {
                    dayLabel = `Thứ ${index + 2}`;
                  }
                  return (
                    <th
                      key={index}
                      className="text-white text-[14px] sm:text-[18px] md:text-[24px] border border-black  p-2"
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
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
