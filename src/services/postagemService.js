import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './api';

const STORAGE_PREFIX = '@meumural:postagens:grupo:';

async function readPostsForGroup(grupoId) {
  const key = `${STORAGE_PREFIX}${grupoId}`;
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

async function writePostsForGroup(grupoId, posts) {
  const key = `${STORAGE_PREFIX}${grupoId}`;
  await AsyncStorage.setItem(key, JSON.stringify(posts));
}

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
    // Retorna todas postagens locais (web) ou faz chamada ao endpoint geral
    if (Platform.OS === 'web') {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const postKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
        let all = [];
        for (const k of postKeys) {
          const raw = await AsyncStorage.getItem(k);
          if (!raw) continue;
          const posts = JSON.parse(raw);
          all = all.concat(posts);
        }
        return all;
      } catch (e) {
        console.error('postagemService (web) erro ao listar postagens locais:', e);
        return [];
      }
    }

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
    if (Platform.OS === 'web') {
      try {
        const posts = await readPostsForGroup(grupoId);
        return posts;
      } catch (e) {
        console.error('postagemService (web) erro ao ler postagens locais por grupo:', e);
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
   * Cria uma nova postagem
   * @param {Object} dados - Dados da postagem (usuarioId, grupoId, titulo, conteudo)
   * @returns {Promise<Object>} Postagem criada
   */
  async criarPostagem(dados) {
    // Se estivermos rodando no navegador, criar localmente e persistir
    if (Platform.OS === 'web') {
      const localPost = {
        id: Date.now(),
        usuarioId: dados.usuarioId,
        grupoId: dados.grupoId,
        titulo: dados.titulo,
        conteudo: dados.conteudo || '',
        dataCriacao: new Date().toISOString(),
      };
      try {
        const posts = await readPostsForGroup(dados.grupoId);
        posts.push(localPost);
        await writePostsForGroup(dados.grupoId, posts);
        console.log('postagemService (web): criando postagem local e salvando em storage:', localPost);
      } catch (e) {
        console.error('postagemService (web) erro ao salvar postagem local:', e);
      }
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
    // Se web, remover a postagem do storage local
    if (Platform.OS === 'web') {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const postKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
        for (const key of postKeys) {
          const raw = await AsyncStorage.getItem(key);
          if (!raw) continue;
          const posts = JSON.parse(raw);
          const idx = posts.findIndex((p) => String(p.id) === String(id));
          if (idx !== -1) {
            posts.splice(idx, 1);
            await AsyncStorage.setItem(key, JSON.stringify(posts));
            console.log('postagemService (web): removida postagem local id=', id, 'da chave', key);
            return;
          }
        }
        console.log('postagemService (web): postagem id não encontrada no storage:', id);
      } catch (e) {
        console.error('postagemService (web) erro ao remover postagem local:', e);
      }
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
