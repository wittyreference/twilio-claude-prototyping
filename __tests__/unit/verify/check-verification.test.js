// ABOUTME: Unit tests for the check-verification protected function.
// ABOUTME: Tests verification code checking via Twilio Verify API.

const { handler } = require('../../../functions/verify/check-verification.protected');

describe('check-verification handler', () => {
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
      code: '123456'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameters');
  });

  it('should return error when "code" parameter is missing', async () => {
    const event = global.createTestEvent({
      to: '+15551234567'
    });

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameters');
  });

  it('should return error when both parameters are missing', async () => {
    const event = global.createTestEvent({});

    await handler(context, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('Missing required parameters');
  });

  it('should return error when TWILIO_VERIFY_SERVICE_SID is not configured', async () => {
    const contextWithoutService = {
      ...global.createTestContext(),
      TWILIO_VERIFY_SERVICE_SID: undefined
    };

    const event = global.createTestEvent({
      to: '+15551234567',
      code: '123456'
    });

    await handler(contextWithoutService, event, callback);

    const [, response] = callback.mock.calls[0];
    expect(response.success).toBe(false);
    expect(response.error).toContain('TWILIO_VERIFY_SERVICE_SID not configured');
  });

  it('should return success false for invalid code', async () => {
    if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
      console.log('Skipping real Verify test - TWILIO_VERIFY_SERVICE_SID not configured');
      return;
    }

    const event = global.createTestEvent({
      to: '+15005550006',
      code: '000000'
    });

    try {
      await handler(context, event, callback);
      const [, response] = callback.mock.calls[0];
      expect(response.success).toBe(false);
    } catch (error) {
      expect(error.code).toBeDefined();
    }
  });
});
