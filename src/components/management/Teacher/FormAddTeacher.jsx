import { useState, useRef } from "react";

function FormAddTeacher({ onTeacherAdded }) {
    const [newTeacher, setNewTeacher] = useState({
        teacherId: "",
        specialization: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        personalEmail: "",
        userAvatar: "",
    });

    const [selectedImage, setSelectedImage] = useState(""); // Thêm state cho selectedImage
    const fileInputRef = useRef(null); // Sử dụng useRef để khởi tạo fileInputRef

    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
        }
    };

    const handleAddTeacher = (e) => {
        e.preventDefault();
        console.log("New Teacher:", newTeacher);
        // Add functionality to save the teacher here
        setIsFormVisible(false);
    };

    return (
        <>
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                                Thêm Giáo Viên
                            </p>
                            <form onSubmit={handleAddTeacher} className="flex flex-col items-center gap-4 mt-8">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="mb-4">
                                            <img
                                               src={selectedImage || "https://via.placeholder.com/150"}
                                               alt="Upload Preview"
                                                className="w-[180px] h-[220px] object-cover rounded-md"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                ref={fileInputRef} // Sử dụng ref để lấy input file
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="w-full bg-[#2B559B] text-white font-bold text-sm rounded-md mt-2 py-2"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Mã số Giáo Viên:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    onChange={(e) =>
                                                        setNewTeacher({ ...newTeacher, teacherId: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Chuyên ngành:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    onChange={(e) =>
                                                        setNewTeacher({ ...newTeacher, specialization: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Họ:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    onChange={(e) =>
                                                        setNewTeacher({ ...newTeacher, firstName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên đệm:</p>
                                                <input
                                                    type="text"
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    onChange={(e) =>
                                                        setNewTeacher({ ...newTeacher, middleName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    onChange={(e) =>
                                                        setNewTeacher({ ...newTeacher, lastName: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-left">Email:</p>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                onChange={(e) =>
                                                    setNewTeacher({ ...newTeacher, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Email cá nhân:</p>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                onChange={(e) =>
                                                    setNewTeacher({ ...newTeacher, personalEmail: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Số điện thoại:</p>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                onChange={(e) =>
                                                    setNewTeacher({ ...newTeacher, phoneNumber: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Ngày sinh:</p>
                                            <input
                                                type="date"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                onChange={(e) =>
                                                    setNewTeacher({ ...newTeacher, dateOfBirth: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-8 mt-4 mb-8">
                                    <button
                                        type="submit"
                                        className="w-[300px] h-[64px] bg-secondaryBlue text-white rounded-md font-bold"
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        className="w-[300px] h-[64px] bg-red-500 text-white rounded-md font-bold"
                                        onClick={handleCancel}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormAddTeacher;
