import request from "../../utils/baseURL";
import { saveAs } from "file-saver";
//Get all Students in Database 
export const getStudents = async () => {
    try {
        const response = await request.get("Student")
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Student
export const AddStudent = async (StudentData) => {
    try {
        const response = await request.post("Student", StudentData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const GetStudentById = async (id) => {
    try {
        const response = await request.get(`/Student/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Student
export const UpdateStudent = async (data) => {
    try {
        const response = await request.put("Student", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a Student
export const changeStudentStatus = async (userIds, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/Student/ChangeStatus?status=${status}`, 
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
//#region import student
export const importStudents = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await request.post("/Student/import", formData, {
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

 export const handleExport = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.majorId) params.append("majorId", filters.majorId);
    if (filters.status !== undefined) params.append("status", filters.status.toString());
    const response = await request.get(`/Student/export?${params.toString()}`, {
      responseType: "blob", // Cực kỳ quan trọng
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "DanhSachSinhVien"+filters.majorId+ ".xlsx");
    return response.data;
  } catch (error) {
    console.error("Lỗi export:", error);
  }
};

export const handleExportEmptyForm = async () => {
    try {
      const response = await request.get(`/Student/exportEmpty`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "MauThemSinhVien.xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };