# OpenList - Gerenciador de Tarefas Avançado

O **OpenList** é uma aplicação web de gerenciamento de tarefas (To-Do List) moderna e escalável, desenvolvida separando rigidamente o Frontend (React + TailwindCSS) do Backend (Django REST Framework). A plataforma incorpora funcionalidades avançadas como categorização de tarefas, compartilhamento em tempo real com outros usuários, paginação, filtros por status e categorias, busca textual, documentação interativa OpenAPI/Swagger e autenticação local segura utilizando o Supabase Auth (GoTrue).

---

## 🏗️ Arquitetura e Engenharia de Software

O ecossistema é orquestrado de forma conteinerizada via **Docker Compose** e se divide nos seguintes componentes chave:

```
                                  ┌──────────────────────────┐
                                  │     Navegador do Usuário │
                                  └─────────────┬────────────┘
                                                │
                     ┌──────────────────────────┼──────────────────────────┐
                     ▼ (Porta 3000)             ▼ (Porta 54321)            ▼ (Porta 8000)
         ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
         │     React Frontend    │  │     Nginx Gateway     │  │     Django Backend    │
         │   (Vite + Tailwind)   │  │   (Supabase Router)   │  │ (REST Framework + JWT)│
         └───────────────────────┘  └───────────┬───────────┘  └───────────┬───────────┘
                                                │                          │
                                                ▼ (Porta 9999)             │
                                    ┌───────────────────────┐              │
                                    │  Supabase Auth GoTrue │              │
                                    └───────────┬───────────┘              │
                                                │                          │
                                                ▼ (Porta 5432)             ▼ (Porta 5432)
                                    ┌──────────────────────────────────────────────────┐
                                    │               PostgreSQL Database                │
                                    └──────────────────────────────────────────────────┘
```

1. **Frontend (React, TailwindCSS, Vite)**:
   Uma aplicação SPA responsiva com interface refinada (estética premium escura, gradientes modernos e efeitos de glassmorphic). Comunica-se com o Nginx Gateway para operações de autenticação e diretamente com a API do Django REST Framework para operações de negócio.
2. **Backend (Django REST Framework)**:
   Exprime endpoints puramente RESTful e lida com a lógica de negócio de tarefas, categorias e compartilhamento. Utiliza um middleware personalizado de autenticação para validar chaves JWT de forma stateless.
3. **Autenticação (Supabase GoTrue)**:
   Serviço de autenticação local do Supabase encapsulado em um contêiner Docker. Gera chaves JWT seguras codificadas em algoritmo HS256 baseadas nos cadastros.
4. **Gateway de Rotas (Nginx)**:
   Proxy reverso leve que expõe a porta `54321` e redireciona rotas sob `/auth/v1/` para o serviço do GoTrue. Isso simula o comportamento real do Supabase Local.
5. **Banco de Dados (PostgreSQL)**:
   Instância de banco relacional compartilhada entre o GoTrue (tabela de credenciais) e o Django (tabelas de regras de negócios).

---

## 🎨 Princípios de Design de Software

O projeto foi construído seguindo diretrizes rígidas de engenharia:

### 1. **SOLID**
- **Single Responsibility Principle (SRP)**:
  - A classe `SupabaseJWTAuthentication` em `api/auth.py` tem a única responsabilidade de obter o cabeçalho HTTP de autorização, decodificar a assinatura do token e injetar ou provisionar o usuário associado.
  - Os serializadores isolam regras de conversão de tipos de dados da lógica das rotas.
- **Dependency Inversion Principle (DIP)**:
  - O frontend consome um wrapper abstrato em `src/api/client.js` para efetuar requisições ao backend, injetando os tokens dinamicamente em interceptores sem misturar lógica de requests nos componentes visuais.

### 2. **DRY (Don't Repeat Yourself)**
- Lógica de herança em serializadores garante que a validação de propriedade de categorias (`validate_category`) seja centralizada e reaproveitada em operações de criação e edição de tarefas.
- Reuso de estilos e tokens de cores do Tailwind centralizados em `tailwind.config.js` e `src/index.css`.

### 3. **KISS (Keep It Simple, Stupid)**
- Em vez de implementar serviços pesados de sincronização de contas de usuários em tempo de cadastro, a integração Django-Supabase faz um **Lazy Account Provisioning**: a conta no Django é instanciada sob demanda na primeira requisição autenticada do usuário.
- Para simplificar as chamadas de toggle de conclusão de tarefas, criamos um endpoint direto `/tasks/{id}/toggle/` que resolve o estado sem necessidade de trafegar payloads completos de alteração (PUT).

---

## 🚀 Como Rodar a Aplicação

### Pré-requisitos
Certifique-se de possuir o **Docker** e o **Docker Compose** instalados em seu computador.

### Executando em 1 Clique (Docker Compose)
A partir da pasta raiz do projeto (`OpenList/`), execute o comando abaixo para construir as imagens e iniciar os serviços:

```bash
docker compose up --build -d
```

O comando irá inicializar:
- Banco de dados PostgreSQL na porta `5432`
- GoTrue (Supabase Auth) na porta `9999`
- Nginx Gateway (Supabase Router) na porta `54321`
- Django REST API na porta `8000`
- React Frontend na porta `3000`

### 🔗 Portas & Links Úteis
- **Aplicação Web (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **Painel de Documentação Swagger (Backend)**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Documentação de Integração Externa (Frontend)**: Acesse a aba **Documentação API** no canto superior do painel logado na aplicação.

> [!NOTE]
> O contêiner de autenticação local está configurado com `GOTRUE_MAILER_AUTOCONFIRM=true`. Isso significa que, ao preencher o formulário de cadastro, seu e-mail será ativado de forma instantânea sem a necessidade de checar caixas de e-mail fictícias!

---

## 🧪 Suíte de Testes e Cobertura

### 1. Testes de Unidade (Pytest - Backend)
Para rodar a suíte de testes de backend contendo 20 testes de unidade e integração e validar a cobertura do código:

```bash
# Executa dentro do contêiner Docker do backend
docker compose exec backend pytest
```

Ou, caso tenha configurado o ambiente local:
```bash
cd backend
.venv\Scripts\activate
pytest
```

#### Cobertura Alcançada: **99.74%**
Toda a lógica de tratamento de tokens JWT, controle de acesso de tarefas, exclusão, filtros de categoria e paginação é coberta. O arquivo `pytest.ini` impõe um limite mínimo de **95%** de cobertura para que a pipeline execute com sucesso.

### 2. Testes de Interface (Selenium - Frontend)
Os testes E2E do frontend estão escritos em Python utilizando Selenium (modo headless).

**Para rodá-los localmente:**
1. Tenha o navegador Chrome instalado no computador.
2. Certifique-se de que a aplicação está executando localmente (`docker compose up`).
3. Com a virtualenv ativa e dependências instaladas:
   ```bash
   cd frontend
   pytest tests/test_e2e.py
   ```

---

## 🔄 Pipeline CI/CD

O projeto conta com uma pipeline de Integração Contínua configurada via **GitHub Actions** em `.github/workflows/ci.yml`.

A cada commit ou Pull Request na branch principal:
- Lança um ambiente Linux limpo.
- Instala dependências do Python e roda testes automatizados com `pytest` exigindo cobertura mínima de **95%** (`pytest-cov`).
- Configura o Node.js, instala pacotes e roda o build de produção (`npm run build`) para certificar a compilação livre de erros de lints ou tipagem no frontend.
