const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Base URL of your LM Studio server
const LM_STUDIO_BASE_URL = 'http://localhost:1234/v1/chat/completions';

// Endpoint to route requests to the desired model
app.post('/api/chat', async (req, res) => {
    const { model, messages, temperature = 0.7, max_tokens = -1, stream = false } = req.body;

    if (!model || !messages) {
        return res.status(400).json({ error: 'Model and messages are required fields' });
    }

    try {
        // Forward the request to the LM Studio server
        const response = await axios.post(LM_STUDIO_BASE_URL, {
            model,
            messages,
            temperature,
            max_tokens,
            stream
        });

        // Send the response back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error.message);
        res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
