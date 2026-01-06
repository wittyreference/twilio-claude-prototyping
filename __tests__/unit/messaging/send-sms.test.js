// ABOUTME: Unit tests for the send-sms protected messaging function.
// ABOUTME: Tests outbound SMS sending via Twilio API.

const { handler } = require('../../../functions/messaging/send-sms.protected');

describe('send-sms handler', () => {
  let context;
  let callback;

  beforeEach(() => {
    context = global.createTestContext();
    callback = jest.fn();
  });

  it('should return error when "to" parameter is missing', async () => {
    const event = global.createTestEvent({
      body: 'Test message'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameters');
  });

  it('should return error when "body" parameter is missing', async () => {
    const event = global.createTestEvent({
      to: '+15551234567'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameters');
  });

  it('should return error when TWILIO_PHONE_NUMBER is not configured', async () => {
    const contextWithoutPhone = {
      ...context,
      TWILIO_PHONE_NUMBER: undefined,
      getTwilioClient: context.getTwilioClient
    };

    const event = global.createTestEvent({
      to: '+15551234567',
      body: 'Test message'
    });

    await handler(contextWithoutPhone, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('TWILIO_PHONE_NUMBER not configured');
  });

  it('should send SMS successfully with valid parameters', async () => {
    if (!context.TWILIO_PHONE_NUMBER || !process.env.TEST_PHONE_NUMBER) {
      console.log('Skipping real SMS test - credentials not configured');
      return;
    }

    const event = global.createTestEvent({
      to: process.env.TEST_PHONE_NUMBER,
      body: 'Test message from Jest'
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response.success).toBe(true);
    expect(response.messageSid).toMatch(/^SM/);
    expect(response.status).toBeDefined();
  });
});
