/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, initialData = {}, error }) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        address: initialData?.address || ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || '',
                name: initialData.name || '',
                phone: initialData.phone || '',
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
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <input
                type="text"
                name="id"
                placeholder="ID"
                value={formData.id}
                onChange={handleChange}
                required
                readOnly={initialData ? true : false}
            />
            <br />
            <input
                type="text"
                name="name"
                placeholder="Fullname"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
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
