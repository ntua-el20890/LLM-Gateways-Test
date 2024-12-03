import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

const app = express();
app.use(express.json());

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.GLHF_API_KEY,
  baseURL: "https://glhf.chat/api/openai/v1",
});

// Define available routes
app.post("/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;

    // Validate inputs
    if (!messages || !model) {
      return res.status(400).send({ error: "Missing required fields: messages, model" });
    }

    // Send request to the external API
    const completion = await client.chat.completions.create({
      messages,
      model: `hf:${model}`,
    });

    // Return the response to the client
    res.status(200).send(completion);
  } catch (error) {
    console.error("Error handling /chat request:", error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/completion", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    // Validate inputs
    if (!prompt || !model) {
      return res.status(400).send({ error: "Missing required fields: prompt, model" });
    }

    // Send request to the external API
    const completion = await client.completions.create({
      prompt,
      model: `hf:${model}`,
    });

    // Return the response to the client
    res.status(200).send(completion);
  } catch (error) {
    console.error("Error handling /completion request:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/models", async (req, res) => {
  try {
    // Fetch available models
    const models = await client.models.list();
    res.status(200).send(models);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  
  // try {
  //   // Fetch and log available models on server startup
  //   const models = await client.models.list();
  //   console.log(models);
  // } catch (error) {
  //   console.error("Error fetching models:", error);
  // }
});
