FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
ENV VITE_API_URL=http://api:8000
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
