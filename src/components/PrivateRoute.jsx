import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
   const { token } = useAuth();
   const [showRedirect, setShowRedirect] = useState(false);

   useEffect(() => {
      if (!token) {
         toast.warn("You must log in to perform this action.");
         setTimeout(() => {
            setShowRedirect(true); // Activa la redirección después de un retraso
         }, 2000); // Retraso de 2 segundos
      }
   }, [token]);

   return (
      <>
         <ToastContainer position="top-right" />
         {token ? children : showRedirect && <Navigate to="/login" />}
      </>
   );
};

export default PrivateRoute;
