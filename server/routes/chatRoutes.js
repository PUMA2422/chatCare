import express from "express";

const router = express.Router();

// POST /api/chat
router.post("/", (req, res) => {
  const { message } = req.body;

  // For now, return dummy reply
  res.json({ reply: `Botzy (AI): I got your message "${message}"` });
});

export default router;