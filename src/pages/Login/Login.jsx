import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginJWT } from "../../services/loginService";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  //#region Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await LoginJWT(values);
    if (response.isSuccess) {
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 10 giây
      localStorage.setItem("userId", response.result.userId);
      localStorage.setItem("roleId", response.result.roleId);
      localStorage.setItem("token", response.result.token);
      localStorage.setItem("tokenExpiration", expirationTime); // Lưu thời gian hết hạn
      setShowAlert("success");
      setSuccessMessage(response.message);
      if (response.result.roleId === 4 || response.result.roleId === 5) {
        navigate("/home");
      } else if (response.result.roleId === 2) {
        navigate("/manageClass");
      } else if (response.result.roleId === 1) {
        navigate("/manageStaff");
      }
      setTimeout(() => {
        setShowAlert(false);
      }, 500);
    } else {
      setShowAlert("error");
      setErrorMessage(response.message);
      setTimeout(() => setShowAlert(false), 2000);
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

      {/* Giao diện chính */}
      <div className="w-full mt-[100px] mx-auto max-w-screen-lg ">
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
              Academic Portal
            </h1>
            <p className="text-lg font-semibold md:text-2xl">Đăng nhập</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 text-center">
            {/* Email Input */}
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left">
              <label className="text-gray-500 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Nhập vào email của bạn"
                required
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </div>

            {/* Password Input */}
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left relative">
              <label className="text-gray-500 text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập vào mật khẩu của bạn"
                required
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[43px] right-3 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  // Mắt mở (hiện mật khẩu)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 002.458 12c1.274 4.057 5.064 7 9.542 7 1.863 0 3.597-.511 5.065-1.393M6.228 6.228A10.45 10.45 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.45 10.45 0 01-4.21 5.568M6.228 6.228L3 3m0 0l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* quên mật khẩu */}
            <div className="flex items-center justify-start mb-6 w-full max-w-[450px] mx-auto">
              <a
                href="/forgotPassword"
                className="text-gray-500 text-sm font-medium ml-auto hover:text-boldBlue hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full max-w-[460px] bg-green-500 text-white font-bold text-lg rounded-md py-4 transition-transform transform hover:bg-green-700 hover:scale-105 mb-6"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
