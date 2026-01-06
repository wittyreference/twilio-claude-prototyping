// ABOUTME: Unit tests for the incoming-sms messaging function.
// ABOUTME: Tests TwiML generation for incoming SMS handling.

const Twilio = require('twilio');

global.Twilio = Twilio;

const { handler } = require('../../../functions/messaging/incoming-sms');

describe('incoming-sms handler', () => {
  let context;
  let callback;

  beforeEach(() => {
    context = global.createTestContext();
    callback = jest.fn();
  });

  it('should return valid TwiML response', async () => {
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      To: '+15559876543',
      Body: 'Hello'
    });

    await handler(context, event, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response).toBeDefined();
  });

  it('should echo back the incoming message', async () => {
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      Body: 'Test message'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('Test message');
  });

  it('should handle empty message body', async () => {
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      Body: ''
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response).toBeDefined();
  });

  it('should handle missing body parameter', async () => {
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567'
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response).toBeDefined();
  });

  it('should truncate long messages in response', async () => {
    const longMessage = 'A'.repeat(200);
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      Body: longMessage
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).not.toContain('A'.repeat(200));
    expect(twiml).toContain('A'.repeat(100));
  });

  it('should include Message element in TwiML', async () => {
    const event = global.createTestEvent({
      MessageSid: 'SM1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      Body: 'Hello'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    const twiml = response.toString();
    expect(twiml).toContain('<Message>');
  });
});
