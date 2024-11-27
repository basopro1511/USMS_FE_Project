import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/Customers');
            setUsers(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = async (newUser) => {
        try {
            const response = await axiosClient.post('/Customers', newUser);
            setUsers([...users, { ...newUser, id: response.id }]);
        } catch (err) {
            setError(err.message || 'Failed to add user');
        }
    };

    const updateUser = async (username, updatedUser) => {
        try {
            await axiosClient.put(`/Customers/${username}`, updatedUser);
            setUsers(users.map((user) => (user.username === username ? updatedUser : user)));
        } catch (err) {
            setError(err.message || 'Failed to update user');
        }
    };

    const deleteUser = async (username) => {
        try {
            await axiosClient.delete(`/Customers/${username}`);
            setUsers(users.filter((user) => user.username !== username));
        } catch (err) {
            setError(err.message || 'Failed to delete user');
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
