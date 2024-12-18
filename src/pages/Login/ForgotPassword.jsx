import { Link } from 'react-router-dom';

function ForgotPassword() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            {/* Logo và Tiêu đề */}
            <div className="h-[120px] flex justify-center items-center mb-8">
                <img
                    src="/src/assets/images/Logo-FPT.svg"
                    alt="Logo"
                    className="w-[150px] sm:w-[200px] md:w-[313px] h-auto"
                />
            </div>

            {/* Form Forgot Password */}
            <div className="border-2 border-black rounded-3xl w-full max-w-[400px] sm:max-w-[500px] bg-white p-6 sm:p-8 mx-auto">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold mt-4 mb-4">
                        Forgot password
                    </h2>
                    <p className="text-center text-sm sm:text-base md:text-lg text-gray-700 mb-6">
                        Please enter your email to reset the password
                    </p>
                </div>
                <form>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Your Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Sử dụng Link trực tiếp thay cho button */}
                    <Link
                        to="/sentOTP"
                        className="block w-full text-center bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Reset Password
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
