// ABOUTME: Unit tests for the gather-input protected voice function.
// ABOUTME: Tests TwiML generation for processing DTMF and speech input.

const Twilio = require('twilio');

global.Twilio = Twilio;

const { handler } = require('../../../functions/voice/gather-input.protected');

describe('gather-input handler', () => {
  let context;
  let callback;

  beforeEach(() => {
    context = global.createTestContext();
    callback = jest.fn();
  });

  it('should respond to DTMF digit input', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      Digits: '5'
    });

    await handler(context, event, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();

    const twiml = response.toString();
    expect(twiml).toContain('You pressed 5');
  });

  it('should respond to speech input', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      SpeechResult: 'hello world',
      Confidence: '0.95'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('You said: hello world');
  });

  it('should handle no input detected', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('No input was detected');
  });

  it('should end call with hangup', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      Digits: '1'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<Hangup');
  });

  it('should include thank you message', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      Digits: '1'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('Thank you for using our prototype');
  });

  it('should prioritize digits over speech when both present', async () => {
    const event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      Digits: '3',
      SpeechResult: 'three'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('You pressed 3');
    expect(twiml).not.toContain('You said:');
  });
});
