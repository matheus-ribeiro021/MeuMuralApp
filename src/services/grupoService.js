import api from './api';

/**
 * Serviço de gerenciamento de grupos
 * Implementa CRUD completo de grupos
 */

const grupoService = {
  /**
   * Lista todos os grupos
   * @returns {Promise<Array>} Lista de grupos
   */
  async listarGrupos() {
    try {
      const response = await api.get('/grupo/listar');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar grupos:', error);
      throw error;
    }
  },

  /**
   * Busca um grupo por ID
   * @param {number} id - ID do grupo
   * @returns {Promise<Object>} Dados do grupo
   */
  async buscarPorId(id) {
    try {
      const response = await api.get(`/grupo/listarPorId/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar grupo:', error);
      throw error;
    }
  },

  /**
   * Cria um novo grupo
   * @param {Object} dados - Dados do grupo (nome, descricao)
   * @returns {Promise<Object>} Grupo criado
   */
  async criarGrupo(dados) {
    try {
      const response = await api.post('/grupo/criar', {
        nome: dados.nome,
        descricao: dados.descricao || '',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  },

  /**
   * Atualiza um grupo existente
   * @param {number} id - ID do grupo
   * @param {Object} dados - Novos dados do grupo
   * @returns {Promise<Object>} Grupo atualizado
   */
  async atualizarGrupo(id, dados) {
    try {
      const response = await api.put(`/grupo/atualizar/${id}`, {
        nome: dados.nome,
        descricao: dados.descricao || '',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      throw error;
    }
  },

  /**
   * Deleta um grupo
   * @param {number} id - ID do grupo
   * @returns {Promise<void>}
   */
  async deletarGrupo(id) {
    try {
      await api.delete(`/grupo/apagar/${id}`);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      throw error;
    }
  },
};

export default grupoService;
