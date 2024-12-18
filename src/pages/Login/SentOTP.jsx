import React from 'react';

function SentOTP() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            {/* Logo */}
            <div className="h-[100px] sm:h-[120px] flex justify-center items-center mb-6">
                <img
                    src="/src/assets/images/Logo-FPT.svg"
                    alt="Logo"
                    className="w-[120px] sm:w-[180px] md:w-[250px] h-auto"
                />
            </div>

            {/* Verification Form */}
            <div className="border border-gray-300 rounded-3xl w-full max-w-[350px] sm:max-w-[450px] md:max-w-[500px] bg-white p-6 sm:p-8 mx-auto shadow-lg">
                <div className="text-center mb-6">
                    <h1 className="text-lg sm:text-2xl md:text-4xl font-semibold mt-4 mb-4">
                        Check your email
                    </h1>
                </div>
                <div className="text-justify w-full pb-6">
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                        We sent a reset link to <span className="font-bold">email@email.com</span>.
                        Enter the 6-digit code mentioned in the email.
                    </p>
                </div>

                {/* Input fields for the 6-digit code */}
                <form>
                    <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength="1"
                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 rounded text-center text-lg sm:text-xl md:text-2xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                            ))}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 sm:py-3 rounded font-semibold hover:bg-green-700 transition duration-200 mt-4 text-sm sm:text-base md:text-lg"
                    >
                        Verify Code
                    </button>
                </form>

                {/* Resend email */}
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        Haven’t got the email yet?{' '}
                        <a href="#" className="text-blue-600 font-semibold hover:underline">
                            Resend email
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SentOTP;
