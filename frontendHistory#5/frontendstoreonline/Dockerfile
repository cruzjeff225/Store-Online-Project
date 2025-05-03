# Usa una imagen oficial de Node.js para construir la app
FROM node:22 AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y compila el proyecto
COPY . .
RUN npm run build

# Usa Nginx para servir el frontend en producción
FROM nginx:latest

# Copia los archivos generados por Vite al contenedor de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80 para el acceso al frontend
EXPOSE 80

# Inicia el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
