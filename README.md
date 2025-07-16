# DeepSeek API Demo

Una API simple construida con Elysia para interactuar con DeepSeek.

## Configuración

1. **Instalar dependencias:**
   ```bash
   bun install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Luego edita el archivo `.env` y agrega tu API key de DeepSeek:
   ```
   DEEPSEEK_API_KEY=tu_api_key_real_aqui
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   bun run dev
   ```

## Uso

### Documentación API
- **Swagger UI:** http://localhost:3068/swagger
- **Endpoint principal:** http://localhost:3068/

### Hacer una pregunta a DeepSeek

**POST** `/ask`

```bash
curl -X POST http://localhost:3068/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuál es la capital de España?"}'
```

**Respuesta:**
```json
{
  "answer": "La capital de España es Madrid.",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 8,
    "total_tokens": 23
  }
}
```

## 🐳 Docker & Deployment

### Desarrollo local con Docker

```bash
# Construir la imagen
docker build -t deepseek-api .

# Ejecutar el contenedor
docker run -p 3068:3068 --env-file .env deepseek-api

# O usar docker-compose
docker-compose up --build
```

### Deployment en Dokploy

1. **Configurar en Dokploy:**
   - Build Type: `Dockerfile`
   - Docker Context Path: `.` (raíz del proyecto)
   - Puerto: `3068`

2. **Variables de entorno necesarias:**
   ```
   DEEPSEEK_API_KEY=tu_api_key_real
   DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   PORT=3068
   NODE_ENV=production
   ```

3. **Configuración automática:**
   - El Dockerfile está optimizado para producción
   - Usa multi-stage builds para imágenes más pequeñas
   - Incluye healthcheck para monitoreo
   - Usuario no-root para seguridad

### Variables de entorno disponibles

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `DEEPSEEK_API_KEY` | API key de DeepSeek (requerida) | - |
| `DEEPSEEK_API_URL` | URL de la API DeepSeek | `https://api.deepseek.com/v1/chat/completions` |
| `PORT` | Puerto del servidor | `3068` |
| `NODE_ENV` | Entorno de ejecución | `development` |

## Tecnologías

- [Bun](https://bun.sh) - Runtime JavaScript rápido
- [Elysia](https://elysiajs.com) - Framework web para Bun
- [Swagger](https://swagger.io) - Documentación de API
- [Docker](https://docker.com) - Containerización
- [Dokploy](https://dokploy.com) - Plataforma de deployment