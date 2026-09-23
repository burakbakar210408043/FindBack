FROM node:22-bookworm-slim
WORKDIR /app
COPY deploy-src.part* /tmp/
RUN cat /tmp/deploy-src.part* | base64 -d > /tmp/app.tar.gz \
    && tar -xzf /tmp/app.tar.gz -C /app \
    && rm -f /tmp/deploy-src.part* /tmp/app.tar.gz
RUN cd client && npm install && npm run build && rm -rf node_modules
RUN cd backend && npm install --omit=dev
ENV PORT=3000
EXPOSE 3000
CMD ["node", "backend/server.js"]
