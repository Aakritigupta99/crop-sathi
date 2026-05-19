import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRecommend } from "./routes/recommend";
import type { ChatRequest, ChatResponse } from "../shared/api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ✅ Crop Recommendation (proxies to FastAPI ML server)
  app.post("/api/recommend", handleRecommend);

  // ✅ Chat completion proxy (supports OpenAI, OpenRouter, Together, Groq)
  app.post("/api/chat", async (req, res) => {
    try {
      const body = req.body as ChatRequest;
      const messages = body?.messages || [];
      const model = body?.model;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "messages[] required" });
      }

      // Add farming system prompt if not present
      const systemMessage = {
        role: "system" as const,
        content: `You are CropSathi, an expert AI agricultural assistant for Indian farmers.
You help farmers with:
- Crop recommendations based on soil and weather
- Fertilizer and pesticide advice
- Crop disease diagnosis
- Market prices and selling strategies
- Government schemes and subsidies
- Farming best practices

Always respond in a friendly, simple language. If the farmer seems to prefer Hindi, respond in Hindi.
Keep answers practical and actionable. Use emojis to make responses more readable.`,
      };

      const allMessages = [systemMessage, ...messages.map((m) => ({ role: m.role, content: m.content }))];

      const provider = (process.env.AI_PROVIDER || "").toLowerCase();
      const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
      const openrouterKey = process.env.OPENROUTER_API_KEY;
      const togetherKey = process.env.TOGETHER_API_KEY;
      const groqKey = process.env.GROQ_API_KEY;

      let url = "";
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      let payload: any = {};

      if (provider === "openrouter" || (!provider && openrouterKey)) {
        url = "https://openrouter.ai/api/v1/chat/completions";
        headers["Authorization"] = `Bearer ${openrouterKey}`;
        payload = { model: model || "openai/gpt-4o-mini", messages: allMessages, temperature: 0.4 };
      } else if (provider === "together" || (!provider && togetherKey)) {
        url = "https://api.together.xyz/v1/chat/completions";
        headers["Authorization"] = `Bearer ${togetherKey}`;
        payload = { model: model || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", messages: allMessages, temperature: 0.4 };
      } else if (provider === "groq" || (!provider && groqKey)) {
        url = "https://api.groq.com/openai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${groqKey}`;
        payload = { model: model || "llama-3.1-8b-instant", messages: allMessages, temperature: 0.4 };
      } else if (openaiKey) {
        url = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${openaiKey}`;
        payload = { model: model || "gpt-4o-mini", messages: allMessages, temperature: 0.4 };
      } else {
        const fallback: ChatResponse = {
          reply:
            "🌾 Hi! I'm CropSathi. To activate AI chat, please configure an API key (GROQ_API_KEY is free and recommended). For now, visit our Crop Recommendation page to get AI-powered crop suggestions!",
        };
        return res.status(200).json(fallback);
      }

      const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
      if (!r.ok) {
        const text = await r.text();
        return res.status(500).json({ error: `Provider error: ${r.status} ${text}` });
      }
      const data = await r.json();
      const content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";
      const response: ChatResponse = { reply: content };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Unknown error" });
    }
  });

  return app;
}
