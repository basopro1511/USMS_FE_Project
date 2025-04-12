import { saveAs } from "file-saver";
import request from "../../utils/baseURL";


export const GetStudentDataByClassId = async (id) => {
    try {
        const response = await request.get(`/StudentInClass/ClassId/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const AddStudentToClass = async (data) => {
    try {
        const response = await request.post("StudentInClass", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const getAvailableStudent = async (id) => {
    try {
        const response = await request.get(`/StudentInClass/AvailableStudent/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//#region Delete Student In Class
export const DeleteStudentInClass = async (id) => {
    try {
        const response = await request.delete(`/StudentInClass/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion
export const AddMultipleStudentToClass = async (data) => {
    try {
        const response = await request.post("StudentInClass/AddMutipleStudents", data);
        return response.data;
    } catch (error) {
        console.error("Error adding multiple students to class:", error);
        return { isSuccess: false, message: "Failed to add multiple students." };
    }
};

export const handleExportStudentInClass = async (id,classId, subjectId) => {
    try {
        const params = new URLSearchParams();
        if (id) params.append("id",id);
        const response = await request.get(
            `/StudentInClass/export?${params.toString()}`,
            {
              responseType: "blob", // Cực kỳ quan trọng
            }
          );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    saveAs(blob, "DanhSachSinhVienTrongLop"+classId+"_"+subjectId+".xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };