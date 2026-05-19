import { RequestHandler } from "express";

/**
 * POST /api/recommend
 * Proxies the crop recommendation request to the FastAPI ML server.
 * Body: { N, P, K, temperature, humidity, ph, rainfall }
 */
export const handleRecommend: RequestHandler = async (req, res) => {
  try {
    const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Basic validation
    const required = { N, P, K, temperature, humidity, ph, rainfall };
    for (const [key, val] of Object.entries(required)) {
      if (val === undefined || val === null || val === "") {
        res.status(400).json({ error: `Missing field: ${key}` });
        return;
      }
    }

    const payload = {
      N: Number(N),
      P: Number(P),
      K: Number(K),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall),
    };

    const mlRes = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      res.status(500).json({ error: `ML API error: ${mlRes.status} - ${errText}` });
      return;
    }

    const data = await mlRes.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error("Recommend route error:", err);
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
};
