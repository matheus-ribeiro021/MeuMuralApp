# Configuração do Frontend MeuMuralApp

## Ajustes Realizados

Este documento descreve os ajustes realizados no frontend para integração com o backend MeuMural.

### 1. Dependências Instaladas

```bash
npm install axios @react-native-async-storage/async-storage
```

- **axios**: Cliente HTTP para comunicação com a API
- **@react-native-async-storage/async-storage**: Armazenamento local para token JWT e dados do usuário

### 2. Estrutura de Arquivos Criados

```
src/
├── services/
│   ├── api.js                    # Configuração do axios e interceptors
│   ├── authService.js            # Serviço de autenticação (login, registro, logout)
│   ├── grupoService.js           # Serviço de gerenciamento de grupos
│   └── postagemService.js        # Serviço de gerenciamento de postagens
├── context/
│   └── AuthContext.jsx           # Context API para gerenciamento de autenticação
└── screens/
    ├── LoginScreen.jsx           # ✅ Atualizado com integração da API
    ├── GruposScreen.jsx          # ✅ Atualizado com integração da API
    └── TarefasGruposScreen.jsx   # ✅ Atualizado com integração da API
```

### 3. Funcionalidades Implementadas

#### Autenticação
- ✅ Login com validação no backend
- ✅ Registro de novos usuários
- ✅ Armazenamento seguro de token JWT
- ✅ Logout com limpeza de dados
- ✅ Interceptor automático para adicionar token nas requisições

#### Grupos
- ✅ Listar todos os grupos
- ✅ Criar novo grupo com nome e descrição
- ✅ Deletar grupo (sair do grupo)
- ✅ Visualizar quantidade de postagens por grupo
- ✅ Pull-to-refresh para atualizar dados

#### Postagens/Tarefas
- ✅ Listar postagens de um grupo específico
- ✅ Criar nova postagem com título e conteúdo
- ✅ Deletar postagem
- ✅ Exibir data de criação
- ✅ Pull-to-refresh para atualizar dados

#### UX/UI
- ✅ Loading states durante requisições
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Confirmações antes de ações destrutivas
- ✅ Indicadores de atividade (ActivityIndicator)
- ✅ Estados vazios informativos

---

## Configuração da URL da API

### Passo 1: Editar o arquivo `src/services/api.js`

Abra o arquivo `src/services/api.js` e localize a linha:

```javascript
const API_BASE_URL = 'http://localhost:8416/api';
```

### Passo 2: Alterar conforme seu ambiente

#### Para Android Emulator:
```javascript
const API_BASE_URL = 'http://10.0.2.2:8416/api';
```

#### Para iOS Simulator:
```javascript
const API_BASE_URL = 'http://localhost:8416/api';
```

#### Para Dispositivo Físico (mesma rede Wi-Fi):
```javascript
const API_BASE_URL = 'http://SEU_IP_LOCAL:8416/api';
```

Para descobrir seu IP local:
- **Windows**: `ipconfig` no CMD
- **macOS/Linux**: `ifconfig` ou `ip addr` no Terminal

#### Para Produção:
```javascript
const API_BASE_URL = 'https://seu-dominio.com/api';
```

---

## Configuração do Backend (CORS)

Para que o frontend possa se comunicar com o backend, é necessário configurar o CORS no Spring Boot.

### Criar arquivo de configuração CORS

Crie o arquivo `src/main/java/com/meumural/projetobackend/config/CorsConfig.java`:

```java
package com.meumural.projetobackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // Em produção, especifique os domínios permitidos
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
```

---

## Endpoint de Login (IMPORTANTE)

⚠️ **ATENÇÃO**: O endpoint de login está comentado no backend!

No arquivo `UsuarioController.java`, as linhas 76-80 estão comentadas:

```java
//    @PostMapping("/login")
//    public ResponseEntity<RecoveryJwtTokenDto> authenticateUser (@RequestBody LoginUserDTO loginUserDto){
//        RecoveryJwtTokenDto token = usuarioService.authenticateUser(loginUserDto);
//        return new ResponseEntity<>(token, HttpStatus.OK);
//    }
```

