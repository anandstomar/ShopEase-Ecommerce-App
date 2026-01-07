import axios from 'axios';

const BASE_URL = 'https://shopease-ecommerce-app-jv4u.onrender.com/api'; //'http://localhost:3007/api'


const api = axios.create({
  baseURL: BASE_URL, 
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchProducts = async() => api.get(`${BASE_URL}/products`);
export const placeOrder = async(orderData) => api.post(`${BASE_URL}/orders`, orderData);
export const fetchUserOrders = async(userId) => api.get(`${BASE_URL}/orders/${userId}`);
export const deviceTokenRegistration = async(token) => api.post(`${BASE_URL}/notifications/register`, { token });


export default api;