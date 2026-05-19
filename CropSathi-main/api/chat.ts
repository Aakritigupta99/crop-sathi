// Serverless function for Vercel to power /api/chat
// Supports OpenAI, OpenRouter, Together, and Groq using OpenAI-compatible schema
import type { ChatRequest, ChatResponse } from "../shared/api";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const body = req.body as ChatRequest;
    const messages = body?.messages || [];
    const model = body?.model;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages[] required" });
      return;
    }

    const provider = (process.env.AI_PROVIDER || "").toLowerCase();
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const togetherKey = process.env.TOGETHER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let url = "";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    let payload: any = {};

    const toOpenAIMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (provider === "openrouter" || (!provider && openrouterKey)) {
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers["Authorization"] = `Bearer ${openrouterKey}`;
      payload = {
        model: model || "openai/gpt-4o-mini",
        messages: toOpenAIMessages,
        temperature: 0.3,
      };
    } else if (provider === "together" || (!provider && togetherKey)) {
      url = "https://api.together.xyz/v1/chat/completions";
      headers["Authorization"] = `Bearer ${togetherKey}`;
      payload = {
        model: model || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: toOpenAIMessages,
        temperature: 0.3,
      };
    } else if (provider === "groq" || (!provider && groqKey)) {
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${groqKey}`;
      payload = {
        model: model || "llama-3.1-8b-instant",
        messages: toOpenAIMessages,
        temperature: 0.3,
      };
    } else if (openaiKey) {
      url = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${openaiKey}`;
      payload = {
        model: model || "gpt-4o-mini",
        messages: toOpenAIMessages,
        temperature: 0.3,
      };
    } else {
      const fallback: ChatResponse = {
        reply:
          "AI is not configured yet. Please set OPENAI_API_KEY (or OPENROUTER_API_KEY/TOGETHER_API_KEY/GROQ_API_KEY).",
      };
      res.status(200).json(fallback);
      return;
    }

    const r = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const text = await r.text();
      res.status(500).json({ error: `Provider error: ${r.status} ${text}` });
      return;
    }
    const data = await r.json();
    const content =
      data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";
    const response: ChatResponse = { reply: content };
    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Unknown error" });
  }
}
