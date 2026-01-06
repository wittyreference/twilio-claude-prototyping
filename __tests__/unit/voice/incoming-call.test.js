// ABOUTME: Unit tests for the incoming-call voice function.
// ABOUTME: Tests TwiML generation for incoming call handling.

const Twilio = require('twilio');

global.Twilio = Twilio;

const { handler } = require('../../../functions/voice/incoming-call');

describe('incoming-call handler', () => {
  let context;
  let event;
  let callback;

  beforeEach(() => {
    context = global.createTestContext();
    event = global.createTestEvent({
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      To: '+15559876543',
      CallStatus: 'ringing',
      Direction: 'inbound'
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

  it('should include a Say verb with greeting', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<Say');
    expect(twiml).toContain('Welcome to the Twilio prototype');
  });

  it('should include a Gather verb for user input', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<Gather');
    expect(twiml).toContain('input="dtmf speech"');
    expect(twiml).toContain('action="/voice/gather-input"');
  });

  it('should include fallback message for no input', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('We did not receive any input');
  });

  it('should use Polly.Amy voice', async () => {
    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('voice="Polly.Amy"');
  });
});
