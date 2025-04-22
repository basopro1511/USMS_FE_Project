import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Students in Database 
export const getTeachers = async () => {
    try {
        const response = await request.get("Teacher")
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Add New Teacher
export const AddTeacher = async (teacherData) => {
    try {
        const response = await request.post("Teacher", teacherData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Update Teacher
export const UpdateTeacher = async (teacherData) => {
    try {
        const response = await request.put("Teacher", teacherData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//#region import teacher
export const importTeachers = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await request.post("/Teacher/import", formData, {
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
export const changeSelectedTeacherStatus = async (userIds, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/Teacher/ChangeStatus?status=${status}`, 
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
export const handleExportEmptyFormTeacher = async () => {
    try {
      const response = await request.get(`/Teacher/exportEmpty`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "MauThemGiaoVien.xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };

  export const handleExportTeacher = async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.majorId) params.append("majorId", filters.majorId);
      if (filters.status !== undefined) params.append("status", filters.status.toString());
      const response = await request.get(`/Teacher/export?${params.toString()}`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "DanhSachGiaoVien"+filters.majorId+ ".xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };