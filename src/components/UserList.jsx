/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const UserList = ({ users, onEdit, onDelete }) => {
    if (!Array.isArray(users)) {
        return <p>No users available</p>;
    }
    return (
        <div>
            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fullname</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>
                                <button onClick={() => onEdit(user.id)} style={{ marginRight: '10px' }}>
                                    Edit
                                </button>
                                <button onClick={() => onDelete(user.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
