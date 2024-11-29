/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../hooks/useUsers';
import UserList from '../components/UserList';

const UserPage = () => {
    const { users, loading, deleteUser } = useUsers();
    const [deleteError, setDeleteError] = useState(null);
    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/users/new');
    };

    const handleEditUser = (id) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDeleteUser = async (id) => {
        const errorMessage = await deleteUser(id);
        if (errorMessage) {
            setDeleteError(errorMessage);
        } else {
            setDeleteError(null);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="user-page">
            <h1>User Management</h1>
            <button onClick={handleAddUser} style={{ marginBottom: '20px' }}>
                Add Customer
            </button>
            {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
            <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </div>
    );
};

export default UserPage;
