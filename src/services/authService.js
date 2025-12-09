import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const authService = {
  /**
   
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise} 
   */
  async login(email, senha) {
    try {
      
      const response = await api.post('/usuario/login', {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      // Armazena token e dados do usuário
      await AsyncStorage.setItem('@meumural:token', token);
      await AsyncStorage.setItem('@meumural:user', JSON.stringify(usuario));

      return { token, usuario };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Registra um novo usuário
   * @param {Object} dados - Dados do usuário (nome, email, senha)
   * @returns {Promise} Dados do usuário criado
   */
  async registrar(dados) {
    try {
      const response = await api.post('/api/usuario/criar', dados);

      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  
  async logout() {
    try {
      await AsyncStorage.removeItem('@meumural:token');
      await AsyncStorage.removeItem('@meumural:user');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  /**
   * Recupera o usuário logado do storage
   * @returns {Promise} Dados do usuário ou null
   */
  async getUsuarioLogado() {
    try {
      const userJson = await AsyncStorage.getItem('@meumural:user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },

  /**
   * Verifica se há um token válido
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('@meumural:token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
