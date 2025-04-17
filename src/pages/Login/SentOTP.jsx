import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ForgotPasswordOTP, GetUserByEmail } from "../../services/userService";
function SentOTP() {
  const navigate = useNavigate();
  // Lấy OTP đã lưu từ localStorage (đã lưu từ lúc gửi OTP)
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  // Xử lý khi nhập một ô OTP
  const handleChange = (e, index) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số (và cho phép trống)
    if (!/^\d?$/.test(value)) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    // Tự động chuyển sang ô tiếp theo nếu có giá trị và chưa phải ô cuối
    if (value && index < otpDigits.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const email = localStorage.getItem("email");
  const storedOTP = localStorage.getItem("OTP6Digit");
  const secretKey = "KeysuperBiMat"; // Một key bí mật để mã hóa
  const bytes = CryptoJS.AES.decrypt(storedOTP, secretKey);
  const decryptedOTP = bytes.toString(CryptoJS.enc.Utf8);

  //#region Handle Submid OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputOTP = otpDigits.join("");
    if (inputOTP === decryptedOTP) {
      setShowAlert("success");
      setSuccessMessage("Xác thực OTP thành công!");
      setTimeout(() => {
        localStorage.removeItem("OTP6Digit");
        setShowAlert(false);
        navigate("/resetPassword");
      }, 2000);
    } else {
      setShowAlert("error");
      setErrorMessage("OTP không hợp lệ. Vui lòng thử lại.");
      setTimeout(() => setShowAlert(false), 2000);
    }
  };
  //#endregion

  //#region fetch Email API
  const [emailData, setEmailData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await GetUserByEmail(email); //Lấy ra data của user  trong database
      setEmailData(data.result);
    };
    fetchUserData();
  }, []);
  //#endregion

  //#region Hide Email
  function maskEmail(email) {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 4) {
      return local[0] + "***@" + domain;
    }
    const start = local.slice(0, 2);
    const end = local.slice(-2);
    return `${start}${"*".repeat(local.length - 4)}${end}@${domain}`;
  }
  //#endregion

  //#region Handle Resend OTP
  // trong SentOTP component:
  const handleResend = async () => {
    try {
      const response = await ForgotPasswordOTP(email);
      if (response.isSuccess) {
        // mã hóa và lưu lại OTP mới
        const secretKey = "KeysuperBiMat";
        const encryptedOTP = CryptoJS.AES.encrypt(
          response.result,
          secretKey
        ).toString();
        localStorage.setItem("OTP6Digit", encryptedOTP);
        setShowAlert("success");
        setSuccessMessage("Mã OTP mới đã được gửi đến email của bạn.");
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (err) {
      setShowAlert("error");
      setErrorMessage("Gửi lại OTP thất bại, vui lòng thử lại.");
      console.log(err);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  //#endregion

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
        {/* Form OTP */}
        <div className="border-2 border-black rounded-3xl w-full max-w-[580px] mx-auto flex flex-col p-4">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-semibold mt-4 mb-4">
              Kiểm tra email của bạn
            </h1>
            <p className="text-lg md:text-2xl text-gray-700">
              Chúng tôi đã gửi liên kết tới{" "}
              <span className="font-bold">
                {maskEmail(emailData.personalEmail)}
              </span>
              .
            </p>
            <p className="text-lg md:text-2xl text-gray-700 mt-2">
              Nhập mã gồm 6 chữ số được đề cập trong email.
            </p>
          </div>
          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="mt-6 text-center">
            <div className="flex justify-center gap-2 md:gap-3 mb-6">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={otpDigits[index]}
                  onChange={(e) => handleChange(e, index)}
                  className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-md text-center text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ))}
            </div>
            {/* Verify Button */}
            <button
              type="submit"
              className="w-full max-w-[460px] bg-green-500 text-white font-bold text-lg rounded-md py-4 transition-transform transform hover:bg-green-700 hover:scale-105 mb-6"
            >
              Kiểm tra mã
            </button>
          </form>
          {/* Resend Email */}
          <div className="text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Bạn vẫn chưa nhận được OTP?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold hover:underline"
              >
                Gửi lại OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SentOTP;
