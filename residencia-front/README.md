🏠 Controle de Gastos Residencial
Sistema Full Stack desenvolvido para o gerenciamento de finanças domésticas. O projeto permite o controle de integrantes da residência, categorização de despesas/receitas e o monitoramento de saldos individuais e gerais.

🛠️ Tecnologias Utilizadas
Back-end: C# e .NET 8 com Entity Framework Core.

Front-end: React (Next.js 16) com TypeScript e Tailwind CSS.

Banco de Dados: SQLite (Persistência em arquivo local).

📌 Funcionalidades e Regras de Negócio
O sistema foi desenvolvido seguindo rigorosamente as especificações do teste técnico:

Gestão de Pessoas: Cadastro completo (CRUD) com validação de nome (max 200 caracteres).

Deleção em Cascata: Ao remover uma pessoa, todas as suas transações são apagadas automaticamente do banco de dados (implementado via OnDelete(DeleteBehavior.Cascade) no EF Core).

Gestão de Categorias: Organização por descrição e finalidade (despesa, receita ou ambas).

Lançamentos Inteligentes:

Trava de Idade: Menores de 18 anos são restritos apenas a lançamentos do tipo "Saída" (Despesa).

Filtro de Finalidade: O sistema impede o uso de categorias de receita em transações de despesa (e vice-versa).

Relatórios Consolidados: Visão detalhada de ganhos, gastos e saldo líquido por integrante, além do total geral da residência.

🚀 Como Executar o Projeto
1. Clonando o Repositório
Abra o terminal e execute os comandos abaixo para baixar o projeto e entrar na pasta raiz:

Bash
git clone https://github.com/monica308/controle-gastos-residencial.git
cd controle-gastos-residencial
2. Pré-requisitos
.NET SDK 8

Node.js

Yarn

3. Back-end (API)
Navegue até a pasta da API: cd Residencia.Api

Execute o projeto: dotnet run

A API estará disponível em: https://localhost:7265 (conforme launchSettings.json).

O banco de dados SQLite (residencia.db) será gerado automaticamente no primeiro run.

4. Front-end (Web)
Navegue até a pasta do front: cd residencia-front

Instale as dependências: yarn

Inicie o servidor de desenvolvimento: yarn dev

Acesse: http://localhost:3000
📂 Organização do Código
Comentários: O código foi documentado para explicar a lógica de métodos complexos, especialmente as validações de regras de negócio no Front-end e as configurações de banco no Back-end.

Persistência: Utilizado SQLite para garantir que os dados se mantenham após reiniciar o sistema, conforme exigido.

CORS: Configurado no Program.cs para permitir a comunicação segura entre o Front-end e a WebApi.
