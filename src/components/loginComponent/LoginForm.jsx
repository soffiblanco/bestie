
/* PRIMER CODIGO PRUEBA
import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import {FaUser, FaLock} from "react-icons/fa";

const LoginForm = () => {

const [isLoginActive, setIsLoginActive] = useState(true);

    return(
        <><div className={`wrapper${isLoginActive ? 'login-active' : 'register-active'}`}>
           {isLoginActive ? ( 
            <div className="form-box login">
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='username' required />
                    <FaUser className='icon ' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='password' required />
                    <FaLock className='icon' />
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>
                <button type="submit">login</button>
                <div className="register-link">
                    <p>Don't have an account? <a href="#" onClick={() => setIsLoginActive(false)}>Register</a></p>
                </div>
            </form>
            </div>
        ):(
        
        <div className='form-box register'>
                <form action="">
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='name' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='email' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type= "text" placeholder='password' required/>
                        <FaUser className='icon '/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='image' required />
                        <FaLock className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='direction' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='telephone number' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='card number' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='emexpiration date' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='cvv' required />
                        <FaUser className='icon ' />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the terms & conditions</label>
                    </div>
                    <div className="register-link">
                    <p>Already hae an account? <a href="#" onClick={() => setIsLoginActive(true)}>Login</a></p>
                </div>
                    <button type="submit">register</button>

                </form>
            </div>
            )}
            </div>
            </>
    );
};

export default LoginForm; */

/* SEGUNDO CODIGO PRUEBA
import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        direction: '',
        telephoneNumber: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggle = () => {
        setIsLoginActive(!isLoginActive);
        console.log("Is login active:", !isLoginActive);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginActive) {
            // Lógica de inicio de sesión
            try {
                const response = await axios.post('/api/login', {
                    email: formData.email,
                    password: formData.password,
                });
                console.log(response.data);
            } catch (error) {
                console.error('Login failed:', error);
            }
        } else {
            // Lógica de registro
            try {
                const response = await axios.post('/api/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    direction: formData.direction,
                    telephoneNumber: formData.telephoneNumber,
                    cardNumber: formData.cardNumber,
                    expirationDate: formData.expirationDate,
                    cvv: formData.cvv,
                });
                console.log(response.data);
            } catch (error) {
                console.error('Registration failed:', error);
            }
        }
    };

    return (
        <div className={`wrapper${isLoginActive ? ' login-active' : ' register-active'}`}>
            <div className={`form-box ${isLoginActive ? 'login' : 'register'}`}>
                <form onSubmit={handleSubmit}>
                    <h1>{isLoginActive ? 'Login' : 'Registration'}</h1>
                    {!isLoginActive && (
                        <div className="input-box">
                            <input
                                type="text"
                                name="name"
                                placeholder='Name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                    )}
                    <div className="input-box">
                        <input
                            type="text"
                            name="email"
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className='icon' />
                    </div>
                    {!isLoginActive && (
                        <>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="direction"
                                    placeholder='Direction'
                                    value={formData.direction}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="telephoneNumber"
                                    placeholder='Telephone Number'
                                    value={formData.telephoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder='Card Number'
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="expirationDate"
                                    placeholder='Expiration Date'
                                    value={formData.expirationDate}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder='CVV'
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                        </>
                    )}
                    <div className="remember-forgot">
                        <label><input type="checkbox" /> Remember me</label>
                        {!isLoginActive && <a href="#">Forgot password?</a>}
                    </div>
                    <button type="submit">{isLoginActive ? 'Login' : 'Register'}</button>
                    <div className="register-link">
                        <p>{isLoginActive ? "Don't have an account?" : "Already have an account?"} 
                            <a href="#" onClick={handleToggle}>
                                {isLoginActive ? 'Register' : 'Login'}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; */
import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { FaUser, FaLock,FaEnvelope,FaPhone,FaMapMarkerAlt,FaCcVisa,FaImage } from "react-icons/fa";


const LoginForm = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        direction: '',
        telephone_number: '',
        card_number: '',
        expiration_date: '',
        cvv: '',
    });



    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = 'http://localhost/apis/users.php';
        const data = isLoginActive
            ? { action: 'login', email: formData.email, password: formData.password }
            : { 
                action: 'register',
                name: formData.name, 
                email: formData.email, 
                password: formData.password, 
                direction: formData.direction, 
                telephone_number: formData.telephone_number, 
                user_image: formData.user_image,
                role: formData.role,
                card_number: formData.card_number, 
                expiration_date: formData.expiration_date, 
                cvv: formData.cvv,
            };

        console.log('Datos enviados:', data);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        setLoading(true); // Inicia el estado de carga
        try {
            const response = await axios.post(endpoint, data, config);
        
            if (response.status === 200) {
                console.log('Respuesta del servidor:', response.data);
                if (response.data.success) {
                    window.alert(response.data.message); // Muestra mensaje de éxito

                } else {
                    window.alert(response.data.message); // Muestra el mensaje de error del servidor
                }
            } else {
                window.alert('Algo salió mal en el servidor.'); // Muestra mensaje de error genérico
            }
        } catch (error) {
            console.error('Error en la solicitud:', error.response ? error.response.data : error);
            window.alert(error.response?.data?.message || 'Error en la solicitud.'); // Muestra el mensaje de error
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    const showMessage = (text, type = 'success') => (
        <div className={`message ${type}`}>
            <p>{text}</p>
        </div>
    );

    return (
        <div className={`wrapper ${isLoginActive ? 'login-active' : 'register-active'}`}>
        
            <form onSubmit={handleSubmit}>
                <h1>{isLoginActive ? 'Login' : 'Registration'}</h1>

                {isLoginActive ? (
                    <>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <FaLock className='icon' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-box">
                            <input
                                type="text"
                                name="name"
                                placeholder='Name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <FaLock className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="direction"
                                placeholder='Direction'
                                value={formData.direction}
                                onChange={handleChange}
                            />
                            <FaMapMarkerAlt className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="tel"
                                name="telephone_number"
                                placeholder='Telephone Number'
                                value={formData.telephone_number}
                                onChange={handleChange}
                            />
                            <FaPhone  className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="file"
                                name="user_image"
                                placeholder='User_Image'
                                value={formData.user_image}
                                onChange={handleChange}
                            />
                            <FaImage className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="role"
                                placeholder='Role'
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="card_number"
                                placeholder='Card Number'
                                value={formData.card_number}
                                onChange={handleChange}
                            />
                            <FaCcVisa className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="expiration_date"
                                placeholder='Expiration Date (YY-MM-DD)'
                                value={formData.expiration_date}
                                onChange={handleChange}
                            />
                            <FaCcVisa className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="cvv"
                                placeholder='CVV'
                                value={formData.cvv}
                                onChange={handleChange}
                            />
                            <FaCcVisa className='icon' />
                        </div>
                    </>
                )}

                <div className="remember-forgot">
                    {isLoginActive ? (
                        <>
                            <a href="#">Forgot password?</a>
                        </>
                    ) : (
                        <label></label>
                    )}
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : (isLoginActive ? 'Login' : 'Register')}
                </button>
                
                <div className="register-link">
                    <p>
                        {isLoginActive ? "Don't have an account?" : "Already have an account?"}
                        <a href="#" onClick={() => setIsLoginActive(!isLoginActive)}>
                            {isLoginActive ? 'Register' : 'Login'}
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;