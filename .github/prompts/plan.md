# Planning Prompt

Use this prompt with Claude in Plan Mode to create a detailed implementation plan.

## Context

You are creating an implementation plan for a Twilio serverless prototype. The project uses:

- **Runtime**: Node.js on Twilio Functions
- **Testing**: Jest (unit/integration) + Newman (E2E)
- **Deployment**: Twilio CLI with GitHub Actions CI/CD
- **Development**: TDD approach - tests first

## Planning Requirements

### 1. Understand the Goal
- What is the prototype supposed to do?
- What Twilio services are needed?
- What are the success criteria?

### 2. Define the Architecture
- Which functions are needed?
- What are the webhook flows?
- How do components interact?

### 3. Plan the Implementation
For each feature:
- What tests need to be written?
- What functions need to be created?
- What dependencies are required?

### 4. Identify Risks
- What could go wrong?
- What needs clarification?
- What are the unknowns?

## Plan Output Format

```markdown
# Implementation Plan: [Project Name]

## Overview
Brief description of what we're building.

## Architecture
- Function structure
- Data flow
- External integrations

## Implementation Phases

### Phase 1: [Name]
**Goal**: What this phase accomplishes

**Tasks**:
1. [ ] Task one
   - Tests needed
   - Implementation details
2. [ ] Task two
   - Tests needed
   - Implementation details

**Success Criteria**:
- Criterion one
- Criterion two

### Phase 2: [Name]
[Same structure]

## Test Strategy
- Unit tests for X
- Integration tests for Y
- E2E tests for Z

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk one | High/Med/Low | How to address |

## Questions for the User
- Question one
- Question two
```

---

## Your Planning Request

[Describe what you want to plan]
