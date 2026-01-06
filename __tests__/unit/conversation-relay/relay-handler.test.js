// ABOUTME: Unit tests for the relay-handler conversation relay function.
// ABOUTME: Tests TwiML generation for Conversation Relay WebSocket setup.

const Twilio = require('twilio');

global.Twilio = Twilio;

const { handler } = require('../../../functions/conversation-relay/relay-handler');

describe('relay-handler', () => {
  let context;
  let event;
  let callback;

  beforeEach(() => {
    context = {
      ...global.createTestContext(),
      CONVERSATION_RELAY_URL: 'wss://test-server.com/relay'
    };
    event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      To: '+15559876543'
    });
    callback = jest.fn();
  });

  it('should return valid TwiML response', async () => {
    await handler(context, event, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response).toBeDefined();
  });

  it('should include Connect element', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<Connect>');
  });

  it('should include ConversationRelay element', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<ConversationRelay');
  });

  it('should use configured WebSocket URL', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('url="wss://test-server.com/relay"');
  });

  it('should configure voice setting', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('voice="Polly.Amy"');
  });

  it('should enable transcription provider', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('transcriptionProvider="google"');
  });

  it('should enable interruptible mode', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('interruptible="true"');
  });

  it('should enable DTMF detection', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('dtmfDetection="true"');
  });

  it('should use fallback URL when not configured', async () => {
    const contextWithoutUrl = {
      ...global.createTestContext(),
      CONVERSATION_RELAY_URL: undefined
    };

    await handler(contextWithoutUrl, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('url="wss://your-websocket-server.com/relay"');
  });
});
