// ABOUTME: Sends outbound SMS messages using the Twilio API.
// ABOUTME: Protected endpoint that requires valid Twilio request signature.

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  const { to, body } = event;

  if (!to || !body) {
    return callback(null, {
      success: false,
      error: 'Missing required parameters: to, body'
    });
  }

  const from = context.TWILIO_PHONE_NUMBER;

  if (!from) {
    return callback(null, {
      success: false,
      error: 'TWILIO_PHONE_NUMBER not configured'
    });
  }

  const message = await client.messages.create({
    to,
    from,
    body
  });

  return callback(null, {
    success: true,
    messageSid: message.sid,
    status: message.status
  });
};
