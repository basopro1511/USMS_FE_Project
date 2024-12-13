import Avatar from "../../../assets/Imgs/avatar.jpg";
import { useLocation } from "react-router-dom";

function HeaderManage() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  // Kiểm tra nếu đường dẫn hiện tại khớp với đường dẫn nào đó
  const isActive = (path) => location.pathname === path;
    return (
      <div className="h-18 bg-white rounded-2xl flex">
        <div style={{ marginLeft: 17, marginTop:"auto", marginBottom:"auto", display:"flex"}}>
        {isActive && (
          <>
            <i className="fas fa-calendar w-4 h-4 mr-2 mt-auto mb-auto"></i>
            <p className="text-lg italic">Quản lý lịch học</p>
          </>
        )}
        </div>
        <div style={{width: "auto", marginRight:17, height:70, marginLeft:"auto", display:"flex"}}>
        <img style={{marginTop:"auto", marginBottom:"auto"}} className="w-12 h-12 rounded-full" src={Avatar} alt="Rounded avatar"></img>
        <div style={{marginLeft: 10, marginTop:"auto", marginBottom:"auto"}}>
          <p style={{fontWeight: "bold"}}>Nguyễn Quốc Hoàng</p>
          <button type="button" className="bg-whitegray px-3 py-0.5 rounded-full transition-all duration-300 hover:bg-quaternarty hover:scale-95"> Đăng Xuất</button>
        </div>
        </div>
       </div>
    )
  }
  
  export default HeaderManage;