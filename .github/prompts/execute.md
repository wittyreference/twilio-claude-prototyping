# Execution Prompt

Use this prompt when implementing features according to an approved plan.

## Execution Guidelines

### Before Starting
1. Read the approved plan in `prompt_plan.md`
2. Check `todo.md` for current task status
3. Understand the tests that need to be written
4. Review relevant CLAUDE.md files for context

### TDD Workflow

For each task:

```
1. WRITE TEST FIRST
   - Create test file in __tests__/
   - Write failing test for the feature
   - Run test - confirm it fails

2. IMPLEMENT
   - Write minimal code to pass
   - Add ABOUTME comment at file top
   - Run test - confirm it passes

3. REFACTOR
   - Clean up code
   - Ensure tests still pass
   - Match existing code style

4. COMMIT
   - Stage changes
   - Write clear commit message
   - Commit (never use --no-verify)

5. UPDATE TODO
   - Check off completed task
   - Move to next task
```

### Code Standards Checklist

Before committing:
- [ ] ABOUTME comment at file start
- [ ] Tests written and passing
- [ ] No console.log left in code
- [ ] Code matches surrounding style
- [ ] No hardcoded credentials
- [ ] Error handling present

### Commit Message Format

```
[type]: Brief description

- Detail 1
- Detail 2

🤖 Generated with Claude Code
```

Types: feat, fix, test, docs, refactor, chore

### After Completing a Task

1. Mark task complete in `todo.md`
2. Run full test suite: `npm test`
3. Check linting: `npm run lint`
4. Commit with descriptive message
5. Move to next task

### If Blocked

1. Document what's blocking you
2. Ask the user for clarification
3. Don't guess - ask

---

## Current Execution Task

[Describe what you're implementing]
