import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";

if (!DEEPSEEK_API_KEY) {
  console.error("❌ Error: DEEPSEEK_API_KEY no está configurada en las variables de entorno");
  process.exit(1);
}

interface DeepSeekRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "DeepSeek API Demo",
          version: "1.0.1",
          description: "API simple para interactuar con DeepSeek",
        },
        tags: [
          {
            name: "Chat",
            description: "Endpoints para interactuar con DeepSeek",
          },
        ],
      },
    })
  )
  .get("/", () => "DeepSeek API Demo - Ve a /swagger para la documentación")
  .post(
    "/ask",
    async ({ body, set }) => {
      try {
        const deepseekRequest: DeepSeekRequest = {
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: body.question,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        };

        const response = await fetch(DEEPSEEK_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify(deepseekRequest),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error de DeepSeek:", errorText);
          set.status = 500;
          return {
            error: "Error al comunicarse con DeepSeek",
            details: errorText,
          };
        }

        const data: DeepSeekResponse = await response.json();
        
        return {
          answer: data.choices[0]?.message?.content || "Sin respuesta",
          usage: data.usage,
        };
      } catch (error) {
        console.error("Error:", error);
        set.status = 500;
        return {
          error: "Error interno del servidor",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      body: t.Object({
        question: t.String({
          description: "La pregunta que quieres hacer a DeepSeek",
          example: "¿Cuál es la capital de España?",
        }),
      }),
      response: {
        200: t.Object({
          answer: t.String({ description: "Respuesta de DeepSeek" }),
          usage: t.Object({
            prompt_tokens: t.Number(),
            completion_tokens: t.Number(),
            total_tokens: t.Number(),
          }),
        }),
        500: t.Object({
          error: t.String(),
          details: t.String(),
        }),
      },
      detail: {
        tags: ["Chat"],
        summary: "Hacer una pregunta a DeepSeek",
        description: "Envía una pregunta a la API de DeepSeek y recibe una respuesta",
      },
    }
  )
  .listen(3068);

console.log(
  `🦊 Elysia está ejecutándose en ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Documentación Swagger disponible en: http://localhost:3068/swagger`);
