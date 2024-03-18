/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: 'http://localhost:8080/api',
      }, 
};

export default nextConfig;
