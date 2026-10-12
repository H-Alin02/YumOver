# --- Stage 1: build the page ---
FROM node:24-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/ .

RUN npm ci
RUN npm run build

# --- Stage 2: the gateway ---
FROM node:24-slim

WORKDIR /app/backend

COPY backend/ .

RUN npm ci
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/fake_db" npx prisma generate

COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

USER node
CMD ["node", "src/server.js"]
