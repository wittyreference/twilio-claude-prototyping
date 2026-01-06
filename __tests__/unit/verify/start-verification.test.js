// ABOUTME: Unit tests for the start-verification protected function.
// ABOUTME: Tests verification initiation via Twilio Verify API.

const { handler } = require('../../../functions/verify/start-verification.protected');

describe('start-verification handler', () => {
  let context;
  let callback;

  beforeEach(() => {
    context = {
      ...global.createTestContext(),
      TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID || 'VA_TEST_SID'
    };
    callback = jest.fn();
  });

  it('should return error when "to" parameter is missing', async () => {
    const event = global.createTestEvent({
      channel: 'sms'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameter: to');
  });

  it('should return error when TWILIO_VERIFY_SERVICE_SID is not configured', async () => {
    const contextWithoutService = {
      ...global.createTestContext(),
      TWILIO_VERIFY_SERVICE_SID: undefined
    };

    const event = global.createTestEvent({
      to: '+15551234567'
    });

    await handler(contextWithoutService, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('TWILIO_VERIFY_SERVICE_SID not configured');
  });

  it('should return error for invalid channel', async () => {
    const event = global.createTestEvent({
      to: '+15551234567',
      channel: 'invalid_channel'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Invalid channel');
  });

  it('should default to SMS channel when not specified', async () => {
    if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
      console.log('Skipping real Verify test - TWILIO_VERIFY_SERVICE_SID not configured');
      return;
    }

    const event = global.createTestEvent({
      to: '+15005550006'
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response.success).toBe(true);
    expect(response.channel).toBe('sms');
  });

  it('should start verification with SMS channel', async () => {
    if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
      console.log('Skipping real Verify test - TWILIO_VERIFY_SERVICE_SID not configured');
      return;
    }

    const event = global.createTestEvent({
      to: '+15005550006',
      channel: 'sms'
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response.success).toBe(true);
    expect(response.status).toBe('pending');
  });

  it('should start verification with call channel', async () => {
    if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
      console.log('Skipping real Verify test - TWILIO_VERIFY_SERVICE_SID not configured');
      return;
    }

    const event = global.createTestEvent({
      to: '+15005550006',
      channel: 'call'
    });

    await handler(context, event, callback);

    const [error, response] = callback.mock.calls[0];
    expect(error).toBeNull();
    expect(response.success).toBe(true);
  });
});
