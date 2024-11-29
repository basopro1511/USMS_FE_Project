/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from '../components/UserForm';
import useUsers from '../hooks/useUsers';

const UserFormPage = () => {
    const { id } = useParams();
    const { users, addUser, updateUser, error } = useUsers();
    const navigate = useNavigate();

    const editingUser = id ? users.find((user) => user.id === id) : null;

    const handleSubmit = async  (formData) => {
        let isSuccess;
        if (editingUser) {
            isSuccess = await updateUser(editingUser.id, formData);
        } else {
            isSuccess = await addUser(formData);
        }

        if (isSuccess) {
            navigate('/');
        }
    };

    return (
        <div>
            <h1>{editingUser ? 'Edit User' : 'Add User'}</h1>
            <UserForm onSubmit={handleSubmit} initialData={editingUser} error={error} />
        </div>
    );
};

export default UserFormPage;
