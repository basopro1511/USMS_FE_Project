import styled, { keyframes } from 'styled-components';

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
      <div
        style={{
          border: "1px solid white",
          marginTop: 15,
          width: 1600,
          height: 870,
          backgroundColor: "#fff",
          borderRadius: 20,
          marginBottom: 20,
          maxHeight: screen,
        }}
      >
        <div style={{ display: "flex" }}>
          <p
            style={{
              margin: "auto",
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 28,
            }}
          >
            Thời Khóa Biểu
          </p>
        </div>
        {/* Filter - Start */}
        <div
          style={{
            border: "1px solid white",
            width: "auto",
            height: "auto",
            display: "flex",
            marginTop: 20,
          }}
        >
          <div style={{ width: 100, display: "flex" }}>
            {/* Select Chuyên ngành  */}
            <form className="max-w-sm mx-auto ml-3">
              <select
                id="countries"
                style={{
                  height: 50,
                  width: 230,
                  border: "1px solid black",
                  borderRadius: 10,
                }}
              >
                <option selected>Chuyên ngành</option>
                <option value="US">United States</option>
              </select>
            </form>
            {/* Select Lớp */}
            <form className="max-w-sm mx-auto ml-3">
              <select
                id="countries"
                style={{
                  height: 50,
                  width: 168,
                  border: "1px solid black",
                  borderRadius: 10,
                }}
              >
                <option selected>Lớp</option>
                <option value="US">United States</option>
              </select>
            </form>
            {/* Select Môn */}
            <form className="max-w-sm mx-auto ml-3">
              <select
                id="countries"
                style={{
                  height: 50,
                  width: 168,
                  border: "1px solid black",
                  borderRadius: 10,
                }}
              >
                <option selected>Môn</option>
                <option value="US">United States</option>
              </select>
            </form>
            {/* Select Thời gian */}
            <form className="max-w-sm mx-auto ml-3">
              <select
                id="countries"
                style={{
                  height: 50,
                  width: 300,
                  border: "1px solid black",
                  borderRadius: 10,
                }}
              >
                <option selected>Thời gian</option>
                <option value="US">United States</option>
              </select>
            </form>
            <div
              className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
              style={{ display: "flex", marginLeft: 10 }}
            >
              <button
                type="button"
                style={{
                  border: "1px solid white",
                  borderRadius: 10,
                  width: 130,
                  backgroundColor: "#3c6470",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                <i
                  className="fa fa-search"
                  aria-hidden="true"
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                    color: "white",
                  }}
                ></i>
                Tìm kiếm
              </button>
            </div>
          </div>
          <div
            className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
            style={{ display: "flex", marginLeft: "auto", marginRight: 10 }}
          >
            <button
              type="button"
              style={{
                border: "1px solid white",
                borderRadius: 10,
                width: 130,
                backgroundColor: "#2f903f",
                color: "white",
                fontWeight: 600,
              }}
            >
              <i
                className="fa fa-plus"
                aria-hidden="true"
                style={{
                  width: 25,
                  height: 25,
                  marginRight: 10,
                  color: "white",
                }}
              ></i>
              Thêm TKB
            </button>
          </div>
        </div>
        {/* Filter - End */}

        {/* Bảng thời khóa biểu - start */}
        <div
          style={{
            marginLeft: 14,
            marginRight: 14,
            marginTop: 20,
            height: "auto",
          }}
        >
          <table
            style={{
              width: 1570,
              borderRadius: 15,
              borderCollapse: "separate",
              borderSpacing: 0,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#64a8bc",
                  color: "white",
                  borderRadius: 15,
                }}
              >
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderTopLeftRadius: 14,
                  }}
                >
                  Slot
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Hai<br></br>30/09
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Ba<br></br>01/10
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Tư<br></br>02/10
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Năm<br></br>03/10
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Sáu<br></br>04/10
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                >
                  Thứ Bảy<br></br>05/10
                </th>
                <th
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    borderTopRightRadius: 14,
                  }}
                >
                  Chủ Nhật<br></br>06/10
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Slot 1 - Start */}
              <tr>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Slot 1
                </td>
                {/* Thứ hai - Start */}
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  <div
                    style={{
                      border: "1px solid black",
                      width: 190,
                      height: "auto",
                      margin: "auto",
                      backgroundColor: "#e6f7ff",
                      borderRadius: 15,
                    }}
                  >
                    <div style={{ padding: 8 }}>
                      <div>
                        Mã môn học:{" "}
                        <span style={{ color: "#293bfa", fontWeight: "bold" }}>
                          PRN231c
                        </span>{" "}
                      </div>
                      <div>
                        Thời gian:{" "}
                        <span style={{ color: "#669fa0", fontWeight: "bold" }}>
                          (9:30-11:45)
                        </span>{" "}
                      </div>
                      <div>Phòng học: R.ON</div>
                      <div>
                        Giáo viên:{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Trống
                        </span>{" "}
                      </div>
                      <div style={{ height: 25, display: "flex" }}>
                        <OnlineIndicator></OnlineIndicator>
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#017a84",
                            marginLeft: 5,
                            marginTop: -5,
                          }}
                        >
                          Online
                        </span>{" "}
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginLeft: "auto", marginRight: 5 }}>
                          <button
                            type="button"
                            className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
                            style={{
                              border: "2px solid white",
                              borderRadius: 20,
                              width: 70,
                              height: 30,
                              backgroundColor: "#2196f3",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            <i
                              className="fa fa-pencil-square"
                              aria-hidden="true"
                              style={{
                                width: 52,
                                height: 25,
                                color: "black",
                                margin: "auto",
                              }}
                            ></i>
                          </button>
                        </div>
                        <div style={{ marginRight: "auto" }}>
                          <button
                            type="button"
                            className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
                            style={{
                              border: "2px solid white",
                              borderRadius: 20,
                              width: 70,
                              height: 30,
                              backgroundColor: "red",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              style={{
                                width: 52,
                                height: 25,
                                color: "black",
                                margin: "auto",
                              }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                {/* Thứ hai - End */}
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  <div
                    style={{
                      border: "1px solid black",
                      width: 190,
                      height: "auto",
                      margin: "auto",
                      backgroundColor: "#e6f7ff",
                      borderRadius: 15,
                    }}
                  >
                    <div style={{ padding: 8 }}>
                      <div>
                        Mã môn học:{" "}
                        <span style={{ color: "#293bfa", fontWeight: "bold" }}>
                          PRN231c
                        </span>{" "}
                      </div>
                      <div>
                        Thời gian:{" "}
                        <span style={{ color: "#669fa0", fontWeight: "bold" }}>
                          (9:30-11:45)
                        </span>{" "}
                      </div>
                      <div>Phòng học: G314</div>
                      <div>
                        Giáo viên:{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Trống
                        </span>{" "}
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginLeft: "auto", marginRight: 5 }}>
                          <button
                            type="button"
                            className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
                            style={{
                              border: "2px solid white",
                              borderRadius: 20,
                              width: 70,
                              height: 30,
                              backgroundColor: "#2196f3",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            <i
                              className="fa fa-pencil-square"
                              aria-hidden="true"
                              style={{
                                width: 52,
                                height: 25,
                                color: "black",
                                margin: "auto",
                              }}
                            ></i>
                          </button>
                        </div>
                        <div style={{ marginRight: "auto" }}>
                          <button
                            type="button"
                            className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"
                            style={{
                              border: "2px solid white",
                              borderRadius: 20,
                              width: 70,
                              height: 30,
                              backgroundColor: "red",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              style={{
                                width: 52,
                                height: 25,
                                color: "black",
                                margin: "auto",
                              }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>{" "}
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Slot 2
                </td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Slot 3
                </td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Slot 4
                </td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                    borderBottomLeftRadius: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Slot 5
                </td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                    borderBottomRightRadius: 14,
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
          {/* Bảng thời khóa biểu - end */}

          {/* Phân trang - start */}
          <div className="flex mt-5">
            {/* Button: Tuần Trước */}
            <button
              type="button"
              className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
            >
              <span className="font-bold text-xl">&lt;</span> Tuần Trước
            </button>

            {/* Date Range */}
            <div className="border-2 border-black rounded-lg w-[220px] h-[40px] bg-[#e0e5e9] flex items-center justify-center">
              <p>25/11 Đến 01/12</p>
            </div>

            {/* Button: Tuần Sau */}
            <button
              type="button"
              className="rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
            >
              Tuần Sau <span className="font-bold text-xl">&gt;</span>
            </button>
          </div>

          {/* Phân trang - end */}
        </div>
      </div>
    );
  }
  
  export default ManageSchedule