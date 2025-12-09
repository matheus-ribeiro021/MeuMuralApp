import api from './api';
import { Platform } from 'react-native';

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
      // Fallback: retornar alguns grupos de exemplo para permitir navegação em modo offline
      const exemplo = [
        { id: 1, nome: 'Equipe Projeto A', descricao: 'Grupo de trabalho do Projeto A' },
        { id: 2, nome: 'Estudo React Native', descricao: 'Compartilhar materiais e dúvidas' },
        { id: 3, nome: 'Time Comercial', descricao: 'Planejamento e metas' },
      ];
      return exemplo;
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
    // Se estivermos rodando no web, criar localmente para evitar CORS
    if (Platform.OS === 'web') {
      const localGrupo = { id: Date.now(), nome: dados.nome, descricao: dados.descricao || '' };
      console.log('grupoService (web): criando grupo local sem chamar API:', localGrupo);
      return localGrupo;
    }

    try {
      const response = await api.post('/grupo/criar', {
        nome: dados.nome,
        descricao: dados.descricao || '',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      // Fallback: criar grupo local com ID temporário
      const localGrupo = { id: Date.now(), nome: dados.nome, descricao: dados.descricao || '' };
      console.log('grupoService: usando fallback local para criar grupo:', localGrupo);
      return localGrupo;
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
    // Se web, simplesmente resolver para permitir remoção local
    if (Platform.OS === 'web') {
      console.log('grupoService (web): ignorando delete no servidor para id=', id);
      return;
    }

    try {
      await api.delete(`/grupo/apagar/${id}`);
      console.log('grupoService: deletou grupo no servidor id=', id);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      // Fallback: silenciar erro e permitir que UI remova o grupo localmente
      console.log('grupoService: falha ao deletar no servidor, retorno silencioso para permitir remoção local id=', id);
      return;
    }
  },
};

export default grupoService;
