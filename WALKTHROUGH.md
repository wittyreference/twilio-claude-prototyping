# Build Your First Twilio Voice App in Minutes

## The Claude Code Pipeline Walkthrough

**From Idea to Working Speech Recognition Prototype Using AI-Assisted Development**

---

```
+------------------------------------------------------------------+
|                      MINUTES, NOT HOURS                           |
|                                                                   |
|  Traditional approach: 4-8 hours                                  |
|  - Research Twilio docs                                           |
|  - Write TwiML handlers from scratch                              |
|  - Debug webhook configurations                                   |
|  - Write tests manually                                           |
|  - Review your own code                                           |
|                                                                   |
|  Claude Code Pipeline: 15-30 minutes                              |
|  - Describe what you want                                         |
|  - Let specialized AI agents handle the details                   |
|  - Review and deploy                                              |
+------------------------------------------------------------------+
```

---

## Who This Guide Is For

This guide is for developers who:

- Are comfortable with command line operations
- Prefer not to inspect code directly
- Want to understand the *process*, not write code manually
- Want to prototype working Twilio applications quickly

By the end of this walkthrough, you'll understand how to use this repository's AI-powered pipeline to build Twilio applications in minutes instead of hours.

---

## Table of Contents

1. [Introduction and Prerequisites](#1-introduction-and-prerequisites)
2. [Understanding the Pipeline](#2-understanding-the-pipeline)
3. [Choosing Your Workflow](#3-choosing-your-workflow)
4. [Phase 1: Brainstorming Your Idea](#4-phase-1-brainstorming-your-idea)
5. [Phase 2: Planning the Implementation](#5-phase-2-planning-the-implementation)
6. [Phase 3: Test-Driven Development](#6-phase-3-test-driven-development)
7. [Phase 4: Review and Quality Gates](#7-phase-4-review-and-quality-gates)
8. [Hooks: Your Safety Net](#8-hooks-your-safety-net)
9. [Running the Full Example](#9-running-the-full-example)
10. [Advanced Topics](#10-advanced-topics)
11. [Quick Reference](#11-quick-reference)
- [Appendix A: Files Created](#appendix-a-files-created)
- [Appendix B: Reference Links](#appendix-b-reference-links)

---

## 1. Introduction and Prerequisites

### What You Will Build

In this walkthrough, you'll build a **"Speech Parrot"** application - a phone number you can call that:

1. Answers with a greeting
2. Listens to what you say
3. Repeats your words back to you

It's simple, but it demonstrates the core pattern for voice AI applications: capture input, process it, respond.

### How It Works

```
                         YOUR SPEECH PARROT APP

     +--------+           +----------------+           +-----------+
     |  You   |   Call    |    Twilio      |  Webhook  |  Claude   |
     | (Phone)|---------->| Phone Number   |---------->|   Code    |
     +--------+           +----------------+           |  Created  |
         ^                                             | Functions |
         |                                             +-----------+
         |   "Hello world!"                                  |
         |                                                   v
         |                                 +---------------------------+
         |                                 |  1. <Gather> captures     |
         |                                 |     your speech           |
         +---------------------------------+  2. <Say> repeats it      |
              "You said: Hello world!"     |     back to you           |
                                           +---------------------------+
```

### Key Terms

Before we start, let's define a few terms you'll encounter:

| Term | What It Means |
|------|---------------|
| **TwiML** | Twilio Markup Language - XML instructions that tell Twilio what to do with calls and messages |
| **Webhook** | A URL that Twilio calls when something happens (like receiving a phone call) |
| **`<Gather>`** | A TwiML verb that captures caller input - either speech or button presses (DTMF) |
| **`<Say>`** | A TwiML verb that converts text to speech and plays it to the caller |
| **Subagent** | A specialized AI assistant that handles specific tasks (like writing tests or reviewing code) |

### Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js 18-22** installed (Twilio Serverless does not support versions beyond 22)
- [ ] **Twilio CLI** installed (`npm install -g twilio-cli`)
- [ ] **Twilio Serverless plugin** installed (`twilio plugins:install @twilio-labs/plugin-serverless`)
- [ ] **Twilio account** with Account SID and Auth Token
- [ ] **Claude Code** installed and configured
- [ ] This repository cloned locally
- [ ] **ngrok** (optional, for local development with public URLs)

### Two Development Approaches

This template supports two ways to develop and test:

| Approach | Best For | How It Works |
|----------|----------|--------------|
| **Local + ngrok** | Rapid iteration, debugging | Run locally, expose via ngrok tunnel |
| **Twilio Serverless** | Production-like testing, deployment | Deploy to Twilio's serverless platform |

You can use either or both. Most developers start with **local + ngrok** for fast iteration, then use **Twilio Serverless** for deployment.

### Verify Your Setup

Run these commands to verify everything is ready:

```bash
# Check Node.js version (need 18-22)
node --version
# Expected: v18.x.x, v20.x.x, or v22.x.x

# Check Twilio CLI
twilio --version
# Expected: twilio-cli/x.x.x

# Check Serverless plugin is installed
twilio plugins
# Expected: @twilio-labs/plugin-serverless listed

# Check Claude Code
claude --version
# Expected: claude-code/x.x.x

# Optional: Check ngrok (for local development)
ngrok --version
# Expected: ngrok/x.x.x
```

### Project Setup

```bash
# Navigate to your project
cd twilio-claude-prototyping

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Twilio credentials
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Verify credentials are set
grep TWILIO_ACCOUNT_SID .env
# Should show your Account SID (starting with AC)
```

Once verified, you're ready to start the pipeline.

---

## 2. Understanding the Pipeline

### The Four-Phase Pipeline

Building with Claude Code follows a structured pipeline. Each phase produces artifacts that feed into the next:

```
+=============================================================================+
|                          THE PROTOTYPING PIPELINE                            |
+=============================================================================+

  PHASE 1: BRAINSTORM           PHASE 2: PLAN               PHASE 3: SPEC
  +------------------+          +------------------+         +------------------+
  |                  |          |                  |         |                  |
  |  "What problem   |   --->   |  "How will we    |  --->   |  "Exactly what   |
  |   are we         |          |   structure      |         |   will each      |
  |   solving?"      |          |   the work?"     |         |   piece do?"     |
  |                  |          |                  |         |                  |
  +------------------+          +------------------+         +------------------+
          |                            |                            |
          v                            v                            v
     Concept &                    Architecture &               Technical
     API Selection                Task Breakdown              Specification


                              PHASE 4: EXECUTE
                    +------------------------------------+
                    |                                    |
                    |   Subagents do the actual work:    |
                    |                                    |
                    |   /test-gen --> /dev --> /review   |
                    |                                    |
                    +------------------------------------+
                                     |
                                     v
                            Working Application!
```

### Your AI Development Team

When you use this pipeline, you have access to a team of specialized AI agents. Think of them as colleagues you delegate to:

```
+=============================================================================+
|                          YOUR AI DEVELOPMENT TEAM                            |
+=============================================================================+

    PLANNING AGENTS                         EXECUTION AGENTS
    +-------------------+                   +-------------------+
    |    /architect     |                   |    /test-gen      |
    |                   |                   |                   |
    |    "The Designer" |                   |   "Test Writer"   |
    |    Reviews fit,   |                   |   Writes tests    |
    |    picks patterns |                   |   FIRST (TDD)     |
    +-------------------+                   +-------------------+
            |                                        |
            v                                        v
    +-------------------+                   +-------------------+
    |      /spec        |                   |      /dev         |
    |                   |                   |                   |
    |    "The Planner"  |                   |    "Developer"    |
    |    Writes detailed|                   |    Makes tests    |
    |    specifications |                   |    pass           |
    +-------------------+                   +-------------------+
                                                     |
                                                     v
    QUALITY AGENTS                          +-------------------+
    +-------------------+                   |     /review       |
    |      /test        |<------------------|                   |
    |                   |    If approved    |    "Tech Lead"    |
    |   "Test Runner"   |                   |    Code review &  |
    |   Runs all tests  |                   |    security audit |
    +-------------------+                   +-------------------+
            |
            v
    +-------------------+
    |      /docs        |
    |                   |
    |   "Tech Writer"   |
    |   Updates docs    |
    +-------------------+


    UTILITY AGENTS
    +------------------+     +------------------+     +------------------+
    |   /twilio-docs   |     |   /twilio-logs   |     |     /deploy      |
    |                  |     |                  |     |                  |
    |  Searches Twilio |     |  Analyzes debug  |     |  Deploys with    |
    |  documentation   |     |  logs            |     |  safety checks   |
    +------------------+     +------------------+     +------------------+
```

### The Orchestrator

For common workflows, you can use `/orchestrate` to run the entire pipeline automatically:

```
                           /orchestrate new-feature
                                     |
        +--------+--------+---------+---------+---------+---------+--------+
        v        v        v         v         v         v         v        v
    /architect /spec  /test-gen   /dev    /review    /test     /docs
        |        |        |         |         |         |         |
        v        v        v         v         v         v         v
     Design    Spec    Failing   Working  Approved   Tests     Docs
     Review    Doc     Tests     Code     Code       Pass      Updated
```

### Orchestrated vs. Manual

| Approach | When to Use | Command |
|----------|-------------|---------|
| **Orchestrated** | New features, standard workflows | `/orchestrate new-feature [description]` |
| **Manual** | More control, debugging, learning | Run each `/command` individually |

---

## 3. Choosing Your Workflow

This template supports two development workflows. Choose based on your project needs, or combine them for maximum flexibility.

```
+=============================================================================+
|                         TWO PATHS TO WORKING CODE                           |
+=============================================================================+

    DOCUMENT-DRIVEN                           SUBAGENT PIPELINE
    (Artifacts First)                         (Interactive)

    +------------------+                      +------------------+
    |   brainstorm.md  |                      |    /architect    |
    |   (Explore)      |                      |    (Review)      |
    +--------+---------+                      +--------+---------+
             |                                         |
             v                                         v
    +------------------+                      +------------------+
    |     plan.md      |                      |      /spec       |
    |   (Structure)    |                      |    (Specify)     |
    +--------+---------+                      +--------+---------+
             |                                         |
             v     Creates                             v
    +------------------+                      +------------------+
    |   prompt_plan.md |                      |    /test-gen     |
    |   todo.md        |                      |    (Test)        |
    +--------+---------+                      +--------+---------+
             |                                         |
             v                                         v
    +------------------+                      +------------------+
    |    execute.md    |                      |      /dev        |
    |   (Implement)    |                      |    (Build)       |
    +------------------+                      +--------+---------+
                                                       |
                                                       v
                                              +------------------+
                                              |  /review /test   |
                                              |    (Validate)    |
                                              +------------------+

    OUTPUT: Files on disk                     OUTPUT: Working code
    - prompt_plan.md                          - Real-time feedback
    - todo.md                                 - Immediate execution
    - spec.md
```

### Document-Driven Pipeline

Uses prompt templates in `.github/prompts/` to create persistent artifacts that you can review, share, and resume later.

**Files involved:**

| File | Purpose | Creates |
|------|---------|---------|
| `brainstorm.md` | Explore ideas, select Twilio APIs | Concept document |
| `plan.md` | Structure implementation phases | `prompt_plan.md`, `todo.md` |
| `spec.md` | Detail function specifications | Specification document |
| `execute.md` | Guide TDD implementation | Code with task tracking |

**How to use:**

```bash
# Step 1: Brainstorm (add template to context)
# In Claude Code, reference the file:
"Using the template at .github/prompts/brainstorm.md, help me brainstorm
a voice IVR for customer support"

# Step 2: Plan (reference plan.md template)
"Following .github/prompts/plan.md, create an implementation plan"
# Creates: prompt_plan.md, todo.md

# Step 3: Specify (reference spec.md template)
"Using .github/prompts/spec.md as a template, write a specification
for the IVR greeting handler"

# Step 4: Execute (follow execute.md guidelines)
"Following .github/prompts/execute.md, implement the first task in todo.md"
```

**Best for:** Complex multi-phase projects, team collaboration, pause/resume workflows

### Subagent Pipeline

Uses slash commands for real-time, interactive development with immediate feedback.

**Commands involved:**

| Command | Role | Output |
|---------|------|--------|
| `/architect` | Design review | Architecture recommendation |
| `/spec` | Specification | Technical specification |
| `/test-gen` | Test generation | Failing tests (TDD Red) |
| `/dev` | Implementation | Passing tests (TDD Green) |
| `/review` | Code review | Approval or change requests |
| `/test` | Test validation | Test results |
| `/docs` | Documentation | Updated docs |

**How to use:**

```bash
/architect voice IVR for customer support
/spec voice IVR with department routing
/test-gen IVR greeting handler
/dev IVR greeting handler
/review
/test
/docs
```

**Best for:** Rapid prototyping, solo development, quick iterations

### Comparison: Which Workflow?

| Factor | Document-Driven | Subagent Pipeline |
|--------|-----------------|-------------------|
| **Speed** | Slower, deliberate | Fast, iterative |
| **Artifacts** | Creates files on disk | In-memory context |
| **Pause/Resume** | Easy - files persist | Harder - context may be lost |
| **Team collaboration** | Better - shareable docs | Session-bound |
| **Complexity handling** | Better for multi-phase | Better for single features |
| **Traceability** | High - everything documented | Lower - ephemeral |

### Decision Guide

```
                              START
                                |
                                v
                  +---------------------------+
                  | Is this a complex,        |
                  | multi-phase project?      |
                  +-------------+-------------+
                                |
               +----------------+----------------+
               |                                 |
              YES                               NO
               |                                 |
               v                                 v
    +--------------------+            +--------------------+
    | Will you pause and |            | Single feature or  |
    | resume over days?  |            | quick prototype?   |
    +----------+---------+            +----------+---------+
               |                                 |
      +--------+--------+               +--------+--------+
      |                 |               |                 |
     YES               NO              YES               NO
      |                 |               |                 |
      v                 v               v                 v
  +---------+     +-----------+   +-----------+    +-----------+
  | DOCUMENT|     |  HYBRID   |   | SUBAGENT  |    |  HYBRID   |
  | DRIVEN  |     |  APPROACH |   | PIPELINE  |    | (if team) |
  +---------+     +-----------+   +-----------+    +-----------+
```

### Hybrid Approach (Recommended)

Combine both workflows for maximum flexibility: use documents for planning, then switch to subagents for execution.

```
+=============================================================================+
|                           HYBRID WORKFLOW                                   |
+=============================================================================+

    PLANNING PHASE                         EXECUTION PHASE
    (Document-Driven)                      (Subagent Pipeline)

    +------------------+
    |   brainstorm.md  |  Explore
    |   "What to build"|  concept
    +--------+---------+
             |
             v
    +------------------+     +---------------+
    |     plan.md      | --> | prompt_plan   |
    |  "How to build"  |     | .md + todo.md |
    +--------+---------+     +-------+-------+
             |                       |
             |    HANDOFF POINT      |
             +-----------+-----------+
                         |
                         v
               +------------------+
               |   /architect     |
               |   Review plan    |
               +--------+---------+
                        |
                        v
    +------------------+         +------------------+
    |     spec.md      | ------> |      /spec       |
    |   Fill template  |         |  Refine details  |
    +------------------+         +--------+---------+
                                          |
                                          v
                                +------------------+
                                |    /test-gen     |
                                +--------+---------+
                                          |
                                          v
                                +------------------+
                                |      /dev        |
                                +--------+---------+
                                          |
                                          v
                                +------------------+
                                | /review --> /test|
                                +------------------+
```

**How the hybrid approach works:**

1. **Brainstorm with documents**: Reference `.github/prompts/brainstorm.md` to explore your concept
2. **Plan with documents**: Use `plan.md` to create `prompt_plan.md` and `todo.md`
3. **Architect reviews**: `/architect` validates the plan against existing patterns
4. **Specify together**: Reference `spec.md` template, then refine with `/spec`
5. **Execute with subagents**: `/test-gen` → `/dev` → `/review` → `/test` → `/docs`

**Handoff commands:**

```bash
# After creating prompt_plan.md with plan.md template
/architect review the implementation plan in prompt_plan.md

# After creating specification with spec.md template
/spec refine the specification based on spec.md

# Then continue with subagent execution
/test-gen [feature from spec]
/dev [feature]
/review
/test
/docs
```

### Quick Start by Scenario

| Scenario | Recommended Workflow | First Step |
|----------|---------------------|------------|
| Complex multi-week project | Document-Driven | Reference `brainstorm.md` |
| Team needs to review design | Document-Driven or Hybrid | Create `prompt_plan.md` |
| Quick prototype (< 1 day) | Subagent Pipeline | `/orchestrate new-feature` |
| Solo rapid iteration | Subagent Pipeline | `/architect [idea]` |
| Resume after long break | Document-Driven | Check `todo.md` |
| Production feature | Hybrid | Documents for plan, subagents for code |

---

## 4. Phase 1: Brainstorming Your Idea

### Starting Claude Code

Open your terminal and start Claude Code in the project directory:

```bash
cd twilio-claude-prototyping
claude
```

### Two Approaches to Brainstorming

Choose based on your needs (see Section 3 for details):

#### Quick Approach (Subagent Pipeline)

Simply describe what you want to build in natural language:

```
> I want to build a phone application where callers can speak
> and the app repeats what they said back to them
```

#### Structured Approach (Document-Driven)

For more complex projects, reference the brainstorm template:

```
> Using the template at .github/prompts/brainstorm.md, help me brainstorm
> a phone application where callers can speak and the app repeats it back
```

This produces a more detailed concept document you can save and share.

### What Happens Behind the Scenes

When you describe your idea, Claude:

1. Analyzes your request against Twilio capabilities
2. Identifies which Twilio APIs are needed
3. Considers how the feature fits the existing architecture
4. Produces a structured concept

### What Claude Produces

You'll see output like this:

```
### Concept: Speech Parrot

**Problem Statement**
Users need a simple voice application to test speech recognition
and hear their words repeated back.

**Solution Overview**
A Twilio Voice application using two TwiML verbs:
- <Gather> with speech input to capture what the caller says
- <Say> to speak the captured text back to the caller

**Twilio APIs Used**
- Voice API: Handle incoming calls with webhooks
- TwiML: <Gather> for speech input, <Say> for text-to-speech

**Key Features**
1. Answer incoming calls with a greeting
2. Prompt the caller to speak
3. Capture caller speech using <Gather>
4. Repeat the captured speech back using <Say>

**Technical Considerations**
- Will need two webhook handlers (greeting + response)
- Speech recognition timeout handling
- Error case if no speech detected

**Next Steps**
Ready for architecture review with /architect
```

### Saving Your Concept (Document-Driven Workflow)

If using the document-driven approach, save the concept output to a file for later reference:

```
> Please save this concept to docs/speech-parrot-concept.md
```

This creates an artifact you can review with teammates or resume later.

### Reference

The brainstorming structure comes from `.github/prompts/brainstorm.md`. For the document-driven workflow, you can reference this template directly to get more structured output.

---

## 5. Phase 2: Planning the Implementation

### Invoking the Architect

Before writing code, have the architect review your concept for architectural fit:

```
/architect speech capture and playback voice application
```

### What Happens Behind the Scenes

The architect subagent:

1. Loads relevant context (`functions/voice/CLAUDE.md`)
2. Reviews existing patterns in the codebase
3. Determines where new files should go
4. Selects appropriate access levels (public/protected/private)
5. Identifies which Twilio services are needed

### Architecture Review Output

You'll see a structured review:

```
## Architecture Review: Speech Parrot

### Summary
A voice application with two handlers: one for initial greeting
and speech capture, one for processing and repeating the captured speech.

### Recommendation: PROCEED

### Domain Placement
- **Directory**: `functions/voice/`
- **Access Level**: public (Twilio webhook)
- **Reason**: Standard voice webhook pattern

### Patterns to Use
1. Voice TwiML response pattern - see functions/voice/CLAUDE.md
2. Action URL for webhook chaining

### Twilio Services Required
- Voice API: Incoming call webhooks

### Environment Variables Needed
- None beyond standard credentials

### Next Step
Ready for /spec to create detailed specification.
```

### Creating the Specification

Once architecture is approved, create the detailed specification:

```
/spec voice speech parrot with Gather and Say
```

### Specification Structure

The spec document is comprehensive:

```
+=============================================================================+
|                         SPECIFICATION DOCUMENT                               |
+=============================================================================+
|                                                                             |
|   OVERVIEW                                                                  |
|   +---------------------------------------------------------------------+   |
|   | What: Voice app that echoes caller speech                          |   |
|   | Why: Demonstrates <Gather> and <Say> verbs                         |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
|   USER STORY                                                                |
|   +---------------------------------------------------------------------+   |
|   | As a caller, I want to speak into the phone                        |   |
|   | so that I can hear my words repeated back to me                    |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
|   FUNCTION SPECIFICATIONS                                                   |
|   +--------------------------------+ +----------------------------------+   |
|   | speech-parrot.js               | | speech-response.js               |   |
|   |                                | |                                  |   |
|   | - Public endpoint              | | - Public endpoint                |   |
|   | - Greets caller                | | - Receives SpeechResult          |   |
|   | - Uses <Gather speech>         | | - Uses <Say> to repeat           |   |
|   | - Action -> response handler   | |                                  |   |
|   +--------------------------------+ +----------------------------------+   |
|                                                                             |
|   DATA FLOW                                                                 |
|   +---------------------------------------------------------------------+   |
|   | 1. Call comes in -> speech-parrot.js                               |   |
|   | 2. <Gather> prompts caller and captures speech                     |   |
|   | 3. Twilio POSTs SpeechResult to speech-response.js                 |   |
|   | 4. <Say> repeats the transcribed text to caller                    |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
|   TEST REQUIREMENTS                                                         |
|   +---------------------------------------------------------------------+   |
|   | Unit: TwiML structure, verb attributes                             |   |
|   | Integration: Handler chain with mocked Twilio event                |   |
|   | E2E: Full webhook simulation                                       |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
+=============================================================================+
```

### Reference

The specification format comes from `.github/prompts/spec.md`. The spec becomes the "contract" that guides implementation.

---

## 6. Phase 3: Test-Driven Development

### The TDD Approach

This project uses **Test-Driven Development (TDD)**. The workflow is:

1. **Write tests FIRST** (they will fail - that's expected!)
2. **Write code** to make tests pass
3. **Refactor** while keeping tests green

```
                    THE TDD CYCLE
                  (Red-Green-Refactor)

                     +-------+
                     |  RED  |  <-- Tests FAIL
                     |       |      (this is expected!)
                     +---+---+
                         |
                         v
              +---------------------+
              |     /test-gen       |
              |                     |
              |  Writes tests that  |
              |  MUST FAIL first    |
              +---------------------+
                         |
                         v
                     +-------+
                     | GREEN |  <-- Tests PASS
                     |       |      (goal achieved!)
                     +---+---+
                         |
                         v
              +---------------------+
              |       /dev          |
              |                     |
              |  Writes just enough |
              |  code to pass tests |
              +---------------------+
                         |
                         v
                    +--------+
                    |REFACTOR|  <-- Clean up code
                    |        |      (tests still pass)
                    +--------+
```

### Generating Tests (The Red Phase)

Generate failing tests with:

```
/test-gen voice speech parrot handlers
```

### What Happens Behind the Scenes

The test generator:

1. Reads the specification
2. Creates test files in `__tests__/unit/voice/` and `__tests__/integration/voice/`
3. Designs tests to verify expected behavior
4. All tests are designed to FAIL (code doesn't exist yet)

### Test Generation Output

```
## Tests Generated

### Files Created
- `__tests__/unit/voice/speech-parrot.test.js` (6 tests)
- `__tests__/unit/voice/speech-response.test.js` (4 tests)
- `__tests__/integration/voice/speech-flow.test.js` (2 tests)

### Test Coverage Summary
| Category          | Count |
|-------------------|-------|
| Happy path        | 4     |
| Input validation  | 3     |
| Error handling    | 3     |
| Edge cases        | 2     |
| **Total**         | **12**|

### Test Status
All tests should FAIL - implementation does not exist yet.

Verify with: npm test

### Ready for: /dev
```

### Verify Tests Fail

Run the tests to confirm they fail (this is expected!):

```bash
npm test
```

You should see output like:

```
FAIL  __tests__/unit/voice/speech-parrot.test.js
  ● Test suite failed to run
    Cannot find module '../../../functions/voice/speech-parrot.js'
```

This is correct! The tests are looking for code that doesn't exist yet.

### Implementing Code (The Green Phase)

Now implement the code to make tests pass:

```
/dev speech parrot handlers
```

### What Happens Behind the Scenes

The developer subagent:

1. Verifies that tests exist and FAIL
2. Reads test expectations to understand required behavior
3. Writes minimal code to pass each test
4. Adds required ABOUTME comments
5. Commits after each piece works

```
+=============================================================================+
|                        /dev IMPLEMENTATION FLOW                              |
+=============================================================================+

    1. VERIFY TESTS EXIST              2. READ EXPECTATIONS
    +------------------------+         +----------------------------+
    |                        |         |                            |
    | npm test               |   -->   | Test says:                 |
    | "speech-parrot"        |         | "should return TwiML       |
    | FAIL (expected)        |         |  with Gather verb"         |
    |                        |         |                            |
    +------------------------+         +----------------------------+
                                                    |
                                                    v
    3. IMPLEMENT MINIMALLY             4. TEST PASSES
    +----------------------------+     +----------------------------+
    |                            |     |                            |
    | Write handler that         |     | npm test                   |
    | creates VoiceResponse      | --> | speech-parrot.test.js      |
    | with Gather verb           |     | PASS!                      |
    |                            |     |                            |
    +----------------------------+     +----------------------------+
                                                    |
                                                    v
    5. COMMIT                          6. NEXT TEST
    +----------------------------+     +----------------------------+
    |                            |     |                            |
    | git commit -m              |     | Repeat for remaining       |
    | "feat: add Gather..."      | --> | failing tests              |
    |                            |     |                            |
    +----------------------------+     +----------------------------+
```

### Verify Tests Pass

After implementation, run tests again:

```bash
npm test
```

You should see all tests passing:

```
PASS  __tests__/unit/voice/speech-parrot.test.js
PASS  __tests__/unit/voice/speech-response.test.js
PASS  __tests__/integration/voice/speech-flow.test.js

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
```

---

## 7. Phase 4: Review and Quality Gates

### Code Review

After implementation, have the code reviewed:

```
/review
```

### What Happens Behind the Scenes

The reviewer checks multiple quality dimensions:

```
+=============================================================================+
|                          /review QUALITY GATE                                |
+=============================================================================+

    CHECKLIST 1: CODE STANDARDS         CHECKLIST 2: TDD COMPLIANCE
    +-----------------------------+     +-----------------------------+
    |                             |     |                             |
    | [ ] ABOUTME comment present |     | [ ] Tests exist             |
    | [ ] Matches existing style  |     | [ ] Tests written FIRST     |
    | [ ] No dead code            |     | [ ] All test types present  |
    | [ ] No console.log          |     | [ ] No mock implementations |
    |                             |     |                             |
    +-----------------------------+     +-----------------------------+
              |                                   |
              v                                   v
    CHECKLIST 3: SECURITY               CHECKLIST 4: TWILIO PATTERNS
    +-----------------------------+     +-----------------------------+
    |                             |     |                             |
    | [ ] No hardcoded creds      |     | [ ] Correct file suffix     |
    | [ ] Input validation        |     | [ ] Uses context.* vars     |
    | [ ] Error messages safe     |     | [ ] TwiML properly formed   |
    |                             |     |                             |
    +-----------------------------+     +-----------------------------+
              |                                   |
              +--------------+  +-----------------+
                             |  |
                             v  v
                     +---------------+
                     |    VERDICT    |
                     +---------------+
                     | APPROVED      | --> Ready for /test
                     | NEEDS_CHANGES | --> Back to /dev
                     | REJECTED      | --> Back to /architect
                     +---------------+
```

### Review Output

```
## Code Review: Speech Parrot Handlers

### Verdict: APPROVED

### Code Standards
- [x] ABOUTME comments present on all new files
- [x] Code style matches existing patterns
- [x] No unnecessary code

### TDD Compliance
- [x] Tests exist for all handlers
- [x] Tests cover happy path and error cases
- [x] No mock implementations used

### Security
- [x] No hardcoded credentials
- [x] Input validation present
- [x] Error messages don't leak sensitive info

### Twilio Patterns
- [x] Functions use correct suffixes
- [x] Environment variables accessed via context
- [x] TwiML responses properly formed

### Suggestions (non-blocking)
- Consider adding timeout handling for <Gather>

### Ready for: /test
```

### Final Test Validation

Run the full test suite:

```
/test
```

Output:

```
## Test Results

### Summary
- Unit Tests: 10 passed, 0 failed
- Integration Tests: 2 passed, 0 failed
- E2E Tests: Ready for manual verification
- Coverage: 94%

### Details
All tests passing. Application ready for deployment.

### Ready for: /docs or /deploy
```

### Documentation Update

Update documentation to reflect the new feature:

```
/docs
```

This updates CLAUDE.md files and ensures all code has proper comments.

---

## 8. Hooks: Your Safety Net

### What Hooks Do

Hooks run automatically to protect you from common mistakes. You don't need to think about them - they just work.

```
+=============================================================================+
|                        HOOKS: AUTOMATIC SAFETY                               |
+=============================================================================+

    BEFORE WRITING CODE                    AFTER WRITING CODE
    (PreToolUse)                           (PostToolUse)
    +---------------------------+          +---------------------------+
    |                           |          |                           |
    |    pre-write-validate     |          |      post-write           |
    |    +-------------------+  |          |    +-------------------+  |
    |    |                   |  |          |    |                   |  |
    |    | Check for         |  |          |    | Run ESLint        |  |
    |    | hardcoded creds   |  |          |    | auto-fix          |  |
    |    | (AC..., SK...)    |  |          |    |                   |  |
    |    +-------------------+  |          |    +-------------------+  |
    |    +-------------------+  |          |                           |
    |    |                   |  |          +---------------------------+
    |    | Require ABOUTME   |  |
    |    | on new functions  |  |          WHEN DONE
    |    |                   |  |          (Stop)
    |    +-------------------+  |          +---------------------------+
    |                           |          |                           |
    +---------------------------+          |      notify-ready         |
                                           |    +-------------------+  |
    BEFORE BASH COMMANDS                   |    |                   |  |
    (PreToolUse)                           |    | Desktop           |  |
    +---------------------------+          |    | notification      |  |
    |                           |          |    |                   |  |
    |    pre-bash-validate      |          |    +-------------------+  |
    |    +-------------------+  |          |                           |
    |    |                   |  |          +---------------------------+
    |    | Block --no-verify |  |
    |    |                   |  |          SUBAGENT TRACKING
    |    +-------------------+  |          (SubagentStop)
    |    +-------------------+  |          +---------------------------+
    |    |                   |  |          |                           |
    |    | Verify tests      |  |          |     subagent-log          |
    |    | before deploy     |  |          |    +-------------------+  |
    |    |                   |  |          |    |                   |  |
    |    +-------------------+  |          |    | Log which agents  |  |
    |                           |          |    | did what          |  |
    +---------------------------+          |    |                   |  |
                                           |    +-------------------+  |
                                           |                           |
                                           +---------------------------+
```

### What Gets Blocked (And Why)

| Blocked Action | Why It's Blocked | What To Do Instead |
|----------------|------------------|-------------------|
| Hardcoded `ACxxxxxxxx` | Credentials in code = security risk | Use `context.TWILIO_ACCOUNT_SID` |
| `git commit --no-verify` | Skips safety checks | Let hooks run normally |
| Force push to main | Could destroy git history | Create a PR instead |
| Deploy with failing tests | Broken code in production | Fix tests first |
| New function without ABOUTME | Documentation required | Add 2-line ABOUTME comment |

### You Don't Need to Do Anything

Hooks run automatically. If something gets blocked, you'll see a clear message explaining why and what to do instead.

### Reference

Hook configuration is in `.claude/settings.json`. Hook scripts are in `.claude/hooks/`.

---

## 9. Running the Full Example

Now let's put it all together. You have two options:

### Option A: Orchestrated Approach (Fastest)

Run the entire pipeline with a single command:

```
/orchestrate new-feature Build a voice app that uses Gather to capture caller speech and Say to repeat it back
```

This automatically runs:

```
+=============================================================================+
|               ORCHESTRATED PIPELINE: ~15-20 MINUTES TOTAL                    |
+=============================================================================+

    TIME      PHASE          WHAT HAPPENS
    ----      -----          ------------

    0:00      /architect     Reviews design, picks patterns
              ~2 min         Output: Architecture recommendation

    2:00      /spec          Writes detailed specification
              ~3 min         Output: Function specs, data flow, tests needed

    5:00      /test-gen      Creates failing tests (TDD Red)
              ~4 min         Output: 12 tests across unit/integration/E2E

    9:00      /dev           Implements code (TDD Green)
              ~5 min         Output: Working handlers, tests passing

    14:00     /review        Code review & security audit
              ~2 min         Output: APPROVED

    16:00     /test          Final test validation
              ~1 min         Output: All tests pass

    17:00     /docs          Updates documentation
              ~2 min         Output: README updated, ABOUTME verified

    ~20 min   DONE!          Working Speech Parrot application
```

### Option B: Manual Approach (More Control)

Run each subagent individually:

```bash
# Step 1: Architecture review
/architect voice app with speech capture and playback

# Step 2: Create specification
/spec voice speech parrot with Gather and Say

# Step 3: Generate tests (TDD Red)
/test-gen speech parrot handlers

# Verify tests fail (expected!)
npm test

# Step 4: Implement (TDD Green)
/dev speech parrot handlers

# Verify tests pass
npm test

# Step 5: Code review
/review

# Step 6: Final test run
/test

# Step 7: Update docs
/docs
```

### Verifying Your Application

Once complete, you can test using either approach:

#### Option A: Local Development with ngrok (Fastest for iteration)

```bash
# Terminal 1: Start local development server
npm start
# Server running at http://localhost:3000

# Terminal 2: Start ngrok tunnel for public URL
ngrok http 3000
```

You'll see output like:

```
ngrok by @inconshreveable
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

Your webhook URL: `https://abc123.ngrok.io/voice/speech-parrot`

#### Option B: Deploy to Twilio Serverless (Production-like)

```bash
# Deploy to Twilio's serverless platform
npm run deploy:dev
# Or use Twilio CLI directly:
twilio serverless:deploy
```

You'll see output like:

```
Deploying functions & assets to the Twilio Runtime
✔ Serverless project successfully deployed

Deployment Details:
Domain: speech-parrot-1234-dev.twil.io
Functions:
  /voice/speech-parrot
  /voice/speech-response
```

Your webhook URL: `https://speech-parrot-1234-dev.twil.io/voice/speech-parrot`

### Configure Twilio Phone Number

1. Log into the [Twilio Console](https://console.twilio.com)
2. Navigate to Phone Numbers > Manage > Active Numbers
3. Select your phone number
4. Under "Voice & Fax", set "A Call Comes In" to:
   - Webhook: Your URL from above (ngrok or serverless domain)
   - HTTP POST

### Test It!

1. Call your Twilio phone number
2. Wait for the greeting
3. Say something after the prompt
4. Hear your words repeated back!

### Which Approach to Use?

| Scenario | Recommended Approach |
|----------|---------------------|
| Rapid iteration, debugging | Local + ngrok |
| Sharing with teammates | Twilio Serverless |
| Production deployment | Twilio Serverless |
| Testing webhook payloads | Local + ngrok (easier to add logging) |

---

## 10. Advanced Topics

### Parallel Subagent Activities

Some debugging workflows run agents in parallel:

```
                      PARALLEL DEBUGGING WORKFLOW

                           Debug Issue
                               |
              +----------------+----------------+
              |                                 |
              v                                 v
       /twilio-logs                         /review
       (Analyze API logs)               (Check code patterns)
              |                                 |
              v                                 v
       "Error 30003:                    "Missing validation
        Unreachable"                    on 'to' parameter"
              |                                 |
              +----------------+----------------+
                               |
                               v
                        Combined Insight:
                  "Add E.164 validation before API call"
                               |
                               v
                   /test-gen (regression test)
                               |
                               v
                          /dev (fix)
```

### Using Skills for Context Management

If sessions get long, use the context command:

```
/context summarize
```

This compresses your conversation history while preserving important decisions.

Available skills in `.claude/skills/`:

| Skill | When to Use |
|-------|-------------|
| `context-fundamentals.md` | Starting long sessions |
| `context-compression.md` | Context getting cluttered |
| `multi-agent-patterns.md` | Complex multi-step features |
| `memory-systems.md` | Tracking state across webhooks |

### Custom Workflows

The pipeline adapts to different scenarios:

```
NEW FEATURE:
  /architect -> /spec -> /test-gen -> /dev -> /review -> /test -> /docs
  Command: /orchestrate new-feature [description]

BUG FIX:
  /twilio-logs -> /architect -> /test-gen -> /dev -> /review -> /test
  Command: /orchestrate bug-fix [issue description]

REFACTOR:
  /test -> /architect -> /dev -> /review -> /test
  Command: /orchestrate refactor [target]

DOCS ONLY:
  /docs
  Command: /docs [scope]

SECURITY AUDIT:
  /review -> /dev (if fixes needed) -> /test
  Command: /orchestrate security-audit
```

---

## 11. Quick Reference

### Command Cheat Sheet

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/orchestrate new-feature [desc]` | Run full pipeline | Starting new features |
| `/orchestrate bug-fix [issue]` | Bug fix pipeline | Fixing broken functionality |
| `/orchestrate refactor [target]` | Refactor pipeline | Code improvements |
| `/architect [topic]` | Design review | Before any new code |
| `/spec [feature]` | Write specification | After architecture approved |
| `/test-gen [feature]` | Generate failing tests | Before implementation |
| `/dev [task]` | Implement code | After tests exist |
| `/review` | Code review | After implementation |
| `/test` | Run all tests | Before deployment |
| `/docs [scope]` | Update documentation | After code complete |
| `/twilio-docs [topic]` | Search Twilio docs | Research questions |
| `/twilio-logs` | Analyze debug logs | Troubleshooting |
| `/deploy [env]` | Deploy to Twilio Serverless | When ready for production |
| `/context [action]` | Manage context | Long sessions |
| `npm start` | Start local dev server | Local development |
| `ngrok http 3000` | Expose local server | Testing with ngrok |
| `twilio serverless:deploy` | Deploy to Twilio | Serverless deployment |

### Pipeline File Locations

| File | Purpose |
|------|---------|
| `.github/prompts/brainstorm.md` | Idea generation template |
| `.github/prompts/plan.md` | Implementation planning template |
| `.github/prompts/spec.md` | Specification template |
| `.github/prompts/execute.md` | Execution guidelines |
| `.claude/workflows/README.md` | Subagent patterns |
| `.claude/commands/orchestrate.md` | Orchestrator definition |
| `.claude/settings.json` | Hook configuration |
| `functions/voice/CLAUDE.md` | Voice API patterns |

### Troubleshooting FAQ

**Q: Tests fail after `/test-gen` - is something wrong?**

A: No! Tests are *supposed* to fail at this stage. This is TDD - you write tests first, then make them pass with `/dev`.

---

**Q: `/review` says NEEDS_CHANGES - what now?**

A: Run `/dev` again to address the issues, then `/review` again. The review output explains what needs to change.

---

**Q: Hook blocked my commit - what happened?**

A: Check the error message. Common causes:
- Missing ABOUTME comment on new function file
- Hardcoded credentials detected
- Using `--no-verify` flag

---

**Q: How do I deploy to production?**

A: Use `/deploy prod` which will:
1. Verify all tests pass
2. Check linting
3. Deploy to Twilio

---

**Q: Can I skip steps in the pipeline?**

A: Yes, when running manually. But skipping `/test-gen` means no TDD protection, and skipping `/review` means no quality gate.

---

## Appendix A: Files Created

When you complete this walkthrough, the pipeline creates:

```
functions/
  voice/
    speech-parrot.js          # Main entry point - greets and gathers
    speech-response.js        # Processes and repeats speech

__tests__/
  unit/
    voice/
      speech-parrot.test.js   # Unit tests for greeting handler
      speech-response.test.js # Unit tests for response handler
  integration/
    voice/
      speech-flow.test.js     # End-to-end flow test
```

---

## Appendix B: Reference Links

### In This Repository

- [README.md](README.md) - Project setup and overview
- [.claude/workflows/README.md](.claude/workflows/README.md) - Detailed workflow documentation
- [functions/voice/CLAUDE.md](functions/voice/CLAUDE.md) - Voice API patterns and TwiML reference

### External Resources

- [Twilio Functions Documentation](https://www.twilio.com/docs/serverless/functions-assets/functions)
- [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit)
- [TwiML Voice Reference](https://www.twilio.com/docs/voice/twiml)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli)
- [ngrok Documentation](https://ngrok.com/docs)
- [Claude Code](https://claude.ai/code)

---

**Congratulations!** You now understand how to use the Claude Code pipeline to build Twilio applications in minutes instead of hours. Start with `/orchestrate new-feature` and describe what you want to build!
