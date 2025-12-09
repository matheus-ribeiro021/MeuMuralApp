import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configure a URL base da API
// Backend hospedado no Senac
// const API_BASE_URL = 'http://academico3.rj.senac.br/meumural/api';
const API_BASE_URL = 'http://172.31.160.1:8416';

// Cria instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@meumural:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar storage
      await AsyncStorage.removeItem('@meumural:token');
      await AsyncStorage.removeItem('@meumural:user');
    }
    return Promise.reject(error);
  }
);

export default api;
