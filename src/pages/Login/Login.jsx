import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doRequest } from "../../utils/Common";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
    // axios.defaults.withCredentials = true;
  // Account to test
  // email: eve.holt@reqres.in
  // password: Chỉ cần có là được
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Cho alert chung
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await doRequest("post", "/login", { data: values });

    if (res.isError) {
      if (res.error.response?.status === 400) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      setShowAlert("error");
      setTimeout(() => setShowAlert(false), 3000); // Ẩn sau 3 giây
    } else {
      setSuccessMessage("Login successful!");
      setShowAlert("success");
      localStorage.setItem("access_token", res.data.token);

      // Chờ 2 giây trước khi chuyển trang
      setTimeout(() => {
        setShowAlert(false);
        navigate("/Home");
      }, 2000);
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
            <div className="w-full max-w-[450px] mx-auto mb-4 text-left">
              <label className="text-gray-500 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Nhập vào mật khẩu của bạn"
                required
                className="w-full border rounded-md px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
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
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
