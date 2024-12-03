const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the vLLM servers for each model
const modelEndpoints = {
    "gemma-2-2b-it": "http://localhost:8000",
    "llama-3.2-1b-instruct": "http://localhost:8001"
};

// API Gateway endpoint
app.post('/api/chat', async (req, res) => {
    const { model, messages, temperature = 0.7, max_tokens = 512, stream = false } = req.body;

    if (!model || !messages) {
        return res.status(400).json({ error: 'Model and messages are required fields' });
    }

    // Validate if the requested model is supported
    const modelEndpoint = modelEndpoints[model];
    if (!modelEndpoint) {
        return res.status(404).json({ error: `Model ${model} is not supported` });
    }

    try {
        // Send the request to the appropriate vLLM server
        const response = await axios.post(`${modelEndpoint}/v1/chat/completions`, {
            messages,
            temperature,
            max_tokens,
            stream
        });

        // Return the response from the vLLM server
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error querying model ${model}:`, error.message);
        res.status(500).json({ error: 'Failed to process the request', details: error.message });
    }
});

// Start the API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
