import React from 'react';

function SentOTP() {
    return (
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
                        Chúng tôi đã gửi liên kết tới <span className="font-bold">email@email.com</span>.
                    </p>
                    <p className="text-lg md:text-2xl text-gray-700 mt-2">
                        Nhập mã gồm 6 chữ số được đề cập trong email.
                    </p>
                </div>

                {/* OTP Input */}
                <form className="mt-6 text-center">
                    <div className="flex justify-center gap-2 md:gap-3 mb-6">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength="1"
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
                        Bạn vẫn chưa nhận được email?{' '}
                        <a href="#" className="text-blue-600 font-semibold hover:underline">
                            Gửi lại email
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SentOTP;
