import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Subjects in Database 
export const getSubjects = async () => {
    try {
        const response = await request.get("Subjects")
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Subject
export const AddSubject = async (subjectData) => {
    try {
        const response = await request.post("Subjects", subjectData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Subject
export const UpdateSubject = async (subjectData) => {
    try {
        const response = await request.put("Subjects", subjectData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Change the status of a Subject
export const getSubjectById = async (id) => {
    try {
        const response = await request.get(`/Subjects/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
// Change the status of a Subject
export const changeSubjectStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Subjects/SwitchStateSubject/${id}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//Get Subjects By Major Id và Term
export const getSubjectsByMajorAndTerm = async (id, term) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Subjects/GetSubjectByMajorAndTerm/${id}/${term}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const changeSelectedSubjecttatus = async (classIds, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/Subjects/ChangeSelectStatus?status=${status}`, classIds);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


export const handleExportSubject = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.majorId) params.append("majorId", filters.majorId);
    if (filters.status !== undefined)
      params.append("status", filters.status.toString());
    const response = await request.get(
      `/Subjects/export?${params.toString()}`,
      {
        responseType: "blob", // Cực kỳ quan trọng
      }
    );
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "DanhSachMonHoc.xlsx");
    return response.data;
  } catch (error) {
    console.error("Lỗi export:", error);
  }
};
  
  export const handleExportEmptyFormSubject = async () => {
      try {
        const response = await request.get(`/Subjects/exportEmpty`, {
          responseType: "blob", // Cực kỳ quan trọng
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "MauThemMonHoc.xlsx");
        return response.data;
      } catch (error) {
        console.error("Lỗi export:", error);
      }
    };
    //#region import subject
    export const importSubjects = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await request.post("/Subjects/import", formData, {
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
    