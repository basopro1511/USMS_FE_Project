// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => {
  return (
           <div className="flex items-center aling-center mt-5 mb-2">
            <div className="flex items-center space-x-4 ml-auto mr-80">
              <button
                type="button"
                className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold flex items-center justify-center"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="font-bold text-xl">&lt;</span> Trang Trước
              </button>
              <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex flex-col items-center justify-center">
                <p>{`Trang ${currentPage} trên ${totalPages}`}</p>
              </div>
              <button
                type="button"
                className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold flex items-center justify-center"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Trang Sau <span className="font-bold text-xl">&gt;</span>
              </button>
            </div>
            <div>
              <p className="mr-8">{`Mỗi trang: ${pageSize} mục - Tổng: ${totalItems}`}</p>
            </div>
          </div>
  );
};

export default Pagination;
