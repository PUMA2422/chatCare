// server/routes/chatRoutes.js
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, model = "medllama2", system = "" } = req.body;

  try {
    // Request Ollama with streaming enabled
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        model,
        prompt: message,
        system,
        stream: true,
      }),
    });

    if (!ollamaRes.ok) {
      const txt = await ollamaRes.text();
      return res.status(ollamaRes.status).json({ error: "Ollama error", details: txt });
    }

    // Tell client we will stream plain text (not SSE)
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // (status 200 implicit)

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Ollama tends to send newline-separated JSON objects — split by newline
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep last partial line

      for (const line of lines) {
        if (!line.trim()) continue;
        let parsed;
        try {
          parsed = JSON.parse(line);
        } catch (e) {
          // If a line isn't valid JSON, skip it
          continue;
        }

        // When Ollama sends a "response" field, forward it as raw text
        if (parsed.response) {
          res.write(parsed.response);
        }

        // If Ollama signals done, end the response
        if (parsed.done) {
          res.end();
          return;
        }
      }
    }

    // Attempt to flush any trailing partial JSON
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.response) res.write(parsed.response);
      } catch (e) {
        // ignore
      }
    }
    res.end();
  } catch (err) {
    console.error("Error streaming from Ollama:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error while streaming" });
    } else {
      try { res.end(); } catch {}
    }
  }
});

export default router;
