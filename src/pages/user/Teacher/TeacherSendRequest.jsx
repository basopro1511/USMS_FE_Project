import { useEffect, useState } from "react";
import { AddRequest } from "../../../services/requestService";
import { getSlots } from "../../../services/slotService";
import {
  getAvailableTeachersForAddSchedule,
  getClassSubjectIdByTeacherSchedule,
  GetScheduleDataByScheduleIdandSlotInSubject,
  GetSlotNoInSubjectByClassSubjectId,
} from "../../../services/scheduleService";
import { GetClassSubjectById } from "../../../services/classService";

function TeacherSendRequest() {
  const userId = localStorage.getItem("userId");

  // Định nghĩa trạng thái ban đầu của form
  const initialRequestState = {
    requestId: 0,
    userId: userId,
    requestType: 1,
    scheduleId: 1,
    alternativeTeacher: null,
    classSubjectId: 0,
    slotNoInSubject: 0,
    originalDate: null,
    originalSlotId: 0,
    originalRoomId: 0,
    newDate: null,
    newSlotId: null,
    newRoomId: null,
    reason: null,
    replyResponse: null,
    status: 0,
    requestDate: new Date().toISOString(),
  };

  const [newRequest, setNewRequest] = useState(initialRequestState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert: "success" hoặc "error"

  //#region Handle Add Request
  const handleAddRequest = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", newRequest);
    try {
      const response = await AddRequest(newRequest);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        // Sau khi gửi đơn thành công, reset form
        clearForm();
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      setShowAlert("error");
      console.log(error);
      setErrorMessage("Gửi đơn thất bại");
      setTimeout(() => setShowAlert(false), 3000);    }
  };

  // Hàm clearForm để reset toàn bộ form về trạng thái ban đầu
  const clearForm = () => {
    setNewRequest(initialRequestState);
  };
  //#endregion

  //#region Fetch Data
  // Lấy dữ liệu các buổi dạy (slot)
  const [slotData, setSlotData] = useState([]);
  useEffect(() => {
    const fetchSlotData = async () => {
      const data = await getSlots();
      setSlotData(data.result || []);
    };
    fetchSlotData();
  }, []);

  // Lấy danh sách classSubjectId từ lịch của giáo viên
  const [classSubjectId, setClassSubjectId] = useState([]);
  useEffect(() => {
    const fetchClassSubjectId = async () => {
      const data = await getClassSubjectIdByTeacherSchedule(userId);
      setClassSubjectId(data.result || []);
    };
    fetchClassSubjectId();
  }, [userId]);

  // Lấy thông tin chi tiết của lớp học - môn
  const [classSubjectData, setClassSubjectData] = useState([]);
  useEffect(() => {
    const fetchClassSubjectData = async () => {
      if (classSubjectId && classSubjectId.length > 0) {
        try {
          const subjectPromises = classSubjectId.map(async (subjectId) => {
            const res = await GetClassSubjectById(subjectId);
            console.log("Fetched class subject:", res);
            return res.result;
          });
          const subjects = await Promise.all(subjectPromises);
          setClassSubjectData(subjects);
        } catch (error) {
          console.error("Error fetching class subject data:", error);
        }
      }
    };
    fetchClassSubjectData();
  }, [classSubjectId]);

  // Lấy danh sách slotNoInSubject dựa vào classSubject được chọn
  const [slotNoInSubject, setSlotNoInSubject] = useState([]);
  useEffect(() => {
    if (newRequest.classSubjectId) {
      const fetchSlotInSubject = async () => {
        try {
          const subjectResponse = await GetSlotNoInSubjectByClassSubjectId(
            newRequest.classSubjectId
          );
          setSlotNoInSubject(subjectResponse.result);
        } catch (error) {
          console.error("Error fetching slotNoInSubject:", error);
        }
      };
      fetchSlotInSubject();
    }
  }, [newRequest.classSubjectId]);

  // Khi lớp học - môn và buổi học số được chọn thì lấy thông tin scheduleData
  const [scheduleData, setScheduleData] = useState(null);
  useEffect(() => {
    if (newRequest.classSubjectId && newRequest.slotNoInSubject) {
      const fetchScheduleData = async () => {
        try {
          const response = await GetScheduleDataByScheduleIdandSlotInSubject(
            newRequest.classSubjectId,
            newRequest.slotNoInSubject
          );
          const schedule = Array.isArray(response.result)
            ? response.result[0]
            : response.result;
          setScheduleData(schedule);
        } catch (error) {
          console.error("Error fetching schedule data:", error);
        }
      };
      fetchScheduleData();
    }
  }, [newRequest.classSubjectId, newRequest.slotNoInSubject]);

  // Khi scheduleData thay đổi, update thông tin originalDate, originalSlotId, originalRoomId
  useEffect(() => {
    if (scheduleData) {
      setNewRequest((prev) => ({
        ...prev,
        originalDate: scheduleData.date || "",
        originalSlotId: scheduleData.slotId || "",
        originalRoomId: scheduleData.roomId || "",
      }));
    }
  }, [scheduleData]);

  // Lấy danh sách giáo viên có thể thay thế dựa vào thông tin hiện tại
  const [teacherData, setTeacherData] = useState(null);
  useEffect(() => {
    if (scheduleData?.date && scheduleData?.slotId && classSubjectData.length > 0) {
      const selectedClassSubject = classSubjectData.find(
        (item) => item.classSubjectId === newRequest.classSubjectId
      );
      if (selectedClassSubject && selectedClassSubject.majorId) {
        const fetchTeacherData = async () => {
          try {
            const response = await getAvailableTeachersForAddSchedule(
              selectedClassSubject.majorId,
              scheduleData.date,
              scheduleData.slotId
            );
            setTeacherData(response.result);
          } catch (error) {
            console.error("Error fetching teacher data:", error);
          }
        };
        fetchTeacherData();
      }
    }
  }, [classSubjectData, newRequest.classSubjectId, scheduleData]);
  //#endregion

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
              className="flex-shrink-0 inline w-4 h-4 mr-3"
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
      <div>
        {/* Tiêu đề */}
        <div className="flex justify-center">
          <p className="mt-8 text-3xl font-bold">Yêu cầu thay đổi lịch dạy</p>
        </div>
        {/* Form */}
        <form onSubmit={handleAddRequest}>
          <div className="mt-8 mb-8 mx-auto max-w-[700px] bg-gray-100 p-8 rounded shadow">
            {/* Loại yêu cầu */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Loại yêu cầu
              </label>
              <select
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    requestType: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Chọn loại yêu cầu</option>
                <option value={2}>Đổi thời gian dạy sang buổi/ giờ khác</option>
                <option value={1}>Đổi người dạy thay thế</option>
              </select>
            </div>
            {/* Môn học - Môn */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Lớp học - Môn học
              </label>
              <select
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    classSubjectId: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Chọn lớp môn</option>
                {classSubjectData.map((item, index) => (
                  <option key={index} value={item.classSubjectId}>
                    {item.classSubjectName}
                  </option>
                ))}
              </select>
            </div>
            {/* Buổi học số */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Buổi học số
              </label>
              <select
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    slotNoInSubject: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Chọn buổi học số</option>
                {slotNoInSubject.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {/* Thông tin hiện tại từ scheduleData */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Ngày dạy
              </label>
              <input
                required
                type="date"
                value={newRequest.originalDate}
                readOnly
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Buổi dạy (slot)
              </label>
              <input
                required
                type="text"
                value={newRequest.originalSlotId}
                readOnly
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phòng dạy
              </label>
              <input
                required
                type="text"
                value={newRequest.originalRoomId}
                readOnly
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            {/* Phần hiển thị dựa trên loại yêu cầu */}
            {newRequest.requestType === 2 ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Chọn ngày thay đổi
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        newDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Chọn buổi dạy muốn thay đổi
                  </label>
                  <select
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        newSlotId: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Chọn buổi dạy muốn thay đổi</option>
                    {slotData.map((r) => (
                      <option key={r.slotId} value={r.slotId}>
                        Buổi {r.slotId} - ({r.startTime} - {r.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : newRequest.requestType === 1 ? (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Chọn giáo viên muốn thay thế
                </label>
                <select
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      alternativeTeacher: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn giáo viên</option>
                  {teacherData &&
                    teacherData.map((r) => (
                      <option key={r.userId} value={r.userId}>
                        {r.fullUserName} - {r.majorId}
                      </option>
                    ))}
                </select>
              </div>
            ) : null}

            {/* Lý do */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do
              </label>
              <textarea
                placeholder="Nhập lý do thay đổi thời gian dạy hoặc đổi người dạy"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    reason: e.target.value,
                  })
                }
              />
            </div>
            {/* Nút hành động */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="w-[300px] h-[64px] bg-green-600 text-white rounded-md font-bold hover:scale-95"
              >
                Gửi Đơn
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="w-[300px] h-[64px] bg-red-500 text-white rounded-md font-bold hover:scale-95"
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default TeacherSendRequest;
