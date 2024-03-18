import axios from 'axios';
import { decryptToken, encryptToken } from './crypto';

// Create an Axios instance
const baseUrl = process.env.BASE_URL; // Use a secure key stored in env vars

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api", // Replace with your actual API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to call to refresh tokens
const refreshAuthToken = async (refreshToken: string) => {
    try {
        const response = await apiClient.post('/refresh-token', { refresh_token: refreshToken });
        return response.data;
    } catch (error) {
        console.error('Error refreshing auth token:', error);
        throw error; // Re-throw to catch this elsewhere
    }
};
 

function parseJwt(token: string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

// Interceptor for request
apiClient.interceptors.request.use(
    async (config) => {
        console.log(config.baseURL);
        console.log(config.data);
        let token = localStorage.getItem('token');
        if (token) {

            token = decryptToken(token);
            const { exp } = parseJwt(token); // Decode token to get expiry time
            const currentTime = Date.now() / 1000; // Convert to seconds

            if (exp < currentTime) {
                // Token is expired, refresh it
                var refToken = localStorage.getItem('refresh_token');
                refToken = decryptToken(refToken!);
                const {token, expiry, refreshToken} = await refreshAuthToken(refToken!);
                 
                var encToken = encryptToken(token);
                var encRef = encryptToken(token);

                localStorage.setItem('token', encToken); // Update stored token
                localStorage.setItem('refresh_token', encRef); // Update stored token 
            }

            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;