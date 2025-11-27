import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Serviço de autenticação
 * Gerencia login, registro e logout de usuários
 */

const authService = {
  /**
   * Realiza o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise} Dados do usuário e token
   */
  async login(email, senha) {
    try {
      // NOTA: O endpoint de login está comentado no backend
      // Quando for implementado, usar: POST /api/usuario/login
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
      const response = await api.post('/usuario/criar', {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        status: 1, // Ativo por padrão
        role: 'USER', // Role padrão
      });

      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário
   * Remove token e dados do storage
   */
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
