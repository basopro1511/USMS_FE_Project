function StudentActivityDetail() {
    return (
      <div className="w-full mt-8 mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Xem chi tiết hoạt động
          </h1>
        </div>
        
        {/* Bảng chi tiết hoạt động */}
        <div className="overflow-x-auto mx-4 sm:mx-8 mb-8">
          <table className="min-w-full border border-gray-300">
            <tbody>
              <tr className="border-b flex flex-col sm:table-row">
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Ngày:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">Chủ nhật 29/09/2024</td>
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Môn học:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">Mobile Programming (PRM392)</td>
              </tr>
              <tr className="border-b flex flex-col sm:table-row">
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Thời gian:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">5 (7h30 - 9h15)</td>
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Số buổi học:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">7</td>
              </tr>
              <tr className="border-b flex flex-col sm:table-row">
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Lớp:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">EXE201_L06</td>
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Loại buổi học:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">Placeholder</td>
              </tr>
              <tr className="border-b flex flex-col sm:table-row">
                <td className="p-2 font-semibold text-gray-700 block sm:table-cell">Giảng viên:</td>
                <td className="p-2 text-gray-600 block sm:table-cell">
                  VuongNP <a href="#" className="text-blue-500 underline ml-4 bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-xl">Meet URL</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default StudentActivityDetail;
  