import api from './api';

/**
 * Serviço de gerenciamento de postagens (tarefas)
 * Implementa CRUD completo de postagens
 */

const postagemService = {
  /**
   * Lista todas as postagens
   * @returns {Promise<Array>} Lista de postagens
   */
  async listarPostagens() {
    try {
      const response = await api.get('/postagem/listar');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar postagens:', error);
      throw error;
    }
  },

  /**
   * Busca uma postagem por ID
   * @param {number} id - ID da postagem
   * @returns {Promise<Object>} Dados da postagem
   */
  async buscarPorId(id) {
    try {
      const response = await api.get(`/postagem/listarPorId/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar postagem:', error);
      throw error;
    }
  },

  /**
   * Lista postagens de um usuário específico
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} Lista de postagens do usuário
   */
  async listarPorUsuario(usuarioId) {
    try {
      const response = await api.get(`/postagem/listarPorUsuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar postagens do usuário:', error);
      throw error;
    }
  },

  /**
   * Lista postagens de um grupo específico
   * @param {number} grupoId - ID do grupo
   * @returns {Promise<Array>} Lista de postagens do grupo
   */
  async listarPorGrupo(grupoId) {
    try {
      const response = await api.get(`/postagem/listarPorGrupo/${grupoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar postagens do grupo:', error);
      throw error;
    }
  },

  /**
   * Cria uma nova postagem
   * @param {Object} dados - Dados da postagem (usuarioId, grupoId, titulo, conteudo)
   * @returns {Promise<Object>} Postagem criada
   */
  async criarPostagem(dados) {
    try {
      const response = await api.post('/postagem/criar', {
        usuarioId: dados.usuarioId,
        grupoId: dados.grupoId,
        titulo: dados.titulo,
        conteudo: dados.conteudo || '',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma postagem existente
   * @param {number} id - ID da postagem
   * @param {Object} dados - Novos dados da postagem
   * @returns {Promise<Object>} Postagem atualizada
   */
  async atualizarPostagem(id, dados) {
    try {
      const response = await api.put(`/postagem/atualizar/${id}`, {
        usuarioId: dados.usuarioId,
        grupoId: dados.grupoId,
        titulo: dados.titulo,
        conteudo: dados.conteudo || '',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar postagem:', error);
      throw error;
    }
  },

  /**
   * Deleta uma postagem
   * @param {number} id - ID da postagem
   * @returns {Promise<void>}
   */
  async deletarPostagem(id) {
    try {
      await api.delete(`/postagem/apagar/${id}`);
    } catch (error) {
      console.error('Erro ao deletar postagem:', error);
      throw error;
    }
  },
};

export default postagemService;
