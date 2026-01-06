# Voice Functions Context

This directory contains Twilio Voice API functions for handling phone calls.

## TwiML Voice Verbs

### Common Verbs
- `<Say>` - Text-to-speech output
- `<Play>` - Play audio file
- `<Gather>` - Collect DTMF or speech input
- `<Dial>` - Connect to another party
- `<Record>` - Record caller audio
- `<Conference>` - Join a conference call
- `<Hangup>` - End the call
- `<Redirect>` - Transfer to another TwiML endpoint
- `<Pause>` - Add silence

### Say Verb Options
```javascript
twiml.say({
  voice: 'Polly.Amy',      // Amazon Polly voice
  language: 'en-GB',       // Language code
  loop: 1                  // Number of times to repeat
}, 'Your message here');
```

### Gather Verb Options
```javascript
twiml.gather({
  input: 'dtmf speech',    // Input types to accept
  timeout: 5,              // Seconds to wait for input
  numDigits: 4,            // Expected DTMF digits
  finishOnKey: '#',        // Key to finish input
  action: '/next-handler', // URL to POST results
  method: 'POST',          // HTTP method
  speechTimeout: 'auto',   // Auto-detect end of speech
  hints: 'yes, no, help'   // Speech recognition hints
});
```

### Dial Verb Options
```javascript
twiml.dial({
  callerId: '+1234567890', // Caller ID to display
  timeout: 30,             // Ring timeout in seconds
  action: '/dial-complete',// Callback URL
  record: 'record-from-answer' // Recording option
}).number('+1987654321');
```

## Voice Webhook Parameters

When Twilio makes a request to your voice webhook, these parameters are included:

| Parameter | Description |
|-----------|-------------|
| `CallSid` | Unique identifier for the call |
| `AccountSid` | Your Twilio Account SID |
| `From` | Caller's phone number (E.164) |
| `To` | Called phone number (E.164) |
| `CallStatus` | Current call status |
| `Direction` | `inbound` or `outbound-api` |
| `CallerName` | Caller name (if available) |
| `FromCity` | Caller's city |
| `FromState` | Caller's state |
| `FromCountry` | Caller's country |

### Gather Callback Parameters
| Parameter | Description |
|-----------|-------------|
| `Digits` | DTMF digits pressed |
| `SpeechResult` | Transcribed speech |
| `Confidence` | Speech recognition confidence (0-1) |

## Common Patterns

### IVR Menu
```javascript
const twiml = new Twilio.twiml.VoiceResponse();
twiml.say('Press 1 for sales, 2 for support.');
twiml.gather({
  numDigits: 1,
  action: '/ivr-handler'
});
twiml.redirect('/voice/incoming-call'); // No input, restart
```

### Call Forwarding
```javascript
const twiml = new Twilio.twiml.VoiceResponse();
twiml.dial({
  callerId: event.To,
  timeout: 20
}).number('+1234567890');
twiml.say('The person you called is unavailable.');
```

### Voicemail
```javascript
const twiml = new Twilio.twiml.VoiceResponse();
twiml.say('Please leave a message after the beep.');
twiml.record({
  maxLength: 60,
  action: '/recording-complete',
  transcribe: true,
  transcribeCallback: '/transcription-ready'
});
```

## File Naming Conventions

- `*.js` - Public endpoints (no signature validation)
- `*.protected.js` - Protected endpoints (require valid Twilio signature)
- `*.private.js` - Private functions (not accessible via HTTP)

## Testing Voice Functions

Tests should use real Twilio APIs. Test TwiML generation by:
1. Calling the handler with test context/event
2. Verifying the TwiML string contains expected elements
3. For integration tests, use Twilio's API to make test calls
