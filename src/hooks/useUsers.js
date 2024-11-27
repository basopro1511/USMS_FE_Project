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
            setUsers(response.result);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = (newUser) => {
        try {
            const response = axiosClient.post('/Customers', newUser);
            setUsers([...users, { ...newUser, id: response.result.id }]);
        } catch (err) {
            setError(err.message || 'Failed to add user');
        }
    };

    const updateUser = (id, updatedUser) => {
        try {
            axiosClient.put(`/Customers/${id}`, updatedUser);
            setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
        } catch (err) {
            setError(err.message || 'Failed to update user');
        }
    };

    const deleteUser = (id) => {
        try {
            axiosClient.delete(`/Customers/${id}`);
            setUsers(users.filter((user) => user.id !== id));
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
