import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8000', // for iOS
  // baseURL: 'http://10.0.2.2:8000', // for Emulator
  // baseURL: 'http://10.0.3.2:8000', // for Genymotion
  baseURL: 'http://192.168.0.108:3333', // for USB Android, put local IP
});

export default api;
