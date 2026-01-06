# Conversation Relay Functions Context

This directory contains Twilio Conversation Relay functions for building real-time voice AI applications.

## What is Conversation Relay?

Conversation Relay enables real-time, bidirectional communication between phone calls and AI/LLM backends via WebSockets. It handles:
- Real-time speech transcription
- Text-to-speech synthesis
- Audio streaming
- DTMF detection
- Interruption handling

## TwiML Setup

### Basic Connection
```javascript
const twiml = new Twilio.twiml.VoiceResponse();
const connect = twiml.connect();

connect.conversationRelay({
  url: 'wss://your-server.com/relay',
  voice: 'Polly.Amy',
  language: 'en-US'
});

return callback(null, twiml);
```

### Full Configuration
```javascript
connect.conversationRelay({
  url: 'wss://your-server.com/relay',        // WebSocket endpoint
  voice: 'Polly.Amy',                        // TTS voice
  language: 'en-US',                         // Language code
  transcriptionProvider: 'google',           // 'google' or 'deepgram'
  speechModel: 'telephony',                  // Speech recognition model
  profanityFilter: 'true',                   // Filter profanity
  dtmfDetection: 'true',                     // Detect DTMF tones
  interruptible: 'true',                     // Allow interruptions
  interruptByDtmf: 'true',                   // DTMF can interrupt
  welcomeGreeting: 'Hello, how can I help?', // Initial greeting
  partialPrompts: 'true'                     // Enable partial transcripts
});
```

## WebSocket Message Protocol

### Incoming Messages (from Twilio)

#### Setup Message
```json
{
  "type": "setup",
  "callSid": "CA...",
  "streamSid": "MZ...",
  "from": "+1234567890",
  "to": "+0987654321"
}
```

#### Prompt Message (User Speech)
```json
{
  "type": "prompt",
  "voicePrompt": "Hello, I need help with my account",
  "confidence": 0.95,
  "isFinal": true
}
```

#### DTMF Message
```json
{
  "type": "dtmf",
  "digit": "1"
}
```

#### Interrupt Message
```json
{
  "type": "interrupt"
}
```

### Outgoing Messages (to Twilio)

#### Text Response (TTS)
```json
{
  "type": "text",
  "token": "Hello! I'd be happy to help you with your account."
}
```

#### End Session
```json
{
  "type": "end"
}
```

## WebSocket Server Implementation Pattern

```javascript
// Example WebSocket handler (Node.js with ws library)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  let callContext = {};

  ws.on('message', async (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'setup':
        callContext = {
          callSid: message.callSid,
          from: message.from,
          to: message.to
        };
        break;

      case 'prompt':
        if (message.isFinal) {
          // Process with your LLM
          const response = await processWithLLM(message.voicePrompt);
          ws.send(JSON.stringify({
            type: 'text',
            token: response
          }));
        }
        break;

      case 'dtmf':
        // Handle DTMF digit
        break;

      case 'interrupt':
        // User interrupted, stop current response
        break;
    }
  });

  ws.on('close', () => {
    // Cleanup
  });
});
```

## Integration with Claude/LLMs

### Anthropic Claude Integration
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic();

async function processWithLLM(userMessage) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: userMessage }
    ]
  });

  return response.content[0].text;
}
```

### OpenAI Integration
```javascript
const OpenAI = require('openai');
const openai = new OpenAI();

async function processWithLLM(userMessage) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: userMessage }
    ]
  });

  return response.choices[0].message.content;
}
```

## Voice Options

### Amazon Polly Voices
- `Polly.Amy` - British English, Female
- `Polly.Brian` - British English, Male
- `Polly.Joanna` - US English, Female
- `Polly.Matthew` - US English, Male
- `Polly.Ivy` - US English, Child Female

### Google Voices
- `Google.en-US-Neural2-A` - US English Neural
- `Google.en-GB-Neural2-B` - British English Neural

## Best Practices

1. **Handle Interruptions**: Users may interrupt the AI mid-sentence. Handle the `interrupt` message to stop current output.

2. **Use Streaming**: For long responses, stream text tokens individually for natural conversation flow.

3. **Manage Latency**: Keep LLM response times low for natural conversation. Consider using faster models for time-sensitive responses.

4. **Handle Silence**: Implement timeout handling for long silences.

5. **Graceful Endings**: Send the `end` message when the conversation should conclude.

## Local Development with ngrok

For local WebSocket development, use ngrok to expose your local server:

### Setup ngrok

1. **Install ngrok**

   ```bash
   # macOS
   brew install ngrok

   # Or download from https://ngrok.com/download
   ```

2. **Configure ngrok auth token**

   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Start your WebSocket server locally**

   ```bash
   node websocket-server.js  # Runs on port 8080
   ```

4. **Expose with ngrok**

   ```bash
   ngrok http 8080
   ```

5. **Use the ngrok URL in your function**

   ```javascript
   connect.conversationRelay({
     url: 'wss://abc123.ngrok.io/relay',  // Use the ngrok URL
     voice: 'Polly.Amy'
   });
   ```

### ngrok Configuration for WebSockets

For a stable development URL, use a custom subdomain (requires paid ngrok):

```bash
ngrok http 8080 --subdomain=my-relay-dev
```

This gives you a consistent URL: `wss://my-relay-dev.ngrok.io`

### Development Workflow

1. Start WebSocket server locally (port 8080)
2. Start ngrok tunnel: `ngrok http 8080`
3. Update `CONVERSATION_RELAY_URL` in `.env` with ngrok URL
4. Start Twilio serverless: `npm run start:ngrok`
5. Call your Twilio number to test

### Debugging WebSocket Traffic

ngrok provides a web interface at `http://localhost:4040` to inspect WebSocket traffic in real-time.

## Testing Conversation Relay

1. Set up a WebSocket server (locally or deployed)
2. Use ngrok to expose local WebSocket server
3. Configure the relay URL in your function
4. Make test calls to verify the flow
5. Test interruption scenarios
6. Test DTMF handling if enabled

## Environment Variables

```text
CONVERSATION_RELAY_URL=wss://your-server.com/relay
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```
