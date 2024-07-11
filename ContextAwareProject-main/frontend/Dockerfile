FROM node:20.14.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install @mui/x-charts
RUN npm install @mui/styled-engine-sc styled-components
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]