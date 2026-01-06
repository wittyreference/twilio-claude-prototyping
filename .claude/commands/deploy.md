# Deployment Helper

Deploy this Twilio serverless project to the specified environment.

## Pre-Deployment Checklist

Before deploying, verify:

1. **All Tests Pass**
   ```bash
   npm test
   npm run test:e2e
   ```

2. **Linting Passes**
   ```bash
   npm run lint
   ```

3. **Environment Variables Set**
   - Check `.env` has all required values
   - For production: verify GitHub Secrets are configured

4. **No Uncommitted Changes**
   ```bash
   git status
   ```

## Deployment Commands

### Deploy to Development
```bash
twilio serverless:deploy --environment dev
```

### Deploy to Production
```bash
twilio serverless:deploy --environment production
```

### Deploy with Specific Profile
```bash
twilio serverless:deploy --environment production --profile my-profile
```

## Post-Deployment Verification

After deployment:

1. **Check Deployment Output**
   - Note the deployed URLs
   - Verify all functions are listed

2. **Test Endpoints**
   - Make test calls/messages
   - Check Twilio debugger for errors

3. **Update Webhook URLs**
   If needed, update phone number webhooks:
   ```bash
   twilio phone-numbers:update +1234567890 \
     --voice-url https://prototype-xxxx.twil.io/voice/incoming-call \
     --sms-url https://prototype-xxxx.twil.io/messaging/incoming-sms
   ```

## Rollback

If issues are found after deployment:

1. **Identify Previous Build**
   ```bash
   twilio serverless:list builds --service-name prototype
   ```

2. **Activate Previous Build**
   ```bash
   twilio serverless:activate --build-sid BU_PREVIOUS_BUILD_SID
   ```

## Environment Target

$ARGUMENTS
