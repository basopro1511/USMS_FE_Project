import  { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

const StudentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const sampleData = [
      {
        slot: "Buổi 1",
        monday: {
          subject: "PRN231",
          time: "7:00 - 9:15",
          room: "G101",
          online: true,
        },
        tuesday: {
          subject: "PRN231",
          time: "7:00 - 9:15",
          room: "G102",
          online: false,
        },
        wednesday: null,
        thursday: {
          subject: "PRN231",
          time: "7:00 - 9:15",
          room: "G103",
          online: true,
        },
        friday: null,
        saturday: {
          subject: "PRN231",
          time: "7:00 - 9:15",
          room: "G104",
          online: false,
        },
        sunday: null,
      },
      {
        slot: "Buổi 2 ",
        monday: {
          subject: "PRN231",
          time: "9:30 - 11:45",
          room: "G201",
          online: false,
        },
        tuesday: null,
        wednesday: {
          subject: "PRN231",
          time: "9:30 - 11:45",
          room: "G202",
          online: false,
        },
        thursday: null,
        friday: {
          subject: "PRN231",
          time: "9:30 - 11:45",
          room: "G203",
          online: true,
        },
        saturday: null,
        sunday: null,
      },
      {
        slot: "Buổi 3 ",
        monday: null,
        tuesday: null,
        wednesday: {
          subject: "PRN231",
          time: "9:30 - 11:45",
          room: "G202",
          online: false,
        },
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      {
        slot: "Buổi 4 ",
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      {
        slot: "Buổi 5 ",
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      {
        slot: "Buổi 6 ",
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    ];
    setScheduleData(sampleData);
  }, []);

  return (
    <div className="w-full max-w-[1920px] mb-5 p-4">
      <div className="m-auto mt-2 w-full max-w-[1600px] text-center">
        {/* Title */}
        <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-primaryGreen mb-6">
          Lịch học hàng tuần
        </h1>

        {/* Select Inputs */}
        <div className="flex mb-3">
          <div className="flex flex-row items-center mb-4 ml-auto mr-auto">
            <label className="text-[18px] sm:text-[24px] mr-2">
              Chọn Năm:</label>
            <select className="h-10 border border-gray-300 rounded-md px-2">
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>

            <label className="text-[18px] sm:text-[24px] mx-2 ml-5">
              Chọn Tuần:
            </label>
            <select className="h-10 border border-gray-300 rounded-md px-2">
              <option value="30/09 - 06/10">30/09 - 06/10</option>
              <option value="07/10 - 13/10">07/10 - 13/10</option>
              <option value="14/10 - 20/10">14/10 - 20/10</option>
            </select>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-auto border border-gray-300 ">
          <table className="table-auto w-full">
            <thead className="bg-tritenaryGreen">
              <tr>
                <th className="text-white text-[16px] sm:text-[18px] md:text-[24px] border border-black p-2">
                  Buổi
                </th>
                {[
                  "Thứ Hai",
                  "Thứ Ba",
                  "Thứ Tư",
                  "Thứ Năm",
                  "Thứ Sáu",
                  "Thứ Bảy",
                  "Chủ Nhật",
                ].map((day, index) => (
                  <th
                    key={index}
                    className="text-white text-[14px] sm:text-[18px] md:text-[24px] border border-black  p-2"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, idx) => (
                <tr key={idx} className="border border-black">
                  <td className="font-semibold text-[16px] sm:text-[18px] md:text-[24px] border border-black">
                    {row.slot}
                  </td>
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day, idx) => (
                    <td key={idx} className="border border-black p-5">
                      {row[day] ? (
                        <div className="bg-whiteBlue border border-black p-2 rounded-2xl h-[auto] text-left pl-5">
                          <p className="text-[14px] sm:text-[16px] md:text-[18px]">
                              Môn:{" "}
                              <Link
                                to="/studentActivityDetail"
                                className="text-blue-600 font-bold hover:text-blue-900 cursor-pointer hover:underline"
                              >
                                {row[day].subject}
                              </Link>
                            </p>

                          <p className="text-[12px] sm:text-[14px] md:text-[15px] ">
                            Thời gian: <span className="text-quaternartyGreen font-bold">({row[day].time})</span>
                          </p>
                          <p className="text-[12px] sm:text-[14px] md:text-[15px] ">
                            Phòng: {row[day].room}
                          </p>
                          {row[day].online && (
                            <p className="text-green-500 text-[14px] sm:text-[16px] md:text-[18px] font-bold">
                              Online
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400"></p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
