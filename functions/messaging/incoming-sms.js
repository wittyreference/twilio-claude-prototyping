// ABOUTME: Handles incoming SMS messages with an auto-reply.
// ABOUTME: Public endpoint that processes SMS webhooks and responds with TwiML.

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.MessagingResponse();

  const incomingMessage = event.Body || '';
  const fromNumber = event.From;

  const responseText = `Thanks for your message! You said: "${incomingMessage.substring(0, 100)}"`;

  twiml.message(responseText);

  return callback(null, twiml);
};
