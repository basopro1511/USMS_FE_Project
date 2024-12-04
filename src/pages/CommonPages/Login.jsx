import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doRequest } from "../../utils/Common";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;

  // Account to test
  // email: eve.holt@reqres.in
  // password: Chỉ cần có là được
  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await doRequest("post", "/login", { data: values });

    if (res.isError) {
      if (res.error.response?.status === 400) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      return;
    } else {
      localStorage.setItem("access_token", res.data.token);
      navigate("/Home");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-4">
        <img
          src="/src/assets/images/Logo-FPT.svg"
          alt="FPT Logo"
          className="mx-auto mb-12"
        />
      </div>
      <div className="w-1/4 min-w-max max-w-96 bg-white p-8 rounded-lg shadow-lg border border-solid border-black">
        <h2 className="text-xl font-semibold text-center mb-12">
          Cổng thông tin học thuật
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ thư điện tử
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Nhập địa chỉ thư điện tử"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end items-center mb-4">
            <a
              href="#"
              className="text-sm text-blue-500 hover:underline focus:outline-none"
            >
              Quên mật khẩu
            </a>
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full font-semibold transition ease-in-out hover:scale-110 hover:font-bold duration-300 bg-Success text-white py-2 px-4 rounded-lg"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
