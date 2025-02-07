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

