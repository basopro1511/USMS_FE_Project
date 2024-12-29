import AvatarSquare from "../../../assets/Imgs/avatar_square.jpg";

function StudentDetail() {
  return (
    <div className="w-full  mt-4 mx-auto">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Thông tin học sinh
        </h1>
        <div className="flex flex-col md:flex-row mt-6 ">
          {/* Avatar Start */}
          <div className="flex flex-col items-center ml-auto mr-12 text-left ">
            <img
              className="w-[180px] h-[220px] rounded mb-5"
              src={AvatarSquare}
              alt="Default avatar"
            ></img>
            <p>Current Term No: 8</p>
          </div>
          {/* Avatar End */}

          <div className="flex flex-col md:flex-row md:mr-auto">
            {/* Left Side Start */}
            <div className="w-full md:w-[490px] text-left text-gray-600 text-sm font-medium mb-4">
              <div className="flex flex-col md:flex-row mb-4">
                <div className="flex-1 md:mr-4">
                  <label>Họ</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label>Tên đệm</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 mt-1 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Email học sinh</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label>Chuyên ngành</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
            </div>
            {/* Left Side End */}

            {/* Right Side Start */}
            <div className="w-full md:w-[490px] text-left text-gray-600 text-sm font-medium md:ml-8">
              <div className="mb-4">
                <div className="flex flex-col md:flex-row mb-4">
                  <div className="flex-1 md:mr-4">
                    <label>Tên</label>
                    <input
                      type="text"
                      className="w-full border px-4 py-2 mt-1 rounded-md"
                    />
                  </div>
                  <div className="flex-1 md:mr-4">
                    <label>Mã số sinh viên</label>
                    <input
                      type="text"
                      className="w-full border px-4 py-2 mt-1 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label>Giới tính</label>
                    <input
                      type="text"
                      className="w-full border px-4 py-2 mt-1 rounded-md"
                    />
                  </div>
                </div>
                <label>Email cá nhân</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label>Ngày tháng năm sinh</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 mt-1 rounded-md"
                />
              </div>
            </div>
            {/* Right Side End */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentDetail;
