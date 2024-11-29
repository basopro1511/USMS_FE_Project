import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAPIResponse = (response, onSuccess, onError) => {
        if (response?.isSuccess) {
            onSuccess(response.result);
            return true;
        } else {
            const errorMessage = response?.message || 'An error occurred';
            setError(errorMessage);
            if (onError){
                onError(errorMessage);
            } 
            return false;
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get('/Customers');
            handleAPIResponse(response, (result) => setUsers(result || []));
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (newUser) => {
        setError(null);
        try {
            const response = await axiosClient.post('/Customers', newUser);
            return handleAPIResponse(
                response,
                (result) => setUsers((prevUsers) => [...prevUsers, { ...newUser, id: result?.id }])
            );
        } catch (err) {
            setError(err.message || 'Failed to add user');
            return false;
        }
    };

    const updateUser = async (id, updatedUser) => {
        setError(null);
        try {
            const response = await axiosClient.put(`/Customers/${id}`, updatedUser);
            return handleAPIResponse(
                response,
                () =>
                    setUsers((prevUsers) =>
                        prevUsers.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
                    )
            );
        } catch (err) {
            setError(err.message || 'Failed to update user');
            return false;
        }
    };

    const deleteUser = async (id) => {
        setError(null);
        try {
            const response = await axiosClient.delete(`/Customers/${id}`);
            return handleAPIResponse(
                response,
                () => setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)),
                (errMessage) => setError(errMessage)
            ) ? null : response.message;
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete user';
            setError(errorMessage);
            return errorMessage;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
    };
};

export default useUsers;
