import styled, { keyframes } from "styled-components";

function ManageSchedule() {
  const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;
  const OnlineIndicator = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #4caf50;
    border-radius: 50%;
    margin-right: 5px;
    animation: ${blink} 1s linear infinite;
  `;
  return (
    <div className="border border-white mt-4 w-[1600px] h-[870px] bg-white rounded-2xl">
      <div className="flex">
        <p className="m-auto text-3xl font-bold mt-8">Thời Khóa Biểu</p>
      </div>
      {/* Filter - Start */}
      <div className="flex w-auto h-12 mt-5">
        <div className="flex">
          {/* Select Chuyên ngành  */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
            id="countries"
          >
            <option selected>Chuyên ngành</option>
            <option value="IT">Information Technology</option>
            <option value="IB">Information Technology</option>
            <option value="IT">Information Technology</option>
            <option value="IT">Information Technology</option>
          </select>
          {/* Select Lớp */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
            id=""
          >
            <option selected>Lớp</option>
            <option value="SE1702">SE1702</option>
          </select>
          {/* Select Môn */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[168px] border border-black rounded-xl"
            id=""
          >
            <option selected>Môn</option>
            <option value="PRM392">PRM392</option>
          </select>
          {/* Select Thời gian */}
          <select
            className="max-w-sm mx-auto ml-3 h-12 w-[300px] border border-black rounded-xl"
            id="countries"
          >
            <option selected>Thời gian</option>
            <option value="US">United States</option>
          </select>
          <div className="flex ml-2 rounded-full transition-all duration-300  hover:scale-95">
            <button
              type="button"
              className="border border-black rounded-xl w-[130px] bg-primaryBlue text-white font-600"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="flex rounded-full transition-all duration-300 hover:scale-95 ml-auto mr-4">
          <button
            type="button"
            className="border border-white rounded-xl w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold">
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm TKB
          </button>
        </div>
      </div>
      {/* Filter - End */}

      {/* Bảng thời khóa biểu - start */}
      <div className="ml-3 mr-3 mt-5 h-auto">
        <table className="w-[1570px] border rounded-2xl border-separate border-spacing-0">
          <thead>
            <tr className="bg-secondaryBlue text-white rounded-xl">
              <th className="border-t border-l border-black rounded-tl-xl">
                Slot
              </th>
              <th className="border-t border-l border-black">
                Thứ Hai<br></br>30/09
              </th>
              <th className="border-t border-l border-black">
                Thứ Ba<br></br>01/10
              </th>
              <th className="border-t border-l border-black">
                Thứ Tư<br></br>02/10
              </th>
              <th className="border-t border-l border-black">
                Thứ Năm<br></br>03/10
              </th>
              <th className="border-t border-l border-black">
                Thứ Sáu<br></br>04/10
              </th>
              <th className="border-t border-l border-black">
                Thứ Bảy<br></br>05/10
              </th>
              <th className="border-t border-l border-r border-black rounded-tr-xl">
                Chủ Nhật<br></br>06/10
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Slot 1 - Start */}
            <tr>
              <td className="border-t border-l border-black font-bold text-center">
                Slot 1
              </td>
              {/* Thứ hai - Start */}
              <td className="border-t border-l border-black pt-5 pb-5"> 
                {/* Subject Component - Start */}
                <div className="border border-black w-[190px] h-auto m-auto rounded-2xl bg-whiteBlue">
                  <div className="p-2">
                    <div>
                      Mã môn học:
                      <span className="ml-1 font-bold text-boldBlue">
                        PRN231c
                      </span>{" "}
                    </div>
                    <div>
                      Thời gian: 
                       <span className="ml-1 font-bold text-quaternartyGreen">
                        (9:30-11:45)
                      </span>
                    </div>
                    <div>Phòng học: R.ON</div>
                    <div>
                      Giáo viên:
                      <span className="ml-1 font-bold text-red-500">Trống</span>{" "}
                    </div>
                    <div className="flex h-6">
                      <OnlineIndicator></OnlineIndicator>
                       <span
                        className="font-bold text-primaryGreen ml-2 mb-auto text-2xl"
                        style={{ marginTop: -8 }}
                      >
                        Online
                      </span>{" "}
                    </div>
                    <div className="flex">
                      <div className="flex  m-auto">
                        <button type="button" className="border border-white w-[70px] h-[30px] bg-btnBlue text-white font-bold rounded-full transition-all duration-300  hover:scale-95"
                        >
                          <i
                            className="fa fa-pencil-square w-13 h-21 text-black m-auto"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                      <div style={{ marginRight: "auto" }}>
                        <button
                          type="button"
                          className="border border-white w-[70px] h-[30px] bg-red-600 text-white font-bold rounded-full transition-all duration-300  hover:scale-95"
                        >
                          <i
                            className="fa fa-trash  w-13 h-21 text-black m-auto"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Subject Component - End */}
              </td>
              {/* Thứ hai - End */}
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-r border-black"></td>
            </tr>
            <tr>
              <td className="border-t border-l border-black text-center font-bold">
                Slot 2
              </td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-r border-black"></td>
            </tr>
            <tr>
              <td className="border-t border-l border-black text-center font-bold">
                Slot 3
              </td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-r border-black"></td>
            </tr>
            <tr>
              <td className="border-t border-l border-black text-center font-bold">
                Slot 4
              </td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-black"></td>
              <td className="border-t border-l border-r border-black"></td>
            </tr>
            <tr>
              <td className="border-t border-l border-b border-black text-center font-bold rounded-bl-xl">
                Slot 5
              </td>
              <td className="border-t border-l border-b border-black"></td>
              <td className="border-t border-l border-b border-black"></td>
              <td className="border-t border-l border-b border-black"></td>
              <td className="border-t border-l border-b border-black"></td>
              <td className="border-t border-l border-b border-black"></td>
              <td className="border-t border-l border-b border-black"></td>

              <td className="border-t border-l border-b border-r rounded-br-xl border-black"></td>
            </tr>
          </tbody>
        </table>
        {/* Bảng thời khóa biểu - end */}

        {/* Phân trang - start */}
        <div className="flex mt-5">
          {/* Button: Tuần Trước */}
          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
          >
            <span className="font-bold text-xl">&lt;</span> Tuần Trước
          </button>

          {/* Date Range */}
          <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
            <p>25/11 Đến 01/12</p>
          </div>

          {/* Button: Tuần Sau */}
          <button
            type="button"
            className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
          >
            Tuần Sau <span className="font-bold text-xl">&gt;</span>
          </button>
        </div>

        {/* Phân trang - end */}
      </div>
    </div>
  );
}

export default ManageSchedule;
