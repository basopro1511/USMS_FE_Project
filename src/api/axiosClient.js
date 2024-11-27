import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7179/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default axiosClient;
