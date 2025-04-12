/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { UpdateRequest } from "../../../services/requestService";

function FormUpdateRequest({ requestDetail, onClose, onUpdate }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
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

  useEffect(() => {
    if (requestDetail) {
      setRequestData({ ...requestDetail });
    }
  }, [requestDetail]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await UpdateRequest(requestData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 2000);
        setIsFormVisible(false);
        onUpdate(response.data)
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(true);
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  return (
    <>
      {" "}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
              : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center">
            <div>
              {showAlert === "error" ? (
                <span>
                  <strong>Lỗi:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Thành Công:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
          <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl p-8  scale-95">
            <form onSubmit={handleUpdateRequest}>
              <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl  text-secondaryBlue">
                Cập nhật yêu cầu
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="font-medium">Request ID:</p>
                  <input
                    readOnly
                    value={requestData.requestId}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Người tạo:</p>
                  <input
                    readOnly
                    value={requestData.userId}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Loại yêu cầu:</p>
                  <input
                    readOnly
                    value={
                      requestData.requestType === 1
                        ? "Đổi người dạy thay thế"
                        : "Đổi thời gian dạy sang buổi/ giờ khác"
                    }
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Ngày tạo:</p>
                  <input
                    readOnly
                    value={formatDateTime(requestData.requestDate)}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Ngày dạy (Chính thức):</p>
                  <input
                    readOnly
                    value={requestData.originalDate}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Buổi dạy (Chính thức):</p>
                  <input
                    readOnly
                    value={requestData.originalSlotId}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                <div>
                  <p className="font-medium">Phòng dạy (Chính thức):</p>
                  <input
                    readOnly
                    value={requestData.originalRoomId}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  />
                </div>

                {requestData.requestType === 2 && (
                  <>
                    <div>
                      <p className="font-medium">Ngày dạy (Mới):</p>
                      <input
                        readOnly
                        name="newDate"
                        value={requestData.newDate}
                        onChange={handleChange}
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Buổi dạy (Mới):</p>
                      <input
                        readOnly
                        name="newSlotId"
                        value={requestData.newSlotId || ""}
                        onChange={handleChange}
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Phòng dạy (Mới):</p>
                      <input
                        name="newRoomId"
                        value={requestData.newRoomId || ""}
                        onChange={handleChange}
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                      />
                    </div>
                  </>
                )}

                {requestData.requestType === 1 && (
                  <div>
                    <p className="font-medium">Giáo viên thay thế:</p>
                    <input
                      readOnly
                      name="alternativeTeacher"
                      value={requestData.alternativeTeacher}
                      onChange={handleChange}
                      className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                    />
                  </div>
                )}

                <div>
                  <p className="font-medium">Trạng thái:</p>
                  <select
                    name="status"
                    value={requestData.status}
                    onChange={handleChange}
                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                  >
                    <option value={0}>Chưa xử lý</option>
                    <option value={1}>Đã xử lý</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <p className="font-medium">Lý do:</p>
                  <textarea
                    readOnly
                    name="reason"
                    value={requestData.reason}
                    onChange={handleChange}
                    className="w-full h-[52px] border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <p className="font-medium">Phản hồi từ Admin:</p>
                  <textarea
                    name="replyResponse"
                    value={requestData.replyResponse}
                    onChange={handleChange}
                    className="w-full h-[52px] border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-10">
                <button
                  type="submit"
                  className="w-[150px] h-[50px] bg-green-600 text-white rounded-md font-bold"
                >
                  Cập nhật
                </button>
                <button
                  onClick={handleClose}
                  className="w-[150px] h-[50px] bg-gray-400 text-white rounded-md font-bold"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FormUpdateRequest;
