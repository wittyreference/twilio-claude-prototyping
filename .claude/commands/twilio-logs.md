# Twilio Logs Analyzer

Fetch and analyze recent Twilio debugger logs to identify issues.

## Fetch Logs

Run the following command to get recent logs:

```bash
twilio debugger:logs:list --limit 20
```

For more detailed logs:

```bash
twilio debugger:logs:list --limit 50 --start-date "YYYY-MM-DD"
```

## Analysis Focus

### Error Categories
1. **Authentication Errors**: Invalid credentials, expired tokens
2. **Webhook Failures**: Unreachable URLs, timeouts, invalid TwiML
3. **Rate Limiting**: Too many requests
4. **Invalid Parameters**: Malformed phone numbers, missing required fields
5. **Account Issues**: Insufficient funds, suspended numbers

### For Each Error Found

Provide:
- **Timestamp**: When the error occurred
- **Error Code**: Twilio error code
- **Error Message**: Description of the error
- **Resource**: What was being accessed (call, message, etc.)
- **Likely Cause**: What probably caused this
- **Suggested Fix**: How to resolve it

## Common Twilio Error Codes

| Code | Meaning | Common Fix |
|------|---------|------------|
| 11200 | HTTP retrieval failure | Check webhook URL is accessible |
| 11205 | HTTP connection failure | Verify server is running |
| 11750 | TwiML parse error | Validate TwiML syntax |
| 20003 | Authentication error | Check credentials |
| 21211 | Invalid phone number | Use E.164 format |
| 21408 | Permission denied | Check geo permissions |
| 30003 | Unreachable destination | Verify recipient number |

## Report Format

### Summary
- Total errors found
- Error breakdown by type
- Time range of logs

### Critical Issues
Errors that need immediate attention

### Warnings
Non-critical issues to be aware of

### Recommendations
Actionable steps to improve reliability

## Additional Context

$ARGUMENTS
