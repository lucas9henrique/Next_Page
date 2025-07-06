# Next_Page
## Descrição
O **Next_Page** é um editor de documentos on-line colaborativo que integra, de forma nativa, mecanismos de controle de versão inspirados no Git (commits, branches e merges). A proposta une edição em tempo real com rastreabilidade de mudanças, permitindo que múltiplos usuários trabalhem simultaneamente em um mesmo documento sem perder histórico ou sofrer conflitos não resolvidos.

## Funcionalidades Principais
- **Edição Colaborativa em Tempo Real**  
  Usuários podem editar o mesmo documento simultaneamente.

- **Versionamento Inspirado em Git**  
  - **Commits Visuais**: Registre pontos de controle no texto.  
  - **Branches**: Crie ramificações para explorar diferentes versões.  

- **Histórico de Alterações**  
  Visualize todas as mudanças realizadas, com autor, timestamp e mensagem de commit.

- **Resolução de Conflitos**  
  Interface para identificar e mesclar trechos conflitantes.

## Tecnologias (a definir)
> Nesta seção, adicione as dependências e frameworks utilizados, por exemplo:  
> - Frontend:  `React` + `TypeScript`  
> - Editor de Texto:   
> - Backend: Python
> - Banco de Dados: 
> - Comunicação em Tempo Real:
> - Controle de Versão Interno:   

## Pré-requisitos
- [ ] Node.js (versão X.X.X ou superior)  

## Como Executar
### 1. Clone e vá para o diretório
git clone https://github.com/SEU_USUARIO/next_page.git
cd next_page

### (opcional) ative um virtualenv:
#### python -m venv venv
#### source venv/bin/activate

### 2. Backend: instale dependências Python
 - pip install -r requirements.txt
 - uvicorn main:app --reload --port 8000

### 3. Frontend: instale e execute
- cd Frontend
- npm install
- npm install --save-dev vite
- npm install react-router-dom
- npm run dev

## Novas rotas da API
Com o backend rodando em `http://localhost:8000`, as seguintes rotas permitem
persistir documentos simples em um repositório Git para cada usuário:

- `POST /api/save` salva o conteúdo enviado e cria um commit.
- `GET /api/history/{email}` retorna a lista de commits do usuário.

