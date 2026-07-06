export const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Clean up trailing slashes
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Ensure the URL ends with /api (because the backend routers expect it)
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  
  return url;
};
