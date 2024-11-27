/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the CRUD App</h1>
            <nav>
                <Link to="/">Home</Link> | <Link to="/users">Manage Users</Link>
            </nav>
        </div>
    );
};

export default HomePage;
