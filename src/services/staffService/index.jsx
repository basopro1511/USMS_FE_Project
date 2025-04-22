import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Students in Database 
export const GetStaffs = async () => {
    try {
        const response = await request.get("Staff")
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Add New Teacher
export const AddStaff = async (staffData) => {
    try {
        const response = await request.post("Staff", staffData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Update Teacher
export const UpdateStaff = async (staffData) => {
    try {
        const response = await request.put("Staff", staffData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//#region import teacher
export const importStaff = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await request.post("/Staff/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Import error:", error);
        throw error;
    }
};
//#endregion
export const changeSelectedStaffStatus = async (userIds, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/Staff/ChangeStatus?status=${status}`, 
      userIds,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const handleExportStaff = async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.majorId) params.append("majorId", filters.majorId);
      if (filters.status !== undefined) params.append("status", filters.status.toString());
      const response = await request.get(`/Staff/export?${params.toString()}`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "DanhSachNhanVien.xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };
  
  export const handleExportEmptyFormStaff = async () => {
      try {
        const response = await request.get(`/Staff/exportEmpty`, {
          responseType: "blob", // Cực kỳ quan trọng
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "MauThemNhanVien.xlsx");
        return response.data;
      } catch (error) {
        console.error("Lỗi export:", error);
      }
    };