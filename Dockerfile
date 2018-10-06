FROM node:10-alpine
WORKDIR /app
COPY ./dist ./
RUN npm install -g --only=prod
ENTRYPOINT [ "node", "dist/server/app.js" ]