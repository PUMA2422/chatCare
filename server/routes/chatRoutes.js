import express from "express";

const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Call Ollama with streaming enabled
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: message + "\n\nGive the response in markdown format.",
        stream: true, // enable streaming
      }),
    });

    // Read response stream chunk by chunk
    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Ollama sends multiple JSON lines — split them
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep last incomplete line

      for (const line of lines) {
        if (line.trim() === "") continue;

        try {
          const data = JSON.parse(line);

          if (data.response) {
            // Send each word (or chunk) as an SSE event
            res.write(`data: ${data.response}\n\n`);
          }

          if (data.done) {
            res.write("data: [DONE]\n\n");
            res.end();
          }
        } catch (err) {
          console.error("Error parsing stream:", err);
        }
      }
    }
  } catch (err) {
    console.error("Error connecting to Ollama:", err);
    res.status(500).json({ error: "Failed to stream from AI model" });
  }
});

export default router;
