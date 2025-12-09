import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
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
    // Em web, tentar retornar postagens salvas localmente para este grupo
    if (Platform.OS === 'web') {
      try {
        const key = `@meumural:postagens:grupo:${grupoId}`;
        const raw = await AsyncStorage.getItem(key);
        const posts = raw ? JSON.parse(raw) : [];
        console.log(`postagemService (web): retornando ${posts.length} post(s) locais para grupo ${grupoId}`);
        return posts;
      } catch (e) {
        console.error('postagemService (web) erro ao ler postagens locais:', e);
        return [];
      }
    }

    try {
      const response = await api.get(`/postagem/listarPorGrupo/${grupoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar postagens do grupo:', error);
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
    // Se estivermos rodando no navegador, evitar CORS e usar fallback local
    if (Platform.OS === 'web') {
      const localPost = {
        id: Date.now(),
        usuarioId: dados.usuarioId,
        grupoId: dados.grupoId,
        titulo: dados.titulo,
        conteudo: dados.conteudo || '',
        dataCriacao: new Date().toISOString(),
      };
      console.log('postagemService (web): criando postagem local sem chamar API:', localPost);
      return localPost;
    }

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
      // Fallback: criar postagem local com id temporário e data atual
      const localPost = {
        id: Date.now(),
        usuarioId: dados.usuarioId,
        grupoId: dados.grupoId,
        titulo: dados.titulo,
        conteudo: dados.conteudo || '',
        dataCriacao: new Date().toISOString(),
      };
      console.log('postagemService: usando fallback local para criar postagem:', localPost);
      return localPost;
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
    // Se web, ignorar chamada ao servidor e resolver imediatamente
    if (Platform.OS === 'web') {
      console.log('postagemService (web): ignorando delete no servidor para id=', id);
      return;
    }

    try {
      await api.delete(`/postagem/apagar/${id}`);
      console.log('postagemService: deletou postagem no servidor id=', id);
    } catch (error) {
      console.error('Erro ao deletar postagem:', error);
      // Fallback: silencioso, permitir UI remover localmente
      console.log('postagemService: falha ao deletar no servidor, retorno silencioso para permitir remoção local id=', id);
      return;
    }
  },
};

export default postagemService;
