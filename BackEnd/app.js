const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/posts", postRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Quiz App API is running...");
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  // Set headers for SSE (Server-Sent Events)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qcwind/qwen3-8b-instruct-Q4-K-M",
        messages: [
          { role: "system", content: "You are a Senior MERN Developer..." },
          ...messages,
        ],
        stream: true, // Enable streaming
        enable_thinking: false,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // Ollama sends multiple JSON objects in one chunk sometimes
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.trim()) {
          res.write(`data: ${line}\n\n`); // Standard SSE format
        }
      }
    }
    res.end();
  } catch (error) {
    res.status(500).write('data: {"error": "Connection lost"}\n\n');
    res.end();
  }
});

module.exports = app;
