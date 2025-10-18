# Mentor 24/7 - Plataforma de Tutoria Pessoal Baseada em IA

Uma plataforma web inovadora onde qualquer pessoa pode aprender tópicos complexos com um mentor de IA que adapta o plano de estudos em tempo real baseado no desempenho, estilo de aprendizagem e objetivos do usuário.

## 🎯 O Problema que Resolve

A educação online tradicional (MOOCs, YouTube) é passiva. Você assiste a vídeos, mas se não entende um conceito, fica travado. Tutores humanos são caros e inacessíveis para a maioria.

**Mentor 24/7** resolve isso criando um tutor 1-para-1, acessível 24/7, que não apenas responde perguntas, mas **proativamente identifica suas fraquezas** e gera conteúdo (textos, exercícios, quizzes) especificamente para consertá-las antes de avançar.

## ✨ Funcionalidades Principais

### 🧠 Geração Inteligente de Currículo
- Descreva seu objetivo de aprendizado (ex: "Python para Análise de Dados")
- A IA cria um currículo completo e estruturado com módulos e dependências
- Personalizado para seu nível: iniciante, intermediário ou avançado

### 📚 Aprendizado Adaptativo
- Cada módulo apresenta explicações claras seguidas de exercícios práticos
- A IA avalia suas respostas em tempo real
- Se você acerta: avança para o próximo módulo
- Se você erra: a IA identifica o conceito mal compreendido e cria conteúdo de reforço

### 🗺️ Mapa de Aprendizado Dinâmico
- Visualize seu progresso em tempo real
- Veja quais módulos você completou e o que vem a seguir
- O caminho se ajusta automaticamente baseado no seu desempenho

### 📊 Dashboard de Progresso
- Acompanhe suas estatísticas de aprendizado
- Identifique seus pontos fortes e áreas que precisam de atenção
- Histórico completo de exercícios e avaliações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework UI moderno
- **Tailwind CSS 4** - Estilização utilitária
- **shadcn/ui** - Componentes UI de alta qualidade
- **Wouter** - Roteamento leve
- **tRPC** - Type-safe API calls

### Backend
- **Express 4** - Servidor web
- **tRPC 11** - API type-safe end-to-end
- **Drizzle ORM** - Type-safe database queries
- **MySQL/TiDB** - Banco de dados relacional

### IA & Machine Learning
- **OpenAI API** - Geração de currículo e conteúdo adaptativo
- **Structured Outputs** - Respostas JSON validadas
- **Prompt Engineering** - Avaliação inteligente de respostas

### Autenticação
- **Manus OAuth** - Sistema de autenticação integrado
- **JWT** - Gerenciamento de sessões

## 📁 Estrutura do Projeto

```
mentor-24-7/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── CreatePath.tsx    # Criação de currículo
│   │   │   ├── Learn.tsx         # Interface de aprendizado
│   │   │   ├── Dashboard.tsx     # Dashboard do usuário
│   │   │   └── Explore.tsx       # Explorar cursos
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/          # Configurações (tRPC, etc)
│   │   └── App.tsx       # Rotas principais
│
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # Definição de todas as APIs
│   ├── db.ts             # Helpers de banco de dados
│   └── _core/            # Infraestrutura (auth, LLM, etc)
│
├── drizzle/              # Schema e migrações do banco
│   └── schema.ts         # Definição das tabelas
│
└── shared/               # Tipos e constantes compartilhadas
```

## 🗄️ Schema do Banco de Dados

### `users`
Gerenciamento de usuários e autenticação

### `learning_paths`
Currículos mestres criados pela IA com estrutura de módulos

### `user_progress`
Estado atual do aprendizado de cada usuário:
- Módulo atual
- Módulos completados
- Fraquezas identificadas
- Pontos fortes

### `generated_content`
Cache de conteúdo gerado pela IA (explicações, exercícios, conteúdo remedial)

### `exercise_submissions`
Histórico de respostas dos usuários e avaliações da IA

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22+
- pnpm
- Banco de dados MySQL/TiDB

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MarcioGil/Mentor-24-7.git
cd Mentor-24-7
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# As variáveis já estão configuradas automaticamente pela plataforma Manus
# Incluindo: DATABASE_URL, JWT_SECRET, OAUTH_SERVER_URL, BUILT_IN_FORGE_API_KEY, etc.
```

4. Execute as migrações do banco de dados:
```bash
pnpm db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

6. Acesse a aplicação:
```
http://localhost:3000
```

## 🎓 Como Usar

### 1. Criar um Curso
1. Faça login na plataforma
2. Clique em "Começar a Aprender" ou "Criar Curso"
3. Descreva seu objetivo de aprendizado
4. Selecione seu nível (iniciante, intermediário, avançado)
5. A IA gerará um currículo personalizado

### 2. Aprender
1. Leia a explicação do módulo atual
2. Resolva o exercício prático
3. Receba feedback instantâneo da IA
4. Se errar, receba conteúdo de reforço personalizado
5. Avance para o próximo módulo ao acertar

### 3. Acompanhar Progresso
- Acesse o Dashboard para ver estatísticas
- Visualize o mapa de aprendizado dinâmico
- Identifique suas áreas fortes e fracas

## 🧪 Arquitetura de IA

### 1. Gerador de Currículo
Prompt engineering para criar currículos estruturados em JSON com:
- Módulos sequenciais
- Dependências entre conceitos
- Estimativa de tempo
- Conceitos-chave

### 2. Avaliador de Resposta
Analisa respostas do usuário e identifica:
- Correção da resposta
- Conceito mal compreendido (se houver)
- Nível de confiança da avaliação
- Feedback construtivo

### 3. Gerador de Conteúdo Adaptativo
Cria conteúdo personalizado baseado em:
- Fraquezas identificadas
- Contexto do módulo original
- Estilo de aprendizagem do usuário

## 🎨 Design

- **Paleta de cores**: Gradiente azul-índigo-roxo
- **Componentes**: shadcn/ui para consistência
- **Responsivo**: Mobile-first design
- **Acessibilidade**: Componentes acessíveis por padrão

## 📊 Métricas de Impacto

- **Personalização**: 100% do conteúdo adaptado ao usuário
- **Disponibilidade**: 24/7 sem limitações
- **Custo**: Gratuito vs tutores humanos (R$ 50-200/hora)
- **Escalabilidade**: Ilimitado número de alunos simultâneos

## 🔒 Segurança

- Autenticação OAuth integrada
- Sessões JWT seguras
- Validação de dados com Zod
- Type-safety end-to-end com tRPC

## 🚀 Próximos Passos

- [ ] Suporte a múltiplos idiomas
- [ ] Integração com código executável (para cursos de programação)
- [ ] Sistema de gamificação (badges, streaks)
- [ ] Comunidade e compartilhamento de cursos
- [ ] Análise avançada de padrões de aprendizado
- [ ] Suporte a conteúdo multimídia (vídeos, áudio)

## 📝 Licença

Este projeto foi desenvolvido como demonstração de tecnologia educacional com IA.

## 👨‍💻 Desenvolvedor

**Márcio Gil**
- GitHub: [@MarcioGil](https://github.com/MarcioGil)
- Repositório: [Mentor-24-7](https://github.com/MarcioGil/Mentor-24-7)

---

**Mentor 24/7** - Educação personalizada com inteligência artificial 🚀

