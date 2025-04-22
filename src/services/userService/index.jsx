import request from "../../utils/baseURL";

//Get all Classes by major in Database 
export const GetUserByID = async (id) => {
    try {
        const response = await request.get(`/User/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const GetUserByEmail = async (email) => {
    try {
        const response = await request.get(`/User/Email/${email}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ResetPassword = async (passwordData) => {
    try {
        const response = await request.put("/User/ResetPassword",passwordData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ResetPasswordByEmail = async (data) => {
    try {
        const response = await request.put("/User/ResetPasswordByEmail", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const ForgotPasswordOTP = async (email) => {
    try {
        const response = await request.post(`/User/ForgotPassword/${email}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
}
