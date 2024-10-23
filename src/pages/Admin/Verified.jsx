import React, { useEffect } from 'react';
import LoginForm from '../../components/loginComponent/LoginForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verified = () => {
    useEffect(() => {
        toast.success('Your account has been verified successfully!');
    }, []);

    return (
        <>
            <ToastContainer position="top-right" />
            <LoginForm />
        </>
    );
};

export default Verified;