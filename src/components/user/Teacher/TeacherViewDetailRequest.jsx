/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { changeRequestStatus } from "../../../services/requestService";

function TeacherViewRequestDetail({ requestDetail, onClose, onReload }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const [requestData, setRequestData] = useState({
    requestId: 0,
    userId: "",
    requestType: 0,
    scheduleId: 0,
    alternativeTeacher: "",
    classSubjectId: 0,
    slotNoInSubject: 0,
    originalDate: "",
    originalSlotId: 0,
    originalRoomId: 0,
    newDate: "",
    newSlotId: null,
    newRoomId: null,
    reason: "",
    replyResponse: "",
    status: 0,
    requestDate: "",
  });

  // Hàm format date theo kiểu dd/MM/yyyy HH:mm
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Nếu đối tượng Date không hợp lệ, trả về chuỗi rỗng
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Cập nhật dữ liệu khi requestDetail thay đổi
  useEffect(() => {
    if (requestDetail) {
      setRequestData({
        requestId: requestDetail.requestId || 0,
        userId: requestDetail.userId || "",
        requestType: requestDetail.requestType || 0,
        scheduleId: requestDetail.scheduleId || 0,
        alternativeTeacher: requestDetail.alternativeTeacher || "",
        classSubjectId: requestDetail.classSubjectId || 0,
        slotNoInSubject: requestDetail.slotNoInSubject || 0,
        originalDate: requestDetail.originalDate || "",
        originalSlotId: requestDetail.originalSlotId || 0,
        originalRoomId: requestDetail.originalRoomId || 0,
        newDate: requestDetail.newDate || "",
        newSlotId: requestDetail.newSlotId || null,
        newRoomId: requestDetail.newRoomId || null,
        reason: requestDetail.reason || "",
        replyResponse: requestDetail.replyResponse || "",
        status: requestDetail.status || 0,
        requestDate: requestDetail.requestDate || "",
      });
    }
  }, [requestDetail]);

  // Hàm đóng modal chi tiết request
  const handleClose = () => {
    if (onClose) onClose();
  };

  // Hàm chuyển đổi giá trị của requestType thành text
  const formatRequestType = (type) => {
    if (type === 2) return "Đổi thời gian dạy sang buổi/ giờ khác";
    if (type === 1) return "Đổi người dạy thay thế";
    return "";
  };

  const handleChangeSelectedStatus = async (requestId, status) => {
    try {
      const response = await changeRequestStatus(requestId, status);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        onReload(response.data);
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

  // Hàm chuyển đổi trạng thái thành text
  const formatStatus = (status) => (status === 0 ? "Chưa xử lý" : "Đã xử lý");
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
      {requestDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl p-8  scale-90">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-4xl  text-black">
              Chi tiết đơn yêu cầu
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div>
                <p className="font-medium">Request ID:</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={requestData.requestId}
                />
              </div>
              <div>
                <p className="font-medium">Người tạo:</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={requestData.userId}
                />
              </div>
              <div>
                <p className="font-medium">Loại yêu cầu:</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={formatRequestType(requestData.requestType)}
                />
              </div>
              <div>
                <p className="font-medium">Ngày tạo:</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={formatDateTime(requestData.requestDate)}
                />
              </div>

              <div>
                <p className="font-medium">Ngày dạy ( Chính thức ):</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={requestData.originalDate}
                />
              </div>
              <div>
                <p className="font-medium">
                  Buổi dạy - Thời gian ( Chính Thức )
                </p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={requestData.originalSlotId}
                />
              </div>
              <div>
                <p className="font-medium">Phòng dạy ( Chính Thức )</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={requestData.originalRoomId}
                />
              </div>
              {requestData.requestType === 2 && (
                <>
                  <div>
                    <p className="font-medium">Ngày dạy ( Mới )</p>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      value={formatDateTime(requestData.newDate)}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Buổi dạy ( Mới ):</p>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      value={
                        requestData.newSlotId !== null
                          ? requestData.newSlotId
                          : ""
                      }
                    />
                  </div>
                  <div>
                    <p className="font-medium">Phòng dạy ( Mới ):</p>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      value={
                        requestData.newRoomId !== null
                          ? requestData.newRoomId
                          : "Chưa có phòng mới"
                      }
                    />
                  </div>
                </>
              )}
              {requestData.requestType === 1 && (
                <div>
                  <p className="font-medium">Giáo viên thay thế:</p>
                  <input
                    type="text"
                    readOnly
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                    value={requestData.alternativeTeacher}
                  />
                </div>
              )}
              <div>
                <p className="font-medium">Trạng thái:</p>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  value={formatStatus(requestData.status)}
                />
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium">Lý do:</p>
                <textarea
                  readOnly
                  className="w-full h-[52px] border border-gray-300 rounded-md px-3 py-2"
                  value={requestData.reason}
                />
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium">Phản hồi từ Admin:</p>
                <textarea
                  readOnly
                  className="w-full h-[52px] border border-gray-300 rounded-md px-3 py-2"
                  value={requestData.replyResponse}
                />
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-8 mb-8">
              {requestData.status === 0 && (
                <button
                  type="button"
                  className="w-full max-w-[150px] h-[50px] sm:h-[40px]border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                  onClick={() =>
                    handleChangeSelectedStatus(requestData.requestId, 2)
                  }
                >
                  Hủy đơn yêu cầu
                </button>
              )}

              <button
                type="button"
                className="w-full max-w-[150px] h-[50px] sm:h-[40px]border rounded-2xl bg-green-700 text-white  font-bold text-lg sm:text-l transition-all hover:scale-105 hover:bg-green-700 mt-auto mb-auto"
                onClick={handleClose}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherViewRequestDetail;
