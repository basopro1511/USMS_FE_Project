import request from "../../utils/baseURL";

//Get all Subjects in Database 
export const getSubjects = async () => {
    try {
        const response = await request.get("Subjects")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Subject
export const AddSubject = async (subjectData) => {
    try {
        const response = await request.post("Subjects", subjectData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Subject
export const UpdateSubject = async (subjectData) => {
    try {
        const response = await request.put("Subjects", subjectData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a Subject
export const changeSubjectStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Subjects/SwitchStateSubject/${id}/${status}`);
        console.log(response.data);
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

// Get Subject By ID
export const getSubjectById = async (id) => {
    try {
        const response = await request.get(`/Subjects/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}