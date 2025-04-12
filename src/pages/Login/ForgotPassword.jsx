import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordOTP } from '../../services/userService';
import CryptoJS from "crypto-js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gọi API gửi OTP
    const response = await ForgotPasswordOTP(email);
    if (response.isSuccess) {
      setShowAlert("success");
      localStorage.setItem("email",email);
      const secretKey = "KeysuperBiMat"; // Một key bí mật để mã hóa
      const encryptedOTP = CryptoJS.AES.encrypt( response.result, secretKey).toString();
      localStorage.setItem("OTP6Digit", encryptedOTP);
      setSuccessMessage("Mã OTP đã được gửi đến Email cá nhân của bạn.");
      setTimeout(() => {setShowAlert(false);
      navigate("/sentOTP");
      }, 1000);
    } else {
      setShowAlert("error");
      setErrorMessage(response.message);
      setTimeout(() => setShowAlert(false), 1000);
    }
  };
  return (
    <>
      {/* Thông báo Start */}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error" ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4" : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
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
                  <strong>Error:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Success:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}     
       {/* Thông báo  End*/}

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
              Quên mật khẩu
            </h1>
            <p className="text-lg font-semibold md:text-2xl text-gray-700">
              Xin mời nhập email để khôi phục lại mật khẩu.
            </p>
       
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 text-center">
            {/* Email Input */}
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left">
              <label className="text-gray-500 text-sm font-medium">
                Your Email
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="block w-full max-w-[460px] bg-green-500 text-white font-bold text-lg rounded-md py-4 transition-transform transform hover:bg-green-700 hover:scale-105 mb-6 mx-auto"
            >
              Gửi OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
