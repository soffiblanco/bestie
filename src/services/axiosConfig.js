// src/services/axiosConfig.js

import axios from 'axios';
import { baseUrl } from '../config.js';

const axiosInstance = axios.create({
  baseURL: baseUrl,  // Configura la URL base aquí
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',  // Agrega el encabezado requerido aquí
  },
});

export default axiosInstance;