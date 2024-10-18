// src/services/axiosConfig.js

import axios from 'axios';
import { baseUrl } from '../config.js';

const axiosInstance = axios.create({
  baseURL: baseUrl,  // Configura la URL base aquí
  headers: {
    'Content-Type': 'multipart/form-data',
    'ngrok-skip-browser-warning': 'true',  // Agrega el encabezado requerido aquí
  },
});

export default axiosInstance;