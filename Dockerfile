#Defica a imagem base do Docker a ser utilizada
FROM nginx:latest

# Copia os arqivos para a pasta padrão do servidor web do Nginx
COPY . /usr/share/nginx/html

# O Nginx expõe a porta 80 por padrão, onde o servidor web irá rodar
EXPOSE 80

# Comando para iniciar o servidor web Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]