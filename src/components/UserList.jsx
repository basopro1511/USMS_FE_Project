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
                        <th>Username</th>
                        <th>Fullname</th>
                        <th>Birthday</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.fullname}</td>
                            <td>{user.birthday}</td>
                            <td>{user.gender}</td>
                            <td>{user.address}</td>
                            <td>
                                <button onClick={() => onEdit(user.username)} style={{ marginRight: '10px' }}>
                                    Edit
                                </button>
                                <button onClick={() => onDelete(user.username)}>
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
