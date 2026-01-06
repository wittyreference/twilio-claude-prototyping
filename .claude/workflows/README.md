# Subagent Workflows

This document describes the available workflow patterns for developing Twilio features using Claude Code subagents.

## Available Subagents

| Command | Role | Description |
|---------|------|-------------|
| `/orchestrate` | Workflow Coordinator | Runs full development pipelines automatically |
| `/architect` | Architect | Design review, pattern selection, CLAUDE.md maintenance |
| `/spec` | Specification Writer | Creates detailed technical specifications |
| `/test-gen` | Test Generator | TDD Red Phase - writes failing tests first |
| `/dev` | Developer | TDD Green Phase - implements to pass tests |
| `/review` | Senior Developer | Code review, security audit, approval authority |
| `/test` | Test Runner | Executes and validates test suites |
| `/docs` | Technical Writer | Documentation updates and maintenance |
| `/deploy` | Deployment Helper | Pre/post deployment checks |
| `/twilio-docs` | Documentation Lookup | Searches Twilio documentation |
| `/twilio-logs` | Log Analyzer | Fetches and analyzes Twilio debugger logs |

## Workflow Patterns

### New Feature Pipeline

Full development pipeline for building new Twilio functionality:

```text
/architect ──► /spec ──► /test-gen ──► /dev ──► /review ──► /test ──► /docs
```

**Orchestrated**: `/orchestrate new-feature [description]`

**Manual execution**:

1. `/architect [feature]` - Get architecture review and pattern recommendations
2. `/spec [feature]` - Create detailed technical specification
3. `/test-gen [feature]` - Generate failing tests (TDD Red)
4. `/dev [feature]` - Implement to pass tests (TDD Green)
5. `/review` - Code review and security audit
6. `/test` - Run full test suite
7. `/docs` - Update documentation

### Bug Fix Pipeline

Quick fix pipeline for resolving issues:

```text
/twilio-logs ──► /architect ──► /test-gen ──► /dev ──► /review ──► /test
```

**Orchestrated**: `/orchestrate bug-fix [issue]`

**Manual execution**:

1. `/twilio-logs` - Analyze debugger logs to identify the issue
2. `/architect [diagnosis]` - Determine fix approach
3. `/test-gen [regression]` - Write regression tests
4. `/dev [fix]` - Implement the fix
5. `/review` - Validate the fix
6. `/test` - Verify all tests pass

### Refactor Pipeline

Improve code structure without changing behavior:

```text
/test ──► /architect ──► /dev ──► /review ──► /test
```

**Orchestrated**: `/orchestrate refactor [target]`

**Manual execution**:

1. `/test` - Verify existing tests pass (baseline)
2. `/architect [refactor plan]` - Design the refactoring approach
3. `/dev [refactor]` - Implement changes
4. `/review` - Validate changes
5. `/test` - Confirm behavior unchanged

### Documentation Only

Update documentation without code changes:

```text
/docs
```

**Orchestrated**: `/orchestrate docs-only [scope]`

**Manual execution**:

1. `/docs [scope]` - Update specified documentation

### Security Audit

Review code for security issues:

```text
/review ──► /dev ──► /test
```

**Orchestrated**: `/orchestrate security-audit [scope]`

**Manual execution**:

1. `/review security [scope]` - Security-focused code review
2. `/dev [fixes]` - Implement security fixes (if needed)
3. `/test` - Validate fixes

## Standalone vs Orchestrated

All subagents work independently. Choose the approach that fits your workflow:

### Orchestrated Mode

Use `/orchestrate` when:

- Building a complete new feature
- Following a standard workflow pattern
- Want automated sequencing and handoffs
- Working on a well-defined task

Example:

```text
/orchestrate new-feature voice IVR menu with speech recognition
```

### Standalone Mode

Run individual subagents when:

- Working on a specific phase only
- Need more control over the process
- Task doesn't fit standard patterns
- Iterating on a particular aspect

Example:

```text
/spec voice IVR menu
# Review output, make adjustments
/test-gen voice IVR menu
# Review tests, refine
/dev voice IVR menu
```

## TDD Enforcement

This project strictly follows Test-Driven Development:

1. **Red Phase** (`/test-gen`): Write failing tests first
2. **Green Phase** (`/dev`): Write minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

The `/dev` subagent will verify that failing tests exist before implementing. If no tests exist, it will suggest running `/test-gen` first.

## Handoff Protocol

Each subagent suggests the next logical step:

| After | Suggests |
|-------|----------|
| `/architect` | `/spec` for detailed specification |
| `/spec` | `/test-gen` for test generation |
| `/test-gen` | `/dev` for implementation |
| `/dev` | `/review` for code review |
| `/review` (APPROVED) | `/test` for final validation |
| `/review` (NEEDS_CHANGES) | `/dev` for fixes |
| `/test` | `/docs` for documentation |

## Examples

### Example 1: Add Voice IVR

```text
# Full orchestrated pipeline
/orchestrate new-feature Add a voice IVR menu that routes callers to sales or support

# Or manually
/architect voice IVR with department routing
/spec voice IVR with Gather verb for digit input
/test-gen voice IVR handler
/dev voice IVR handler
/review
/test
/docs
```

### Example 2: Fix SMS Webhook Bug

```text
# Orchestrated
/orchestrate bug-fix SMS webhook returning 500 error for empty body

# Or manually
/twilio-logs
/test-gen regression test for empty SMS body
/dev fix empty body handling in messaging webhook
/review
/test
```

### Example 3: Add Verification Feature

```text
# Start with architecture review
/architect phone verification using Twilio Verify

# Get detailed spec
/spec phone verification with SMS channel

# Generate tests for the feature
/test-gen verify send-code function

# Implement to pass tests
/dev verify send-code function

# Code review
/review

# Run all tests
/test

# Update docs
/docs
```

## Best Practices

1. **Always start with `/architect`** for new features to ensure proper design
2. **Use `/spec`** to clarify requirements before writing code
3. **Never skip `/test-gen`** - tests must exist before implementation
4. **Run `/review`** before merging any significant changes
5. **Keep `/docs`** updated as features evolve
6. **Use `/twilio-logs`** when debugging production issues
