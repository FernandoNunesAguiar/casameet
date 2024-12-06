# CasaMeet 🏠 

Este projeto é um sistema web de anúncio de imóveis criado por mim, Fernando Nunes de Aguiar e Gustavo Scarabelot dos Santos para ser apresentado como nosso Trabalho de Conclusão de Curso (TCC) no Cedup Abílio Paulo. O sistema inclui funcionalidades como:

- Chat entre usuários.
- Criação de imóveis.
- Gerenciamento de imóveis criados.
- Sistema de denúncia de imóveis.

## Configuração do Banco de Dados

### Requisitos
- MySQL instalado e configurado.
- Acesso ao MySQL com permissões para criar bancos de dados.

### Instruções para criar o banco de dados
1. Acesse seu servidor MySQL utilizando um cliente de linha de comando ou uma interface gráfica (como o MySQL Workbench).

2. Execute o seguinte comando SQL para criar o banco de dados:
   ```sql
   CREATE DATABASE casameet;
   ```

3. Certifique-se de que o banco de dados foi criado com sucesso. Você pode verificar isso listando os bancos de dados existentes:
   ```sql
   SHOW DATABASES;
   ```
   O banco de dados `casameet` deve aparecer na lista.

4. Configure as credenciais de acesso ao banco de dados no arquivo de configuração do projeto (normalmente encontrado em `.env` ou outro arquivo de configuração). Aqui está um exemplo de configuração no arquivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=casameet
   ```

## Inicialização do Projeto

1. Certifique-se de que o banco de dados `casameet` foi criado e que suas credenciais estão configuradas corretamente.

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   npx sequelize db:migrate
   ```

4. (Opcional) Popule o banco de dados com dados iniciais, caso haja seeders configurados:
   ```bash
   npx sequelize db:seed:all
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

Agora o projeto estará rodando e pronto para uso!

---
Se encontrar qualquer problema durante a configuração, verifique os logs de erro ou entre em contato com o mantenedor do projeto.