### Para habilitar o login, você precisa:

1. **Descomentar o endpoint** no `UsuarioController.java`
2. **Criar os DTOs necessários**:
   - `LoginUserDTO` (com email e senha)
   - `RecoveryJwtTokenDto` (com token)
3. **Implementar o método** `authenticateUser` no `UsuarioService`

### Exemplo de implementação básica:

**LoginUserDTO.java**:
```java
public class LoginUserDTO {
    private String email;
    private String senha;
    // getters e setters
}
```

**RecoveryJwtTokenDto.java**:
```java
public class RecoveryJwtTokenDto {
    private String token;
    private UsuarioDTOResponse usuario;
    // getters e setters
}
```

---

## Como Executar

### 1. Iniciar o Backend

```bash
cd MeuMural
./mvnw spring-boot:run
```

O backend estará disponível em: `http://localhost:8416`

### 2. Iniciar o Frontend

```bash
cd MeuMuralApp
npm start
```

Escolha a plataforma:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web

---

## Testando a Integração

### 1. Teste de Registro
1. Abra o app
2. Vá para a aba "Registro"
3. Preencha: Nome, E-mail, Senha
4. Clique em "Criar Conta"
5. Verifique se a conta foi criada no banco de dados

### 2. Teste de Login
1. Vá para a aba "Login"
2. Preencha: E-mail, Senha
3. Clique em "Entrar"
4. Você deve ser redirecionado para a tela de Grupos

### 3. Teste de Grupos
1. Clique em "+ Criar"
2. Digite o nome e descrição do grupo
3. Clique em "Criar"
4. O grupo deve aparecer na lista

### 4. Teste de Tarefas
1. Clique em um grupo
2. Clique em "+ Nova"
3. Digite o título e descrição da tarefa
4. Clique em "Adicionar"
5. A tarefa deve aparecer na lista

---

## Troubleshooting

### Erro de Conexão

**Problema**: "Network Error" ou "Timeout"

**Soluções**:
1. Verifique se o backend está rodando
2. Verifique se a URL da API está correta
3. Para Android Emulator, use `10.0.2.2` ao invés de `localhost`
4. Para dispositivo físico, use o IP local da máquina

### Erro 401 (Unauthorized)

**Problema**: Requisições retornam 401

**Soluções**:
1. Verifique se o endpoint de login está implementado
2. Verifique se o token está sendo armazenado corretamente
3. Verifique se o interceptor está adicionando o token no header

### Erro 403 (Forbidden)

**Problema**: Requisições bloqueadas por CORS

**Soluções**:
1. Adicione a configuração de CORS no backend (veja seção acima)
2. Verifique se o Spring Security está permitindo as rotas

### Erro 404 (Not Found)

**Problema**: Endpoint não encontrado

**Soluções**:
1. Verifique se a URL base está correta (`/api`)
2. Verifique se os endpoints no backend estão corretos
3. Verifique os logs do backend para mais detalhes

---

## Próximos Passos Recomendados

1. **Implementar endpoint de login** no backend
2. **Adicionar validação de formulários** no frontend
3. **Implementar edição de grupos e postagens**
4. **Adicionar paginação** para listas grandes
5. **Implementar busca e filtros**
6. **Adicionar upload de imagens** (se necessário)
7. **Implementar notificações push**
8. **Adicionar testes unitários e de integração**

---

## Estrutura de Dados

### Usuário (UsuarioDTORequest)
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string",
  "status": 1,
  "role": "USER"
}
```

### Grupo (GrupoDTORequest)
```json
{
  "nome": "string",
  "descricao": "string"
}
```

### Postagem (PostagemDTORequest)
```json
{
  "usuarioId": 1,
  "grupoId": 1,
  "titulo": "string",
  "conteudo": "string"
}
```

---

## Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Spring Boot: https://spring.io/projects/spring-boot
- Documentação do React Native: https://reactnative.dev/
- Documentação do Expo: https://docs.expo.dev/

---

**Última atualização**: 27 de novembro de 2025
