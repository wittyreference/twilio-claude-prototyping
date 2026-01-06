// ABOUTME: Initiates phone number verification using Twilio Verify.
// ABOUTME: Protected endpoint that sends a verification code via SMS or call.

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  const { to, channel = 'sms' } = event;

  if (!to) {
    return callback(null, {
      success: false,
      error: 'Missing required parameter: to'
    });
  }

  const serviceSid = context.TWILIO_VERIFY_SERVICE_SID;

  if (!serviceSid) {
    return callback(null, {
      success: false,
      error: 'TWILIO_VERIFY_SERVICE_SID not configured'
    });
  }

  const validChannels = ['sms', 'call', 'email'];
  if (!validChannels.includes(channel)) {
    return callback(null, {
      success: false,
      error: `Invalid channel. Must be one of: ${validChannels.join(', ')}`
    });
  }

  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      to,
      channel
    });

  return callback(null, {
    success: true,
    status: verification.status,
    channel: verification.channel,
    to: verification.to
  });
};
