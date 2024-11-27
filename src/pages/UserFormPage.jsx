/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from '../components/UserForm';
import useUsers from '../hooks/useUsers';

const UserFormPage = () => {
    const { id } = useParams();
    const { users, addUser, updateUser } = useUsers();
    const navigate = useNavigate();

    const editingUser = id ? users.find((user) => user.id === id) : null;

    const handleSubmit = (formData) => {
        if (editingUser) {
            updateUser(editingUser.id, formData);
        } else {
            addUser(formData);
        }
        navigate('/');
    };

    return (
        <div>
            <h1>{editingUser ? 'Edit User' : 'Add User'}</h1>
            <UserForm onSubmit={handleSubmit} initialData={editingUser} />
        </div>
    );
};

export default UserFormPage;
