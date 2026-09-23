FROM node:22-bookworm-slim
WORKDIR /app
COPY deploy-src.part* /tmp/
COPY deploy-fix.* /tmp/
RUN (cat /tmp/deploy-src.part01; cat /tmp/deploy-fix.02a /tmp/deploy-fix.02b /tmp/deploy-fix.02c /tmp/deploy-fix.02d; cat /tmp/deploy-src.part03; cat /tmp/deploy-fix.04a /tmp/deploy-fix.04b /tmp/deploy-fix.04c /tmp/deploy-fix.04d; cat /tmp/deploy-src.part05) | base64 -d > /tmp/app.tar.gz \
    && tar -xzf /tmp/app.tar.gz -C /app \
    && rm -f /tmp/deploy-src.part* /tmp/deploy-fix.* /tmp/app.tar.gz
RUN cd client && npm install && npm run build && rm -rf node_modules
RUN cd backend && npm install --omit=dev
ENV PORT=3000
EXPOSE 3000
CMD ["node", "backend/server.js"]
