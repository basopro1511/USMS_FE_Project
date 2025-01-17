import { useState } from "react";
import { AddSlot } from "../../../services/slotService";

// eslint-disable-next-line react/prop-types
function FormAddSlot({onSlotAdded}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại
  const [newSlot, setNewSlot] = useState({
    // tạo 1 model đễ lấy dữ liệu từ api
    slotId: "",
    startTime: "",
    endTime: "",
    status: 0,
  });

  const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
  const handleCancel = () => {
    setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
  };

  // Xử lý form AddRoom
  const handleAddSlot = async (e) => {
    e.preventDefault(); 
    try {
      const response = await AddSlot(newSlot); 
      console.log(newSlot);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onSlotAdded(response.slot);
        setTimeout(() => setShowAlert(false), 3000); 
        setIsFormVisible(false); 
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding room:", error);
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
                Thêm buổi học
              </p>
              <form onSubmit={handleAddSlot}>
                <p className="text-left ml-[100px] text-xl mt-8">
                  Mã buổi học:{" "}
                </p>
                <input
                  type="text"
                  required
                  placeholder="Mã số buổi học"
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, slotId: e.target.value })
                  }
                />{" "}
                <p className="text-left ml-[100px] text-xl mt-3">Thời gian bắt đầu : </p>
                <input
                  type="time"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: `${e.target.value}:00` }) // Thêm giây mặc định
                  }
                />
                   <p className="text-left ml-[100px] text-xl mt-3">Thời gian kết thúc : </p>
                <input
                  type="time"
                  required
                  className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-8 px-4"
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime:  `${e.target.value}:00` }) // Thêm giây mặc định
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

export default FormAddSlot;
