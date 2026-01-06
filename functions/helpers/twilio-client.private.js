// ABOUTME: Shared Twilio client initialization helper for serverless functions.
// ABOUTME: Provides a consistent way to get an authenticated Twilio client across all functions.

const Twilio = require('twilio');

function getTwilioClient(context) {
  if (context.TWILIO_API_KEY && context.TWILIO_API_SECRET) {
    return new Twilio(
      context.TWILIO_API_KEY,
      context.TWILIO_API_SECRET,
      { accountSid: context.TWILIO_ACCOUNT_SID }
    );
  }
  return new Twilio(context.TWILIO_ACCOUNT_SID, context.TWILIO_AUTH_TOKEN);
}

module.exports = { getTwilioClient };
