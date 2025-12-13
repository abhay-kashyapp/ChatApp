import React from 'react';

import { Navigate, Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './Pages/HomePage.jsx';
import SignUpPage from './Pages/SignupPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import { Toaster } from 'react-hot-toast';
import { authStore } from './store/authstore.js';



function App() {

    const {loggedUser} = authStore();
 return <div className='min-h-screen bg-gray-800 text-white'>
    <Navbar/>
    <Routes>
        <Route path="/" element={loggedUser ? <HomePage/>: <Navigate to="/login"/>}/>
        <Route path="/signup" element={!loggedUser? <SignUpPage/>:<Navigate to="/"/>}/>
        <Route path="/login" element={!loggedUser?<LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/profile" element={loggedUser? <ProfilePage/>: <Navigate to="/login"/>}/>
    </Routes>
    <Toaster/>
 </div>
}

export default App;
