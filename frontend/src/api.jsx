import axios from 'axios';

const BASE_URL = 'https://shopeaseecommerce.store/api';


const api = axios.create({
  baseURL: 'https://shopeaseecommerce.store/api', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM' }),
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchProducts = async() => api.get(`${BASE_URL}/products`);
export const placeOrder = async(orderData) => api.post(`${BASE_URL}/orders`, orderData);
export const fetchUserOrders = async(userId) => api.get(`${BASE_URL}/orders/${userId}`);


export default api;