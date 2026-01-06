// ABOUTME: Processes gathered DTMF or speech input from incoming calls.
// ABOUTME: Protected endpoint that requires valid Twilio request signature.

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();

  const digits = event.Digits;
  const speechResult = event.SpeechResult;

  if (digits) {
    twiml.say(`You pressed ${digits}.`);
  } else if (speechResult) {
    twiml.say(`You said: ${speechResult}`);
  } else {
    twiml.say('No input was detected.');
  }

  twiml.say('Thank you for using our prototype. Goodbye.');
  twiml.hangup();

  return callback(null, twiml);
};
