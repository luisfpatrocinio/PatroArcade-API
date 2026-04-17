FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todo o código-fonte restante
COPY . .

# Fazer a compilação (tsc)
RUN npm run build

# Definir variável de ambiente de produção (pode ser sobrescrita via docker run/compose)
ENV NODE_ENV=production
ENV PORT=3001

# Expor a porta 3001
EXPOSE 3001

# Iniciar o servidor
CMD ["npm", "start"]
