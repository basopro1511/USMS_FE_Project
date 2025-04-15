import { useState } from "react";
import ManageScheduleByDay from "./scheduleByDay";
import ManageScheduleByWeek from "./scheduleByWeek";

function ScheduleManagement() {
  const [viewMode, setViewMode] = useState("week"); // "week" hoặc "day"
  return (
    
    <div className="border border-white mt-4 w-[1600px] h-auto bg-white rounded-2xl mb-5">
           <div className="flex">
          <p className="m-auto text-3xl font-bold mt-7">Thời Khóa Biểu</p>
        </div>
            <button
        onClick={() =>
          setViewMode((prev) => (prev === "week" ? "day" : "week"))
        }
        className="ml-2 border rounded-xl p-2 bg-green-700 font-bold text-lg  text-white my-4 hover:bg-green-900 hover:scale-95 transition-all "
      >
        {viewMode === "week"
          ? "Sắp lịch học theo ngày"
          : "Sắp lịch học theo tuần"}
      </button>
      <div>
        {viewMode === "week" ? <ManageScheduleByWeek /> : <ManageScheduleByDay />}
      </div>

    </div>
  );
}

export default ScheduleManagement;
