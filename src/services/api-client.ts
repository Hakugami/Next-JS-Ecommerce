import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base configuration for axios
const apiClient: AxiosInstance = axios.create({
  // Use relative URLs for local API routes
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add global error handling here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Generic GET method
export const get = async <T>(url: string, params?: object): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, { params });
  return response.data;
};

// Generic POST method
export const post = async <T>(url: string, data: unknown): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data);
  return response.data;
};

// Generic PUT method
export const put = async <T>(url: string, data: unknown): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data);
  return response.data;
};

// Generic DELETE method
export const del = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url);
  return response.data;
};

export default apiClient; 