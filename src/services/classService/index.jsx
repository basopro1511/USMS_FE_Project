import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Rooms in Database 
export const getClasses = async () => {
    try {
        const response = await request.get("ClassSubject")
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//#region Get Schedule by Id
export const GetClassSubjectById = async (id) => {
    try {
        const response = await request.get(`ClassSubject/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion
//Add New Class
export const AddClass = async (roomData) => {
    try {
        const response = await request.post("ClassSubject", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Class
export const UpdateClass = async (roomData) => {
    try {
        const response = await request.put("ClassSubject", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Get all Classes by major in Database 
export const getClassesIdByMajorId = async (id) => {
    try {
        const response = await request.get(`/ClassSubject/ClassIdsByMajorId/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Get all Classes by classId in Database 
export const getClassesIdByClassId = async (id) => {
    try {
        const response = await request.get(`/ClassSubject/classId/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const changeSelectedClassStatus = async (classIds, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/ClassSubject/ChangeSelectStatus?status=${status}`, classIds);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
// // Change the status of a room
// export const changeRoomStatus = async (id, status) => {
//     try {
//         // Construct the URL with id and status
//         const response = await request.get(`/Room/ChangeStatus/${id}/${status}`);
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

export const autoGenerateClass = async (studentIds,classCapacity,majorId,subjectId,semesterId,term
  ) => {
    try {
      const queryParams = new URLSearchParams({
        classCapacity: classCapacity.toString(),
        majorId,
        subjectId,
        semesterId,
        term: term.toString(),
      });
      const response = await request.post(
        `/ClassSubject/AutoCreateClass?${queryParams.toString()}`,
        studentIds // gửi mảng StudentIds trong body
      );
  
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API auto-generate class:", error);
      throw error.response?.data || error;
    }
  };


export const handleExportClass = async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.majorId) params.append("majorId", filters.majorId);
      if (filters.classId) params.append("classId", filters.classId);
      if (filters.subjectId) params.append("subjectId", filters.subjectId);
      if (filters.status !== undefined) params.append("status", filters.status.toString());
      const response = await request.get(`/ClassSubject/export?${params.toString()}`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "DanhSachLop"+filters.majorId+"_"+filters.classId+"_"+filters.subjectId+".xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };
  
