/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../hooks/useUsers';
import UserList from '../components/UserList';

const UserPage = () => {
    const { users, loading, error, deleteUser } = useUsers();
    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/users/new');
    };

    const handleEditUser = (username) => {
        navigate(`/users/edit/${username}`);
    };

    const handleDeleteUser = (username) => {
        deleteUser(username);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="user-page">
            <h1>User Management</h1>
            <button onClick={handleAddUser} style={{ marginBottom: '20px' }}>
                Add Customer
            </button>
            <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </div>
    );
};

export default UserPage;
