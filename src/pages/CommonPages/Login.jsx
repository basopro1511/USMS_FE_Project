import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/login", values)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/Home");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <img
            src="/src/assets/images/Logo-FPT.svg"
            alt="FPT Logo"
            className="mx-auto mb-2"
          />
        </div>
        <h2 className="text-lg font-semibold text-center mb-2">
          Academic Portal
        </h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
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
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring focus:ring-green-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
