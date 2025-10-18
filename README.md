🧠 Mentor 24/7 — Plataforma de Tutoria Pessoal Baseada em IA

Mentor 24/7 é uma plataforma web inovadora de educação personalizada com inteligência artificial, projetada para oferecer mentoria individual adaptativa em qualquer área do conhecimento.
O sistema utiliza IA generativa e aprendizado adaptativo para criar currículos dinâmicos, avaliar respostas, identificar lacunas de conhecimento e gerar conteúdo personalizado para cada aluno — tudo em tempo real.

🔗 Deploy: https://marciogil.github.io/Mentor-24-7/

💻 Repositório: https://github.com/MarcioGil/Mentor-24-7.git

👤 Desenvolvedor: Márcio Gil

🎯 Problema que o Projeto Resolve

A maior parte da educação online é passiva. Plataformas como MOOCs e YouTube dependem do esforço individual do aluno para compreender conceitos complexos — e quando o aluno trava, não há suporte imediato ou personalizado.

Tutoria humana é eficaz, mas cara e inacessível para a maioria dos estudantes.

O Mentor 24/7 resolve isso com um mentor de IA disponível 24 horas por dia, que adapta o conteúdo ao ritmo, desempenho e estilo de aprendizado de cada usuário, como um tutor pessoal inteligente.

✨ Funcionalidades Principais

🧠 Geração Inteligente de Currículo
A IA cria um plano de estudos estruturado a partir de um objetivo (ex: “Aprender Python para Análise de Dados”), ajustado ao nível do usuário.

📚 Aprendizado Adaptativo
A IA avalia cada resposta e adapta o conteúdo:

Se o aluno acerta → avança

Se erra → gera material de reforço

🗺️ Mapa de Aprendizado Dinâmico
Mostra módulos concluídos, progresso e próximos passos — atualizando-se automaticamente conforme o desempenho.

📊 Dashboard de Progresso
Exibe estatísticas, fraquezas identificadas, tempo de estudo e histórico de respostas.

🛠️ Tecnologias Utilizadas
Frontend

React 19 — Framework moderno e performático

Tailwind CSS 4 — Estilização utilitária

shadcn/ui — Componentes acessíveis e padronizados

Wouter — Roteamento leve

tRPC — Comunicação full-stack type-safe

Backend

Express 4 — Servidor web robusto

tRPC 11 — API type-safe end-to-end

Drizzle ORM — ORM moderno e tipado

MySQL/TiDB — Banco de dados relacional escalável

IA e Machine Learning

OpenAI API — Geração de currículos e conteúdo

Structured Outputs — Respostas em JSON validadas

Prompt Engineering — Avaliação inteligente e personalizada

Autenticação e Segurança

Manus OAuth — Login seguro integrado

JWT — Gerenciamento de sessões

Zod — Validação rigorosa de dados

TypeScript — Tipagem end-to-end

📁 Estrutura do Projeto
mentor-24-7/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/          # Páginas principais
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── CreatePath.tsx    # Criação de currículos
│   │   │   ├── Learn.tsx         # Interface de aprendizado
│   │   │   ├── Dashboard.tsx     # Dashboard do usuário
│   │   │   └── Explore.tsx       # Explorar cursos
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── lib/                  # Configurações e hooks (tRPC, etc.)
│   │   └── App.tsx               # Roteamento principal
│
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição das APIs
│   ├── db.ts              # Conexão e helpers de banco
│   └── _core/             # Módulos de auth, IA, etc.
│
├── drizzle/               # Schema e migrações do banco
│   └── schema.ts          # Definição de tabelas
│
└── shared/                # Tipos e constantes compartilhadas

🗄️ Schema do Banco de Dados

users → Autenticação e perfis

learning_paths → Currículos estruturados gerados pela IA

user_progress → Estado atual do aprendizado

generated_content → Cache de explicações e exercícios

exercise_submissions → Histórico de respostas e avaliações

🚀 Como Executar o Projeto
Pré-requisitos

Node.js 22+

pnpm

Banco de dados MySQL ou TiDB

Instalação
git clone https://github.com/MarcioGil/Mentor-24-7.git
cd Mentor-24-7
pnpm install
pnpm db:push
pnpm dev


⚙️ As variáveis de ambiente (como DATABASE_URL, JWT_SECRET, OAUTH_SERVER_URL) são configuradas automaticamente pela plataforma Manus.

Acesse:
👉 http://localhost:3000

🎓 Como Usar

Crie um curso personalizado

Faça login

Descreva seu objetivo de aprendizado

Escolha o nível (iniciante, intermediário, avançado)

Aprenda com feedback inteligente

Resolva exercícios

Receba feedback em tempo real

Reforce conteúdos antes de avançar

Acompanhe seu progresso

Veja estatísticas e módulos concluídos

Identifique pontos fortes e fracos

🧪 Arquitetura de IA
1. Gerador de Currículo

Cria currículos estruturados com módulos, dependências e tempo estimado via JSON.

2. Avaliador de Respostas

Analisa a correção, identifica conceitos mal compreendidos e fornece feedback construtivo.

3. Gerador de Conteúdo Adaptativo

Produz explicações e exercícios personalizados conforme o desempenho do usuário.

🎨 Design

Paleta: gradiente azul → índigo → roxo

Estilo: Mobile-first e responsivo

Componentes: shadcn/ui

Acessibilidade: compatível com WCAG

📊 Métricas de Impacto
Métrica	Valor
Personalização	100% adaptada
Disponibilidade	24h por dia
Custo	Gratuito
Escalabilidade	Ilimitada
🔒 Segurança

Autenticação OAuth segura

Sessões via JWT

Type-safety end-to-end

Validação de entrada com Zod

🚧 Próximos Passos

🌍 Suporte multilíngue

💻 Execução de código (para cursos de programação)

🏆 Sistema de gamificação

💬 Comunidade de aprendizado

📈 Análise de padrões de desempenho

🎥 Suporte a multimídia

👥 Público-Alvo

Estudantes autodidatas e universitários

Profissionais em transição de carreira

Escolas e instituições que desejam mentoria personalizada em larga escala

Empresas que buscam treinamentos adaptativos corporativos

📝 Licença

Projeto de demonstração educacional desenvolvido por Márcio Gil —
Estudante de Engenharia de Software e Embaixador DIO Campus Expert.
Todos os direitos reservados © 2025.