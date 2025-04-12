import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Semesters in Database 
export const getSemesters = async () => {
    try {
        const response = await request.get("Semester")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Semester
export const AddSemester = async (SemesterData) => {
    try {
        const response = await request.post("Semester", SemesterData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Semester
export const UpdateSemester = async (SemesterData) => {
    try {
        const response = await request.put("Semester", SemesterData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a Semester
export const changeSemesterStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Semester/ChangeStatus/${id}/${status}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const changeSelectedSemesterStatus = async (semesterIds, status) => {
  try {
      // Construct the URL with id and status
      const response = await request.put(`/Semester/ChangeSelectStatus?status=${status}`, semesterIds);
      return response.data;
  } catch (error) {
      console.log(error);
  }
}

export const handleExportSemester = async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== undefined) params.append("status", filters.status.toString());
      const response = await request.get(`/Semester/export?${params.toString()}`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "DanhSachHocKy.xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };
  
  export const handleExportEmptyFormSemester = async () => {
      try {
        const response = await request.get(`/Semester/exportEmpty`, {
          responseType: "blob", // Cực kỳ quan trọng
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "MauThemHocKy.xlsx");
        return response.data;
      } catch (error) {
        console.error("Lỗi export:", error);
      }
    };
    //#region import student

export const importSemesters = async (file) => {
  try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await request.post("/Semester/import", formData, {
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