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

## Tecnologías

- [Bun](https://bun.sh) - Runtime JavaScript rápido
- [Elysia](https://elysiajs.com) - Framework web para Bun
- [Swagger](https://swagger.io) - Documentación de API