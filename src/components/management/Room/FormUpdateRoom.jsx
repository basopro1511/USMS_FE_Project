import { useEffect, useState } from "react";
import { UpdateRoom } from "../../../services/roomService";

// eslint-disable-next-line react/prop-types
function FormUpdateRoom({ roomToUpdate, onRoomUpdated }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại

  const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
  const handleCancel = () => {
    setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
  };
  const [roomData, setRoomData] = useState(
    roomToUpdate || {
      roomId: "",
      location: "",
      isOnline: false,
      onlineURL: null,
      status: 0,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    }
  );

  useEffect(() => {
    if (roomToUpdate) {
      setRoomData(roomToUpdate);
    }
  }, [roomToUpdate]);

  // Xử lý form Update
  const handleUpdateRoom = async (e) => {
    e.preventDefault(); 
    try {
      const response = await UpdateRoom(roomData); 
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onRoomUpdated(response.room); // Trả về data mới nhất cho trang ManageRoom để update lên bảng
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
        setIsFormVisible(false); 
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000); 
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <>
      {/* Thông báo Start */}
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
      {/* Thông báo  End*/}

      {isFormVisible && ( // Chỉ hiển thị form nếu isFormVisible là true
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Cập nhật phòng học
              </p>
              <form onSubmit={handleUpdateRoom}>
                <p className="text-left ml-[100px] text-xl mt-8">
                  Mã phòng học:{" "}
                </p>
                <input
                  readOnly
                  type="text"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                  value={roomData.roomId}
                  onChange={(e) =>
                    setRoomData({ ...roomData, roomId: e.target.value })
                  }
                />
                <p className="text-left ml-[100px] text-xl mt-3">Vị trí : </p>

                <input
                  type="text"
                  required
                  placeholder="Vị trí"
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-6 px-4"
                  value={roomData.location}
                  onChange={(e) =>
                    setRoomData({ ...roomData, location: e.target.value })
                  }
                />
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                  >
                    Thêm
                  </button>
                  <button
                    type="button" // Sử dụng type="button" để ngừng việc submit form
                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
                    onClick={handleCancel} // Ẩn form khi nhấn nút hủy
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormUpdateRoom;
