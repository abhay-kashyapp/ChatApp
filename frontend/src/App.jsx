import React, { useEffect } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './Pages/HomePage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import { Toaster } from 'react-hot-toast';
import { authStore } from './store/authStore.js';


function App() {
    // ✅ Correct: Call authStore as a hook to subscribe to state changes
    const loggedUser = authStore((state) => state.loggedUser);
    const checkAuth = authStore((state) => state.checkAuth);
    const isCheckingAuth = authStore((state) => state.isCheckingAuth);

    // Check if user is already authenticated on app load
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className='min-h-screen bg-gray-800 text-white flex items-center justify-center'>
                <span className="text-xl">Loading...</span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-800 text-white'>
            <Navbar />
            <Routes>
                <Route path="/" element={loggedUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/signup" element={!loggedUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!loggedUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/profile" element={loggedUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
