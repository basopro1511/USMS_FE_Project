import { useState } from "react";
import { ResetPasswordByEmail } from "../../services/userService";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const emailStorage = localStorage.getItem("email");
  const [passwordData, setPasswordData] = useState({
    email: emailStorage,
    newPassword: " ",
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
      const response = await ResetPasswordByEmail(passwordData);
      if  (passwordData.email===null){
        setShowAlert("error");
        setErrorMessage("Hành động đang thực hiện không khả dụng, vui lòng thử lại sau!");
        setTimeout(() => setShowAlert(false), 3000);
      }
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
          localStorage.removeItem("email");
        }, 2000);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error updating password:", error);
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
      {/* Giao diện chính */}
      <div className="w-full mt-[100px] mx-auto max-w-screen-lg">
        {/* Logo */}
        <div className="h-[120px] flex justify-center items-center mb-8">
          <img
            src="/src/assets/images/Logo-FPT.svg"
            alt="Logo"
            className="w-[200px] md:w-[313px] h-auto"
          />
        </div>
        {/* Form Container */}
        <div className="border-2 border-black rounded-3xl w-full max-w-[580px] mx-auto flex flex-col p-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-semibold mt-4 mb-4">
              Nhập mật khẩu mới
            </h1>
            <p className="text-lg font-semibold md:text-2xl text-gray-700">
              Tạo mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleChangePassword} className="mt-6 text-center">
            {/* Password Input */}
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left">
              <label className="text-gray-500 text-sm font-medium">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Xin mời nhập mật khẩu"
                required
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            {/* Confirm Password Input */}
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left">
              <label className="text-gray-500 text-sm font-medium">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới của bạn"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full max-w-[460px] bg-green-500 text-white font-bold text-lg rounded-md py-4 transition-transform transform hover:bg-green-700 hover:scale-105 mb-6"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default ResetPassword;
