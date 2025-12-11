import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega usuário do storage ao iniciar
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await authService.getUsuarioLogado();
      const token = await AsyncStorage.getItem('@meumural:token');
      // Se token for um placeholder local-token usado em modo offline, não auto-logar
      if (storedUser && token && token !== 'local-token') {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, senha) {
    try {
      const { usuario } = await authService.login(email, senha);
      setUser(usuario);
      return { success: true };
    } catch (error) {
      // Se o backend falhar (ou sem conexão), permitir login local/offline com qualquer credencial
      console.warn('Autenticação externa falhou, entrando em modo offline:', error?.message || error);
  const localUser = { id: Date.now(), nome: email.split('@')[0] || email, email };
      try {
        await AsyncStorage.setItem('@meumural:token', 'local-token');
        await AsyncStorage.setItem('@meumural:user', JSON.stringify(localUser));
      } catch (e) {
        console.error('Erro ao persistir usuário local:', e);
      }
      setUser(localUser);
      return { success: true, offline: true };
    }
  }

  async function signUp(nome, email, senha) {
    try {
      const usuario = await authService.registrar({ nome, email, senha });
      return { success: true, usuario };
    } catch (error) {
      // Se o registro falhar, criar conta local temporária para permitir entrar
      console.warn('Registro externo falhou, criando usuário local:', error?.message || error);
  const localUser = { id: Date.now(), nome: nome || email.split('@')[0] || email, email };
      try {
        await AsyncStorage.setItem('@meumural:token', 'local-token');
        await AsyncStorage.setItem('@meumural:user', JSON.stringify(localUser));
      } catch (e) {
        console.error('Erro ao persistir usuário local:', e);
      }
      // Não setamos user automaticamente aqui para forçar o usuário a logar manualmente,
      // mas retornamos sucesso para indicar que a conta foi criada localmente.
      return { success: true, usuario: localUser, offline: true };
    }
  }

  async function signOut() {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

