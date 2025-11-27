# Verificação do Backend

## URL Configurada

O frontend está configurado para se conectar ao backend em:

```
http://academico3.rj.senac.br/meumural/api
```

## Status da Conexão

Durante os testes de conectividade, o servidor respondeu mas retornou resposta vazia. Isso pode indicar:

### Possíveis Causas

1. **Backend não está rodando**: A aplicação Spring Boot pode não estar iniciada no servidor
2. **Configuração do servidor**: Pode haver problema de proxy reverso ou configuração do Tomcat
3. **Porta incorreta**: O servidor pode estar escutando em outra porta
4. **Path incorreto**: O contexto da aplicação pode ser diferente

## Como Verificar

### 1. Verificar se o backend está rodando

Tente acessar diretamente no navegador:

- `http://academico3.rj.senac.br/meumural/`
- `http://academico3.rj.senac.br/meumural/api/grupo/listar`

### 2. Verificar documentação Swagger

Se o Swagger estiver habilitado, tente:

- `http://academico3.rj.senac.br/meumural/swagger-ui.html`
- `http://academico3.rj.senac.br/meumural/swagger-ui/index.html`

### 3. Testar com cURL

```bash
# Testar endpoint de grupos
curl -X GET "http://academico3.rj.senac.br/meumural/api/grupo/listar"

# Testar criação de usuário
curl -X POST "http://academico3.rj.senac.br/meumural/api/usuario/criar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@email.com",
    "senha": "123456",
    "status": 1,
    "role": "USER"
  }'
```

### 4. Verificar logs do servidor

Se você tem acesso ao servidor, verifique os logs do Tomcat/Spring Boot:

```bash
# Logs do Tomcat (exemplo)
tail -f /var/log/tomcat/catalina.out

# Ou logs da aplicação Spring Boot
tail -f /var/log/meumural/application.log
```

## Possíveis URLs Alternativas

Caso a URL configurada não funcione, tente estas variações:

```javascript
// Sem o /api no final
const API_BASE_URL = 'http://academico3.rj.senac.br/meumural';

// Com porta específica
const API_BASE_URL = 'http://academico3.rj.senac.br:8416/api';

// HTTPS
const API_BASE_URL = 'https://academico3.rj.senac.br/meumural/api';
```

## Configuração Atual no Frontend

O arquivo `src/services/api.js` está configurado com:

```javascript
const API_BASE_URL = 'http://academico3.rj.senac.br/meumural/api';
```

Se precisar alterar, edite este arquivo e faça um novo commit.

## Checklist de Verificação

- [ ] Backend está rodando no servidor
- [ ] URL está correta (incluindo contexto da aplicação)
- [ ] CORS está configurado no backend
- [ ] Spring Security permite acesso aos endpoints públicos
- [ ] Firewall/proxy não está bloqueando requisições
- [ ] Porta está correta (80 para HTTP, 443 para HTTPS)

## Próximos Passos

1. Confirme que o backend está rodando
2. Teste os endpoints manualmente (navegador ou Postman)
3. Ajuste a URL no `src/services/api.js` se necessário
4. Execute o app e teste a integração

## Contato com Administrador do Servidor

Se o problema persistir, entre em contato com o administrador do servidor Senac para:

- Confirmar se a aplicação está deployada
- Verificar logs de erro
- Confirmar a URL correta de acesso
- Verificar configurações de firewall/proxy

---

**Última atualização**: 27 de novembro de 2025
