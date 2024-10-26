import axios from 'axios';

const pexelApiClient = axios.create({
  baseURL: 'https://your-api-url.com', // замените на URL вашего API
});

pexelApiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `1tyDrpkFkHyTcfha1mUPgcVtstzkGKd9VPTQoQZwD7pbQE0AUZi8Qi56`;
  return config;
});

export default pexelApiClient;