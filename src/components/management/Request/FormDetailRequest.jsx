/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function FormDetailRequest({ requestDetail, onClose }) {
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

  // Hàm chuyển đổi trạng thái thành text
  const formatStatus = (status) => (status === 0 ? "Chưa xử lý" : "Đã xử lý");
  return (
    <>
      {requestDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl p-8  scale-90">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl  text-secondaryBlue">
              Chi tiết yêu cầu
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
                <p className="font-medium">Buổi dạy - Thời gian ( Chính Thức )</p>
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
                      value={requestData.newSlotId !== null ? requestData.newSlotId : ""}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Phòng dạy ( Mới ):</p>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      value={requestData.newRoomId !== null ? requestData.newRoomId : "Chưa có phòng mới"}
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
              )}<div>
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
            <div className="flex justify-center gap-8 mt-4">
              <button
                type="button"
                className="w-full max-w-[152px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
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

export default FormDetailRequest;
