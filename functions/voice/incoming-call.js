// ABOUTME: Handles incoming voice calls with a basic TwiML response.
// ABOUTME: Public endpoint that responds with a greeting and gathers user input.

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.say(
    { voice: 'Polly.Amy', language: 'en-GB' },
    'Welcome to the Twilio prototype. Please press a number or speak your request.'
  );

  twiml.gather({
    input: 'dtmf speech',
    timeout: 5,
    numDigits: 1,
    action: '/voice/gather-input',
    method: 'POST'
  });

  twiml.say('We did not receive any input. Goodbye.');

  return callback(null, twiml);
};
