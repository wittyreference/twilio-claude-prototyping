# Twilio Claude Code Prototyping Template

A GitHub template repository optimized for rapid Twilio CPaaS prototyping with Claude Code.

## Features

- **Twilio Serverless Functions** - Pre-configured for Voice, Messaging, Conversation Relay, and Verify
- **Test-Driven Development** - Jest for unit/integration tests, Newman for E2E
- **CI/CD Pipeline** - GitHub Actions for testing and deployment
- **Claude Code Optimized** - Custom slash commands, CLAUDE.md hierarchy, and specialized subagents

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Twilio account with Account SID and Auth Token
- Twilio CLI installed (`npm install -g twilio-cli`)
- Twilio Serverless plugin (`twilio plugins:install @twilio-labs/plugin-serverless`)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/wittyreference/twilio-claude-prototyping.git
   cd twilio-claude-prototyping
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Twilio credentials:

   ```text
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
   ```

4. **Start local development server**

   ```bash
   npm start
   ```

   Your functions will be available at `http://localhost:3000`

5. **Run tests**

   ```bash
   npm test
   ```

## Project Structure

```text
├── .claude/commands/        # Custom slash commands for Claude Code
├── .github/
│   ├── prompts/             # Agent-assisted pipeline prompts
│   └── workflows/           # GitHub Actions CI/CD
├── functions/               # Twilio serverless functions
│   ├── voice/               # Voice call handlers
│   ├── messaging/           # SMS/MMS handlers
│   ├── conversation-relay/  # Real-time voice AI
│   ├── verify/              # Phone verification
│   └── helpers/             # Shared private functions
├── __tests__/               # Test suites
└── postman/                 # Newman E2E collections
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start local development server |
| `npm test` | Run unit and integration tests |
| `npm run test:e2e` | Run Newman E2E tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check for linting errors |
| `npm run deploy:dev` | Deploy to dev environment |
| `npm run deploy:prod` | Deploy to production |

## Twilio Capabilities

### Voice

Handle incoming calls with TwiML:

```javascript
// functions/voice/incoming-call.js
exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Hello from your Twilio prototype!');
  return callback(null, twiml);
};
```

### Messaging

Handle incoming SMS:

```javascript
// functions/messaging/incoming-sms.js
exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.MessagingResponse();
  twiml.message(`You said: ${event.Body}`);
  return callback(null, twiml);
};
```

### Conversation Relay

Connect calls to AI/LLM backends:

```javascript
// functions/conversation-relay/relay-handler.js
exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  const connect = twiml.connect();
  connect.conversationRelay({
    url: 'wss://your-websocket-server.com/relay',
    voice: 'Polly.Amy'
  });
  return callback(null, twiml);
};
```

### Verify

Phone number verification:

```javascript
// functions/verify/start-verification.protected.js
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const verification = await client.verify.v2
    .services(context.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({ to: event.to, channel: 'sms' });
  return callback(null, { success: true, status: verification.status });
};
```

## Claude Code Integration

This template is optimized for use with Claude Code. It includes:

### Custom Slash Commands

**Workflow Orchestration**

- `/orchestrate [workflow] [task]` - Run full development pipelines

**Development Subagents**

- `/architect [topic]` - Design review, pattern selection, CLAUDE.md maintenance
- `/spec [feature]` - Create detailed technical specifications
- `/test-gen [feature]` - Generate failing tests (TDD Red Phase)
- `/dev [task]` - Implement features to pass tests (TDD Green Phase)
- `/review [target]` - Code review with security audit
- `/test [scope]` - Run tests and validate coverage
- `/docs [scope]` - Documentation updates and maintenance

**Utility Commands**

- `/twilio-docs [topic]` - Search Twilio documentation
- `/twilio-logs` - Analyze Twilio debugger logs
- `/deploy [env]` - Deploy with pre/post checks

### Subagent Workflows

Run complete development pipelines with `/orchestrate`:

```text
# New feature
/orchestrate new-feature Add voice IVR menu

# Bug fix
/orchestrate bug-fix SMS webhook returns 500

# Refactor
/orchestrate refactor voice handlers
```

Or run subagents individually in sequence:

```text
/architect ──► /spec ──► /test-gen ──► /dev ──► /review ──► /test ──► /docs
```

See `.claude/workflows/README.md` for detailed workflow documentation.

### Claude Code Hooks

This template includes automated hooks that run during Claude Code sessions:

| Hook | Trigger | Action |
|------|---------|--------|
| **Credential Safety** | Write/Edit | Blocks hardcoded Twilio SIDs and tokens |
| **ABOUTME Enforcement** | Write | Requires ABOUTME comments on new function files |
| **Auto-Lint** | Write/Edit | Runs ESLint with auto-fix on JS files |
| **Git Safety** | Bash | Blocks `--no-verify` and force push to main |
| **Deploy Validation** | Bash | Runs tests and lint before deployment |
| **Notifications** | Stop | Desktop notification when Claude is ready |

**Disabling Hooks**: To disable a hook, remove its entry from `.claude/settings.json`.

### CLAUDE.md Hierarchy

- Root `CLAUDE.md` contains project-wide standards
- Subdirectory `CLAUDE.md` files provide API-specific context

### Agent-Assisted Pipeline

Located in `.github/prompts/`:

- `brainstorm.md` - Ideation template
- `plan.md` - Implementation planning
- `spec.md` - Feature specifications
- `execute.md` - Execution guidelines

## Testing

All tests use real Twilio APIs (no mocks). Ensure your credentials are configured.

### Unit Tests

```bash
npm test
```

### E2E Tests

Start the local server, then run Newman:

```bash
npm start &
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

## Deployment

### Manual Deployment

```bash
# Deploy to dev
npm run deploy:dev

# Deploy to production
npm run deploy:prod
```

### CI/CD

GitHub Actions automatically:

- Runs tests on every push/PR
- Deploys to dev on push to `develop` branch
- Deploys to production on push to `main` branch

Configure these GitHub Secrets:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_API_KEY`
- `TWILIO_API_SECRET`
- `TWILIO_PHONE_NUMBER`
- `TWILIO_VERIFY_SERVICE_SID`

## Function Access Levels

- `*.js` - Public (anyone can call)
- `*.protected.js` - Protected (require valid Twilio signature)
- `*.private.js` - Private (only callable from other functions)

## Contributing

1. Create a feature branch
2. Write tests first (TDD)
3. Implement the feature
4. Ensure all tests pass
5. Create a pull request

## License

MIT

## Resources

- [Twilio Functions Documentation](https://www.twilio.com/docs/serverless/functions-assets/functions)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli)
- [Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit)
- [Claude Code](https://claude.ai/code)
