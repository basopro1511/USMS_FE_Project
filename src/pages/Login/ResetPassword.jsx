import React from 'react';

function ResetPassword() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            {/* Logo và tiêu đề */}
            <div className="h-[120px] flex justify-center items-center mb-8">
                <img
                    src="/src/assets/images/Logo-FPT.svg"
                    alt="Logo"
                    className="w-[150px] sm:w-[200px] md:w-[313px] h-auto"
                />
            </div>

            {/* Form Set New Password */}
            <div className="border-2 border-black rounded-3xl w-full max-w-[400px] sm:max-w-[500px] bg-white p-6 sm:p-8 mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold mt-4 mb-4">
                        Set a new password
                    </h2>
                </div>
                <div className="text-justify w-full pb-6">
                    <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                        Create a new password for your account
                    </p>
                </div>

                {/* Form Input */}
                <form>
                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 mt-4 rounded font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
