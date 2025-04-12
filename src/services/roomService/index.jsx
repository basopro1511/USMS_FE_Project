import { saveAs } from "file-saver";
import request from "../../utils/baseURL";

//Get all Rooms in Database 
export const getRooms = async () => {
    try {
        const response = await request.get("Room")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Room
export const AddRoom = async (roomData) => {
    try {
        const response = await request.post("Room", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Room
export const UpdateRoom = async (roomData) => {
    try {
        const response = await request.put("Room", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a room
export const changeRoomStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Room/ChangeStatus/${id}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a room
export const GetAvailableRoom = async (date, slotId) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Room/AvailableRooms/${date}/${slotId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const GetAvailableRoomToAddExamSchedule = async (date, startTime, endTime) => {
    try {
        const response = await request.get(`/Room/AvailableRoomsToAddExamSchedule/${date}/${startTime}/${endTime}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const changeSelectedRoomStatus = async (ids, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.put(`/Room/ChangeSelectStatus?status=${status}`, 
            ids,
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
export const importRooms = async (file) => {
  try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await request.post("/Room/import", formData, {
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

export const handleExportRoom = async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.majorId) params.append("majorId", filters.majorId);
      if (filters.status !== undefined) params.append("status", filters.status.toString());
      const response = await request.get(`/Room/export?${params.toString()}`, {
        responseType: "blob", // Cực kỳ quan trọng
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "DanhSachPhongHoc.xlsx");
      return response.data;
    } catch (error) {
      console.error("Lỗi export:", error);
    }
  };
  
  export const handleExportEmptyFormRoom = async () => {
      try {
        const response = await request.get(`/Room/exportEmpty`, {
          responseType: "blob", // Cực kỳ quan trọng
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "MauThemPhongHoc.xlsx");
        return response.data;
      } catch (error) {
        console.error("Lỗi export:", error);
      }
    };