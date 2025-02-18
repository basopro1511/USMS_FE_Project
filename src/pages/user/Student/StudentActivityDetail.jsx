import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { getScheduleDetails } from "../../../services/scheduleService";

// Cái scheduleId sau này bấm vô cái ô mới chuyền vô được nên t để mặc định 1 để test
function StudentActivityDetail({ scheduleId }) {
  const [activityDetails, setActivityDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        //đây nè
        const data = await getScheduleDetails(1);
        if (data && data.isSuccess) {
          setActivityDetails(data.result);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [scheduleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                Ngày:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {activityDetails.date}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Môn học:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {activityDetails.subjectName}
              </td>
            </tr>
            <tr className="border-b border-gray-800 flex flex-col sm:table-row">
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Thời gian:
              </td>
              <td className="p-2 text-gray-600 block sm:table-cell">
                {activityDetails.startTime.substring(0, 5)} - {activityDetails.endTime.substring(0, 5)}
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
                {activityDetails.className}
              </td>
              <td className="p-2 font-semibold text-gray-700 block sm:table-cell">
                Giảng viên:
              </td>
              <td className="p-2 text-gray-600 sm:table-cell">
              {activityDetails.teacher}{" "}
                <a
                  href="#"
                  className="text-blue-500 underline ml-4 bg-blue-700 hover:bg-blue-800 hover:scale-95 transition-all text-white font-semibold pt-1 pb-1 px-3 rounded-xl inline-block"
                >
                  Meet URL
                </a>
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
