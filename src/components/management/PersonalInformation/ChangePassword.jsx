/* eslint-disable react/prop-types */
import { useState } from "react";
import { ResetPassword } from "../../../services/userService";

function ChangePasswordForm({ onReaload, selectUserId }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordData, setPasswordData] = useState({
    userId: selectUserId,
    oldPassword: "",
    newPassword: "",
  });
 
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có trùng khớp không
    if (passwordData.newPassword !== confirmPassword) {
      setShowAlert("error");
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      setTimeout(() => setShowAlert(false), 3000);
      return; // Dừng submit nếu không khớp
    }
    try {
      const response = await ResetPassword(passwordData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
        onReaload(response.data);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(true);
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };
  return (
    <>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] rounded-2xl items-center text-center shadow-xl">
            <div>
              <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                Cập nhật mật khẩu
              </p>
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col items-center gap-4 mt-8"
              >
                <div className="flex gap-8">
                  <div className="flex flex-col gap-4 w-[400px] ">
                    <div>
                      <p className="text-left">Mật khẩu hiện tại</p>
                      <input
                        type="password"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <p className="text-left">Mật khẩu mới:</p>
                      <input
                        type="password"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                      />
                    </div>
                    <div>
                      <p className="text-left">Xác nhận mật khẩu:</p>
                      <input
                        type="password"
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-8 mt-8 mb-8">
                  <button
                    type="submit"
                    className="w-[150px] h-[50px] bg-secondaryBlue text-white rounded-md font-bold"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="w-[150px] h-[50px] bg-red-500 text-white rounded-md font-bold"
                    onClick={handleCancel}
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

export default ChangePasswordForm;
