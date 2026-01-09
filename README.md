# Twilio Claude Code Prototyping Template

A GitHub template repository optimized for rapid Twilio CPaaS prototyping with Claude Code.

## Features

- **Twilio Serverless Functions** - Pre-configured for Voice, Messaging, Conversation Relay, Verify, Sync, TaskRouter, and Messaging Services
- **Test-Driven Development** - Jest for unit/integration tests, Newman for E2E
- **CI/CD Pipeline** - GitHub Actions for testing and deployment
- **Claude Code Optimized** - Custom slash commands, CLAUDE.md hierarchy, CLI reference, and specialized subagents

## Quick Start

> **New to this template?** See [WALKTHROUGH.md](WALKTHROUGH.md) for a comprehensive guide that walks you through building your first Twilio Voice app using the full AI-assisted pipeline in about 20 minutes.

### Prerequisites

- Node.js 18-22 installed (Twilio Serverless does not support versions beyond 22)
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
│   ├── sync/                # Real-time state synchronization
│   ├── taskrouter/          # Task routing to workers
│   ├── messaging-services/  # Sender pools, compliance
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

### Sync

Real-time state synchronization across devices:

```javascript
// functions/sync/store-state.protected.js
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const doc = await client.sync.v1
    .services(context.TWILIO_SYNC_SERVICE_SID)
    .documents.create({
      uniqueName: `call-${event.CallSid}`,
      data: { stage: 'greeting', selections: [] },
      ttl: 3600
    });
  return callback(null, { success: true, sid: doc.sid });
};
```

### TaskRouter

Skills-based routing to workers and agents:

```javascript
// functions/taskrouter/create-task.protected.js
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const task = await client.taskrouter.v1
    .workspaces(context.TWILIO_TASKROUTER_WORKSPACE_SID)
    .tasks.create({
      workflowSid: context.TWILIO_TASKROUTER_WORKFLOW_SID,
      attributes: JSON.stringify({ type: 'support', language: 'english' })
    });
  return callback(null, { success: true, taskSid: task.sid });
};
```

### Messaging Services

Sender pools, geographic matching, and A2P compliance:

```javascript
// functions/messaging-services/send-campaign.protected.js
exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const message = await client.messages.create({
    to: event.to,
    messagingServiceSid: context.TWILIO_MESSAGING_SERVICE_SID,
    body: event.body
  });
  return callback(null, { success: true, sid: message.sid });
};
```

## Claude Code Integration

This template is optimized for use with Claude Code. It includes:

> **Step-by-step guide**: See [WALKTHROUGH.md](WALKTHROUGH.md) for a hands-on tutorial covering the full pipeline from idea to working application.

### Two Development Workflows

Choose based on your project needs:

| Workflow | Best For | How It Works |
|----------|----------|--------------|
| **Document-Driven** | Complex projects, team collaboration, pause/resume | Use `.github/prompts/` templates to create artifacts |
| **Subagent Pipeline** | Rapid prototyping, quick iterations | Use `/slash` commands for interactive development |
| **Hybrid** (Recommended) | Production features | Documents for planning, subagents for execution |

See [WALKTHROUGH.md Section 3](WALKTHROUGH.md#3-choosing-your-workflow) for detailed guidance on choosing your workflow.

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
- Subdirectory `CLAUDE.md` files provide API-specific context (Voice, Messaging, Verify, Sync, TaskRouter, Messaging Services)
- `.claude/references/twilio-cli.md` provides comprehensive CLI command reference to reduce token usage

### Context Engineering Skills

The template includes skills for managing context in long development sessions:

| Skill | Purpose |
|-------|---------|
| `context-fundamentals.md` | Core principles for context management |
| `context-compression.md` | Summarize TwiML, payloads, and conversation history |
| `multi-agent-patterns.md` | Orchestration strategies for complex features |
| `memory-systems.md` | Track state across webhook invocations |

Use `/context summarize` to compress context during long sessions, or `/context load` to expand context for new tasks.

### Agent-Assisted Pipeline (Document-Driven Workflow)

Located in `.github/prompts/`, these templates create persistent artifacts for complex projects:

| Template | Purpose | Creates |
|----------|---------|---------|
| `brainstorm.md` | Explore ideas, select Twilio APIs | Concept document |
| `plan.md` | Structure implementation phases | `prompt_plan.md`, `todo.md` |
| `spec.md` | Detail function specifications | Specification document |
| `execute.md` | Guide TDD implementation | Code with task tracking |

Use these when you need shareable documents, team review, or pause/resume capability.

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

### In This Repository

- [WALKTHROUGH.md](WALKTHROUGH.md) - Comprehensive pipeline tutorial (start here!)
- [.claude/workflows/README.md](.claude/workflows/README.md) - Detailed subagent workflow documentation
- [.claude/references/twilio-cli.md](.claude/references/twilio-cli.md) - Twilio CLI command reference
- [CLAUDE.md](CLAUDE.md) - Project standards and AI agent instructions

### External Documentation

- [Twilio Functions Documentation](https://www.twilio.com/docs/serverless/functions-assets/functions)
- [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli)
- [Claude Code](https://claude.ai/code)
