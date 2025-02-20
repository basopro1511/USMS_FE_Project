import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { getScheduleDetails } from "../../../services/scheduleService";
import { getSlotById } from "../../../services/slotService";
import { getClassSubjectById } from "../../../services/classService";
import { getSubjectById } from "../../../services/subjectService";

// Cái scheduleId sau này bấm vô cái ô mới chuyền vô được nên t để mặc định 1 để test
function StudentActivityDetail({ scheduleId }) {
  const [activityDetails, setActivityDetails] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [className, setClassName] = useState(null);
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      // Reset tất cả state
      setActivityDetails(null);
      setSlotData(null);
      setClassName(null);
      setSubject(null);
      setError(null);
      setLoading(true);

      try {
        const data = await getScheduleDetails(1);
        if (!data?.isSuccess) {
          setError(data?.message || "Lỗi lấy dữ liệu lịch trình");
          return;
        }
        const formattedDate = new Date(data.result.date).toLocaleDateString(
          "vi-VN",
          { day: "2-digit", month: "2-digit", year: "numeric" }
        );
        // Gọi API 1 lần lấy slot và classSubject
        const [slot, classSubject] = await Promise.all([
          getSlotById(data.result.slotId),
          getClassSubjectById(data.result.classSubjectId),
        ]);
        // throw Error tức là quăng xuống chỗ error
        if (!slot?.isSuccess) {
          throw new Error(slot?.message || "Lỗi lấy slot");
        }
        if (!classSubject?.isSuccess) {
          throw new Error(classSubject?.message || "Lỗi lấy môn học");
        }
        // Gọi API lấy thông tin môn học
        const subjectData = await getSubjectById(classSubject.result.subjectId);
        if (!subjectData?.isSuccess) {
          throw new Error(subjectData?.message || "Lỗi lấy thông tin môn học");
        }
        setActivityDetails({
          ...data.result,
          date: formattedDate,
        });
        setSlotData(
          `${slot.result.startTime.substring(
            0,
            5
          )} - ${slot.result.endTime.substring(0, 5)}`
        );
        setClassName(
          `${classSubject.result.subjectId}_${classSubject.result.classId}`
        );
        setSubject(
          `${subjectData.result.subjectId} - ${subjectData.result.subjectName}`
        );
      } catch (error) {
        setError(error.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [scheduleId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="w-full mt-8 mx-auto">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800">
          Xem chi tiết hoạt động
        </h1>
      </div>
      {/* Thông báo lỗi */}
      {error && (
        <div className="text-red-500 text-center font-semibold text-lg">
          {error}
        </div>
      )}
      {/* Bảng chi tiết hoạt động */}
      <div className="m-auto mt-2 mb-8 w-full max-w-[1200px] text-left">
        <table className="min-w-full">
          <tbody>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Ngày:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {activityDetails.date}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Môn học:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {subject}
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Thời gian:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {slotData}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Buổi học:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {activityDetails.slotNoInSubject}
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Lớp:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {className}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Phòng:
              </td>
              <td className="p-2 text-gray-600 sm:table-cell">
                {activityDetails.roomId}
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Giảng viên:
              </td>
              <td className="p-2 text-gray-600 sm:table-cell">
                {activityDetails.teacherId || "Không có giảng viên"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

StudentActivityDetail.propTypes = {
  scheduleId: PropTypes.int,
};

export default StudentActivityDetail;
