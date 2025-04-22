import { useEffect, useState } from "react";
import { GetScheduleById } from "../../../services/scheduleService";
import { Link, useParams } from "react-router-dom";
import { getSlots } from "../../../services/slotService";
import { GetClassSubjectById } from "../../../services/classService";
import { getSubjectById } from "../../../services/subjectService";

function StudentActivityDetail() {
  const [scheduleData, setScheduleData] = useState([]);
  const [classData, setClassData] = useState([]);
  const { classScheduleId } = useParams(); // Lấy classId, classSubjectId từ URL
  const [slotData, setSlotData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);

  //#region  Fetch Activity Detail
  useEffect(() => {
    const fetchActivityDetail = async () => {
      const data = await GetScheduleById(classScheduleId); //Lấy ra data của user  trong database
      setScheduleData(data.result);
    };
    fetchActivityDetail();
  }, []);
  //#endregion

  //#region  Fetch Slot Data
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
  const formatTime = (timeStr) => (timeStr ? timeStr.slice(0, 5) : "N/A");
  const slotInfo = slotData.find((item) => item.slotId === scheduleData.slotId);
  const startTime = slotInfo ? formatTime(slotInfo.startTime) : "N/A";
  const endTime = slotInfo ? formatTime(slotInfo.endTime) : "N/A";
  //#endregion

  //#region Fetch ClassSubject
  useEffect(() => {
    const fetchClassData = async () => {
      if (scheduleData && scheduleData.classSubjectId) {
        const data = await GetClassSubjectById(scheduleData.classSubjectId);
        setClassData(data.result);
      }
    };
    fetchClassData();
  }, [scheduleData]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (classData && classData.subjectId) {
        const data = await getSubjectById(classData.subjectId);
        setSubjectData(data.result);
      }
    };
    fetchSubjectData();
  }, [classData]);

  //#endregion

  return (
    <div className="w-full mt-8 mx-auto">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800">
          Xem chi tiết hoạt động
        </h1>
      </div>

      {/* Bảng chi tiết hoạt động */}
      <div className="m-auto mt-2 mb-8 w-full max-w-[1200px] text-left">
        <table className="min-w-full">
          <tbody>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Lớp:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                <Link
                to={`/detailClass/${scheduleData.classSubjectId}`}
                  className="font-bold text-blue-800 hover:text-blue-900 hover:underline">
                {classData.classId}
                </Link>
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Môn học:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
               {subjectData.subjectName} ({classData.subjectId})
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Ngày:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {scheduleData.date}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Buổi học số:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">7</td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Buổi:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {scheduleData.slotId} ({startTime} - {endTime})
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Giáo viên:
              </td>
              <td className="p-2 text-gray-600 sm:table-cell">
                {scheduleData.teacherId}
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Phòng học:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {scheduleData.roomId}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentActivityDetail;
