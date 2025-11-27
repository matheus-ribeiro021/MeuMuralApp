# Changelog - Integração Frontend com Backend

## [1.1.0] - 2025-11-27

### Adicionado

#### Serviços de API
- **src/services/api.js**: Configuração do axios com interceptors para JWT
- **src/services/authService.js**: Serviço de autenticação (login, registro, logout)
- **src/services/grupoService.js**: Serviço CRUD de grupos
- **src/services/postagemService.js**: Serviço CRUD de postagens

#### Gerenciamento de Estado
- **src/context/AuthContext.jsx**: Context API para gerenciamento de autenticação global

#### Documentação
- **CONFIGURACAO.md**: Guia completo de configuração e uso
- **.env.example**: Exemplo de configuração de variáveis de ambiente
- **CHANGELOG.md**: Este arquivo

### Modificado

#### Telas
- **src/screens/LoginScreen.jsx**:
  - Integração com API de autenticação
  - Validação de login e registro no backend
  - Estados de loading e tratamento de erros
  - Armazenamento de token JWT

- **src/screens/GruposScreen.jsx**:
  - Integração com API de grupos
  - Carregamento dinâmico de grupos do backend
  - CRUD completo de grupos
  - Pull-to-refresh
  - Exibição de quantidade de postagens por grupo
  - Botão de logout

- **src/screens/TarefasGruposScreen.jsx**:
  - Integração com API de postagens
  - Carregamento dinâmico de postagens do backend
  - CRUD completo de postagens
  - Pull-to-refresh
  - Exibição de data de criação

#### Configuração
- **app/index.jsx**: Adicionado AuthProvider para gerenciamento de autenticação
- **package.json**: Adicionadas dependências axios e async-storage

### Dependências Adicionadas
- `axios@^1.7.9`: Cliente HTTP para comunicação com API
- `@react-native-async-storage/async-storage@^2.1.0`: Armazenamento local

### Funcionalidades Implementadas

#### Autenticação
- ✅ Login com validação no backend
- ✅ Registro de novos usuários
- ✅ Armazenamento seguro de token JWT
- ✅ Logout com limpeza de dados
- ✅ Interceptor automático para token nas requisições

#### Grupos
- ✅ Listar grupos do backend
- ✅ Criar grupo com nome e descrição
- ✅ Deletar grupo
- ✅ Visualizar quantidade de postagens

#### Postagens/Tarefas
- ✅ Listar postagens de um grupo
- ✅ Criar postagem com título e conteúdo
- ✅ Deletar postagem
- ✅ Exibir data de criação

#### UX/UI
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Confirmações antes de ações destrutivas
- ✅ Pull-to-refresh
- ✅ Estados vazios informativos

### Removido
- ❌ Dados mockados (hardcoded) das telas
- ❌ Lógica local de gerenciamento de tarefas pendentes/concluídas

### Notas Importantes

⚠️ **Endpoint de Login**: O endpoint `/api/usuario/login` está comentado no backend e precisa ser implementado.

⚠️ **CORS**: É necessário configurar CORS no backend para permitir requisições do frontend.

⚠️ **URL da API**: A URL base da API precisa ser configurada em `src/services/api.js` conforme o ambiente.

### Próximos Passos Recomendados
1. Implementar endpoint de login no backend
2. Configurar CORS no backend
3. Adicionar validação de formulários
4. Implementar edição de grupos e postagens
5. Adicionar paginação
6. Implementar busca e filtros

---

## Como Usar

### Configuração Inicial
1. Instale as dependências: `npm install`
2. Configure a URL da API em `src/services/api.js`
3. Execute o backend: `cd MeuMural && ./mvnw spring-boot:run`
4. Execute o frontend: `npm start`

### Testando
1. Registre um novo usuário
2. Faça login
3. Crie um grupo
4. Adicione tarefas ao grupo

Para mais detalhes, consulte **CONFIGURACAO.md**.
