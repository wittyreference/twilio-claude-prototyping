# Messaging Functions Context

This directory contains Twilio Messaging API functions for SMS and MMS handling.

## TwiML Messaging Verbs

### Message Verb
```javascript
const twiml = new Twilio.twiml.MessagingResponse();
twiml.message('Your reply text here');
```

### Message with Media (MMS)
```javascript
const twiml = new Twilio.twiml.MessagingResponse();
const message = twiml.message('Check out this image!');
message.media('https://example.com/image.jpg');
```

### Redirect Verb
```javascript
const twiml = new Twilio.twiml.MessagingResponse();
twiml.redirect('/messaging/other-handler');
```

## SMS Webhook Parameters

When Twilio makes a request to your SMS webhook, these parameters are included:

| Parameter | Description |
|-----------|-------------|
| `MessageSid` | Unique identifier for the message |
| `AccountSid` | Your Twilio Account SID |
| `From` | Sender's phone number (E.164) |
| `To` | Recipient phone number (E.164) |
| `Body` | Text content of the message |
| `NumMedia` | Number of media attachments |
| `MediaUrl0` | URL of first media attachment |
| `MediaContentType0` | MIME type of first attachment |

### Status Callback Parameters
| Parameter | Description |
|-----------|-------------|
| `MessageStatus` | Current status (queued, sent, delivered, failed) |
| `ErrorCode` | Error code if message failed |
| `ErrorMessage` | Error description if failed |

## Programmatic SMS API

### Send SMS
```javascript
const client = context.getTwilioClient();
const message = await client.messages.create({
  to: '+1234567890',
  from: context.TWILIO_PHONE_NUMBER,
  body: 'Hello from Twilio!'
});
```

### Send MMS
```javascript
const message = await client.messages.create({
  to: '+1234567890',
  from: context.TWILIO_PHONE_NUMBER,
  body: 'Check out this image!',
  mediaUrl: ['https://example.com/image.jpg']
});
```

### Message Status Values
- `queued` - Message is queued for sending
- `sending` - Message is being sent
- `sent` - Message has been sent
- `delivered` - Message confirmed delivered
- `undelivered` - Message could not be delivered
- `failed` - Message send failed

## Common Patterns

### Keyword Routing
```javascript
exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.MessagingResponse();
  const body = (event.Body || '').toLowerCase().trim();

  switch (body) {
    case 'help':
      twiml.message('Available commands: HELP, STATUS, STOP');
      break;
    case 'status':
      twiml.message('System is operational.');
      break;
    case 'stop':
      twiml.message('You have been unsubscribed.');
      break;
    default:
      twiml.message('Unknown command. Reply HELP for options.');
  }

  return callback(null, twiml);
};
```

### Handling Media (MMS)
```javascript
exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.MessagingResponse();
  const numMedia = parseInt(event.NumMedia, 10) || 0;

  if (numMedia > 0) {
    const mediaUrl = event.MediaUrl0;
    const mediaType = event.MediaContentType0;
    twiml.message(`Received ${numMedia} media file(s) of type: ${mediaType}`);
  } else {
    twiml.message('No media received.');
  }

  return callback(null, twiml);
};
```

### Status Callbacks
```javascript
// Configure when sending:
const message = await client.messages.create({
  to: '+1234567890',
  from: context.TWILIO_PHONE_NUMBER,
  body: 'Hello!',
  statusCallback: 'https://your-domain.com/messaging/status'
});

// Status handler:
exports.handler = async (context, event, callback) => {
  const status = event.MessageStatus;
  const messageSid = event.MessageSid;

  console.log(`Message ${messageSid} status: ${status}`);

  return callback(null, { success: true });
};
```

## Character Limits

- SMS: 160 characters (GSM-7 encoding) or 70 characters (UCS-2 for Unicode)
- Concatenated SMS: Up to 1600 characters (split into segments)
- MMS: Subject line up to 40 characters, body varies by carrier

## Testing Messaging Functions

Tests should use real Twilio APIs:
1. For webhook handlers, test TwiML generation
2. For send functions, use real API calls to test phone numbers
3. Use status callbacks to verify delivery

## File Naming Conventions

- `*.js` - Public endpoints (no signature validation)
- `*.protected.js` - Protected endpoints (require valid Twilio signature)
- `*.private.js` - Private functions (not accessible via HTTP)
