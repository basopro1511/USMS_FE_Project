/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, initialData = {} }) => {
    const formatDate = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date);
        return formattedDate.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        username: initialData?.username || '',
        password: initialData?.password || '',
        fullname: initialData?.fullname || '',
        gender: initialData?.gender || '',
        birthday: initialData?.birthday ? formatDate(initialData.birthday) : '',
        address: initialData?.address || ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || '',
                password: initialData.password || '',
                fullname: initialData.fullname || '',
                gender: initialData.gender || '',
                birthday: initialData.birthday ? formatDate(initialData.birthday) : '',
                address: initialData.address || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                readOnly={initialData ? true : false}
            />
            <br />
            <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="text"
                name="fullname"
                placeholder="Fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="date"
                name="birthday"
                placeholder="Birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
            />
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserForm;
