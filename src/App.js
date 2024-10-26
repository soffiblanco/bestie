import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'; // Importa Navigate para la redirección
import { OrderProvider } from '../src/pages/Orders/OrderContexts'; // Importa el contexto correctamente
import Navbar from './layouts/header/NavBar';
import LoginForm from './components/loginComponent/LoginForm';
import Footer from './layouts/footer/footer';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import Profile from './pages/Admin/Profile';
import Verified from './pages/Admin/Verified';
import ResetPassword from './components/loginComponent/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
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
import Order from './pages/Orders/Order';
import PaymentPage from './pages/Orders/PaymentPage';
import PaymentSuccess from './pages/Orders/PaymentSuccess';
import ProductDetails from './pages/Products/ProductDetails';
import CatalogProducts from './pages/Products/CatalogProducts';
import AboutUS from './pages/aboutUs/AboutUs'; 
import OrderPage from './pages/OrderStatus/OrderPage';
import ProductCarousel from './pages/Home/ProductCarousel';
import CatalogProductsSub from './pages/Products/CatalogProductsSub';
import { AuthProvider } from './Auth/AuthContext';


function App() {
  return (
    <OrderProvider>
      <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Navbar /> {/* El Navbar siempre estará visible */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} /> {/* Redirecciona a /home */}
            <Route path="/home" element={<Home />} /> {/* Página de inicio */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/categories" element={<Categories />} />  {/*Página de categorías */}
            <Route path="/CatalogProducts/:category" element={<CatalogProducts />} />  {/*Catálogo de categorías */}
            <Route path="/CatalogProducts/:category/:subcategory" element={<CatalogProductsSub />} /> {/*Catálogo de subcategorías */}
            <Route path="/product/:id" element={<ProductDetails />} /> {/*Página individual del producto */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/categoriesp" element={<CategoryPage />} />
            <Route path="/subcategories" element={<SubcategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/AddUser" element={<AddUser />} />
            <Route path="/AddCategory" element={<AddCategory />} />
            <Route path="/AddSubcategory" element={<AddSubcategory />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/EditUser" element={<EditUser />} />
            <Route path="/EditCategory" element={<EditCategory />} />
            <Route path="/EditSubcategory" element={<EditSubcategory />} />
            <Route path="/EditProduct" element={<EditProduct />} />
            <Route path="/order" element={<Order />} /> {/* Carrito*/}
            <Route path="/orders" element={<OrderPage />} /> {/* Ordenes*/}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/about-us" element={<AboutUS />} />
            <Route path="/Verified" element={<Verified/>} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer /> {/* Footer siempre estará visible en todas las páginas */}
      </div>
      </AuthProvider>
    </OrderProvider>
  );
}

export default App;




