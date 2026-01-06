// ABOUTME: Checks a verification code submitted by the user.
// ABOUTME: Protected endpoint that validates the code against Twilio Verify.

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  const { to, code } = event;

  if (!to || !code) {
    return callback(null, {
      success: false,
      error: 'Missing required parameters: to, code'
    });
  }

  const serviceSid = context.TWILIO_VERIFY_SERVICE_SID;

  if (!serviceSid) {
    return callback(null, {
      success: false,
      error: 'TWILIO_VERIFY_SERVICE_SID not configured'
    });
  }

  const verificationCheck = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      to,
      code
    });

  const isApproved = verificationCheck.status === 'approved';

  return callback(null, {
    success: isApproved,
    status: verificationCheck.status,
    to: verificationCheck.to,
    channel: verificationCheck.channel
  });
};
