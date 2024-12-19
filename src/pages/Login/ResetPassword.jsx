import React from 'react';

function ResetPassword() {
  return (
    <>
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
          <form className="mt-6 text-center">
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
