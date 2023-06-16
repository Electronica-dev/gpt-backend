const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express()

app.use(express.json())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/api/test', (req, res) => {
  res.send('api test succeeded')
})

app.post('/api/testPost', (req, res) => {
  res.send(`testPost, ${req.body.text}`)
})

app.post('/api/generate', async (req, res) => {
  const models = await openai.listModels();
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.text,
      temperature: 0.6,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0] });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
  // console.log(JSON.stringify(models))
  // res.status(200);
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})