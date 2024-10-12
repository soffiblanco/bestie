// App.js
import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './layouts/header/NavBar';
import LoginForm from './components/loginComponent/LoginForm';
import Footer from './layouts/footer/footer';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/categories" element={<Categories/>} /> 
        </Routes>
      </main>
      <Footer /> {/* El footer fuera del header y al final del main */}
    </div>
  );
}

export default App;
