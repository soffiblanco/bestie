// App.js
import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './layouts/header/NavBar';
import LoginForm from './components/loginComponent/LoginForm';
import Footer from './layouts/footer/footer';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import Profile from './pages/Admin/Profile';
import UserPage from './pages/Admin/UserPage';
import CategoryPage from './pages/Admin/CategoryPage';
import SubcategoryPage from './pages/Admin/SubcategoryPage';
import ProductPage from './pages/Admin/ProductPage';
import AddUser from './pages/Admin/AddUser';
import AddCategory from './pages/Admin/AddCategory';
import AddSubcategory from './pages/Admin/AddSubcategory';
import AddProduct from './pages/Admin/AddProduct';
import EditUser from './pages/Admin/EditUser';
import EditCategory from './pages/Admin/EditCategory';
import EditSubcategory from './pages/Admin/EditSubcategory';
import EditProduct from './pages/Admin/EditProduct';

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
          <Route path="/profile" element={<Profile/>} /> 
          <Route path="/users" element={<UserPage/>} />
          <Route path="/categoriesp" element={<CategoryPage/>} />
          <Route path="/subcategories" element={<SubcategoryPage/>} />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/AddUser" element={<AddUser/>} />
          <Route path="/AddCategory" element={<AddCategory/>} />
          <Route path="/AddSubcategory" element={<AddSubcategory/>} />
          <Route path="/AddProduct" element={<AddProduct/>} />
          <Route path="/EditUser" element={<EditUser/>} />
          <Route path="/EditCategory" element={<EditCategory/>} />
          <Route path="/EditSubcategory" element={<EditSubcategory/>} />
          <Route path="/EditProduct" element={<EditProduct/>} />
        </Routes>
      </main>
      <Footer /> {/* El footer fuera del header y al final del main */}
    </div>
  );
}

export default App;
