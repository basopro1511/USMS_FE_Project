/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from '../pages/UserPage';
import UserFormPage from '../pages/UserFormPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserPage />} />
                <Route path="/users/new" element={<UserFormPage />} />
                <Route path="/users/edit/:id" element={<UserFormPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;

