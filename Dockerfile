FROM node:10 as base
WORKDIR /app
COPY . .
RUN npm install --only=dev
RUN gulp scripts

FROM node:10-alpine
WORKDIR /app
COPY --from=base /app/dist ./dist/
COPY . .
RUN npm install --only=prod
ENTRYPOINT [ "node", "dist/server/app.js" ]