# Verify Functions Context

This directory contains Twilio Verify API functions for phone number and email verification.

## What is Twilio Verify?

Twilio Verify provides a complete solution for sending and verifying one-time passcodes (OTPs) across multiple channels:
- SMS
- Voice calls
- Email
- WhatsApp
- TOTP (authenticator apps)

## API Overview

### Start Verification
```javascript
const client = context.getTwilioClient();
const verification = await client.verify.v2
  .services(serviceSid)
  .verifications.create({
    to: '+1234567890',
    channel: 'sms'
  });
```

### Check Verification
```javascript
const verificationCheck = await client.verify.v2
  .services(serviceSid)
  .verificationChecks.create({
    to: '+1234567890',
    code: '123456'
  });
```

## Channels

| Channel | Description | Destination Format |
|---------|-------------|-------------------|
| `sms` | SMS text message | E.164 phone number |
| `call` | Voice phone call | E.164 phone number |
| `email` | Email message | Email address |
| `whatsapp` | WhatsApp message | E.164 phone number |

## Verification Status Values

### After Starting Verification
- `pending` - Code has been sent, awaiting verification

### After Checking Code
- `approved` - Code is correct, verification successful
- `pending` - Code is incorrect, still awaiting valid code
- `canceled` - Verification was canceled
- `max_attempts_reached` - Too many incorrect attempts
- `expired` - Verification code has expired

## Configuration Options

### Service Configuration
Create a Verify Service in the Twilio Console with these options:
- **Code Length**: 4-10 digits (default: 6)
- **Code TTL**: 60-600 seconds (default: 600)
- **Lookup Enabled**: Validate phone numbers before sending
- **Skip SMS to Landlines**: Auto-switch landlines to voice
- **Custom Code Enabled**: Allow custom codes for testing

### Start Verification Options
```javascript
const verification = await client.verify.v2
  .services(serviceSid)
  .verifications.create({
    to: '+1234567890',
    channel: 'sms',
    locale: 'en',                    // Message language
    customFriendlyName: 'MyApp',     // Sender name in message
    customMessage: 'Your code is {{code}}', // Custom template
    sendDigits: 'wwww1928',          // DTMF to dial (voice)
    rateLimits: {
      uniqueName: 'end_user_phone_number',
      value: '+1234567890'
    }
  });
```

## Common Patterns

### Basic 2FA Flow
```javascript
// Step 1: Start verification (user requests code)
exports.startVerification = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const { phoneNumber } = event;

  const verification = await client.verify.v2
    .services(context.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: phoneNumber,
      channel: 'sms'
    });

  return callback(null, {
    success: true,
    status: verification.status
  });
};

// Step 2: Check verification (user submits code)
exports.checkVerification = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const { phoneNumber, code } = event;

  const verificationCheck = await client.verify.v2
    .services(context.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: phoneNumber,
      code: code
    });

  if (verificationCheck.status === 'approved') {
    // Grant access, create session, etc.
    return callback(null, { success: true, verified: true });
  }

  return callback(null, { success: false, verified: false });
};
```

### Fallback to Voice
```javascript
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const { phoneNumber, attemptCount = 0 } = event;

  // Use voice after 2 failed SMS attempts
  const channel = attemptCount >= 2 ? 'call' : 'sms';

  const verification = await client.verify.v2
    .services(context.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: phoneNumber,
      channel: channel
    });

  return callback(null, {
    success: true,
    status: verification.status,
    channel: channel
  });
};
```

### Rate Limiting
```javascript
const verification = await client.verify.v2
  .services(serviceSid)
  .verifications.create({
    to: phoneNumber,
    channel: 'sms',
    rateLimits: {
      uniqueName: 'end_user_phone_number',
      value: phoneNumber
    }
  });
```

## Error Handling

### Common Error Codes
| Code | Description |
|------|-------------|
| `60200` | Invalid parameter |
| `60202` | Max send attempts reached |
| `60203` | Max check attempts reached |
| `60212` | Verification expired |
| `60223` | Phone number not valid |

### Error Handling Pattern
```javascript
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  try {
    const verification = await client.verify.v2
      .services(context.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: event.phoneNumber,
        channel: 'sms'
      });

    return callback(null, { success: true, status: verification.status });
  } catch (error) {
    if (error.code === 60202) {
      return callback(null, {
        success: false,
        error: 'Too many attempts. Please wait before trying again.'
      });
    }
    if (error.code === 60223) {
      return callback(null, {
        success: false,
        error: 'Invalid phone number format.'
      });
    }
    throw error;
  }
};
```

## Testing Verify Functions

### Test Phone Numbers
Twilio provides magic phone numbers for testing:
- `+15005550006` - Always succeeds
- `+15005550009` - Always fails

### Test Codes
With Custom Code enabled on your Verify Service:
- Code `123456` works for test numbers in development

### Integration Test Pattern
```javascript
it('should start verification successfully', async () => {
  const context = createTestContext();
  const event = { to: '+15005550006', channel: 'sms' };

  await handler(context, event, callback);

  const [, response] = callback.mock.calls[0];
  expect(response.success).toBe(true);
  expect(response.status).toBe('pending');
});
```

## Environment Variables

```
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Best Practices

1. **Use Rate Limiting**: Prevent abuse by limiting verification attempts per phone number
2. **Implement Retry Logic**: Offer voice fallback after SMS failures
3. **Handle Timeouts**: Codes expire; inform users clearly
4. **Secure Endpoints**: Use `.protected.js` for all verification endpoints
5. **Log Attempts**: Track verification attempts for security monitoring
