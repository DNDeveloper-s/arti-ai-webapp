const express = require('express');
const cors = require('cors');
const OpenAI = require("openai");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
// app.use(bodyParser.json());
const openai = new OpenAI({
  apiKey: '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',
})

app.listen(8080, () => {
  console.log('Listening to 8080');
});
app.get('/', async(req, res, next) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  return res.send('You are connected to right thing')
})

app.post('/text-stream', bodyParser.json(), async (req, res, next) => {
  const {messages} = req.body;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial data to the client
  res.write('data: Initial data\n\n');

  console.log('messages - ', req);

  const completion = await openai.chat.completions.create({
    messages: messages ?? [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
    stream: true
  });

  for await(const chunk of completion) {
    if(chunk.choices.at(-1) && chunk.choices.at(-1)?.finish_reason)  {
      res.write(JSON.stringify(chunk));
      res.end();
      return;
    }
    res.write(JSON.stringify(chunk));
  }
  // Simulate sending updates at regular intervals
  // const interval = setInterval(() => {
  //   res.write(`data: Server time: ${new Date().toLocaleTimeString()}\n\n`);
  // }, 1000);

  // Handle client disconnection
  req.on('close', () => {
    // clearInterval(interval);
    console.log('Client disconnected');
  });
})
