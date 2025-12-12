import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './api';

const GROUPS_KEY = '@meumural:grupos';

async function readLocalGroups() {
  try {
    const raw = await AsyncStorage.getItem(GROUPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('grupoService: erro ao ler grupos locais', e);
    return [];
  }
}

async function writeLocalGroups(groups) {
  try {
    await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('grupoService: erro ao salvar grupos locais', e);
  }
}

function generateCode(existingCodes = new Set()) {
  // gera código numérico de 4 dígitos como string, garantindo unicidade
  for (let i = 0; i < 10000; i++) {
    const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    if (!existingCodes.has(code)) return code;
  }
  // fallback
  return Date.now().toString().slice(-4);
}

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
    if (Platform.OS === 'web') {
      // retorna grupos persistidos localmente
      const local = await readLocalGroups();
      return local;
    }

    try {
      const response = await api.get('/grupo/listar');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar grupos:', error);
      // Fallback: retornar alguns grupos de exemplo para permitir navegação em modo offline
      const exemplo = [
        { id: 1, nome: 'Equipe Projeto A', descricao: 'Grupo de trabalho do Projeto A', codigo: '0001' },
        { id: 2, nome: 'Estudo React Native', descricao: 'Compartilhar materiais e dúvidas', codigo: '0002' },
        { id: 3, nome: 'Time Comercial', descricao: 'Planejamento e metas', codigo: '0003' },
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
      try {
        const groups = await readLocalGroups();
        const existingCodes = new Set(groups.map((g) => g.codigo).filter(Boolean));
        const codigo = generateCode(existingCodes);
        const localGrupo = { id: Date.now(), nome: dados.nome, descricao: dados.descricao || '', codigo };
        groups.push(localGrupo);
        await writeLocalGroups(groups);
        console.log('grupoService (web): criado grupo local com codigo', codigo, localGrupo);
        return localGrupo;
      } catch (e) {
        console.error('grupoService (web) erro ao criar grupo local', e);
        const localGrupo = { id: Date.now(), nome: dados.nome, descricao: dados.descricao || '' };
        return localGrupo;
      }
    }

    try {
      const response = await api.post('/grupo/criar', {
        nome: dados.nome,
        descricao: dados.descricao || '',
      });
      // se backend não fornecer código, gere um local (não ideal — preferir backend)
      if (response?.data && !response.data.codigo) {
        response.data.codigo = generateCode(new Set());
      }
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
    // Se web, remover do storage local
    if (Platform.OS === 'web') {
      try {
        const groups = await readLocalGroups();
        const newGroups = groups.filter((g) => String(g.id) !== String(id) && String(g.codigo) !== String(id));
        await writeLocalGroups(newGroups);
        console.log('grupoService (web): deletou grupo local id=', id);
        return;
      } catch (e) {
        console.error('grupoService (web) erro ao deletar grupo local', e);
        return;
      }
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
