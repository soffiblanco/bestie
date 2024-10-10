import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './layouts/header/NavBar';
import SignupForm from './components/loginComponent/SignupForm';
import LoginForm from '../src/components/loginComponent/LoginForm';
import Footer from './layouts/footer/footer';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                </Routes>
            </header>
            <Footer/> 
        </div>
    );
}

export default App;

