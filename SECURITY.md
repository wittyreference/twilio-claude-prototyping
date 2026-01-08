# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### Preferred Method

Use [GitHub's private vulnerability reporting](https://github.com/wittyreference/twilio-claude-prototyping/security/advisories/new) to submit a report.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Resolution Target**: Within 30 days for critical issues

## Scope

### In Scope

- Code in this repository
- Dependencies we control
- CI/CD pipeline vulnerabilities
- Claude Code hooks and commands

### Out of Scope

- Twilio platform vulnerabilities (report to [Twilio Security](https://www.twilio.com/security))
- Third-party dependencies (report upstream, but let us know)
- Social engineering attacks
- Denial of service attacks

## Security Best Practices for Users

When using this template:

1. **Never commit credentials** - Use environment variables for all secrets
2. **Use `.env` files locally** - Keep them in `.gitignore`
3. **Enable Dependabot** - Monitor dependencies for vulnerabilities
4. **Review webhook URLs** - Verify endpoints before deployment
5. **Use protected functions** - Add `.protected.js` suffix for sensitive endpoints
6. **Validate inputs** - Sanitize all user-provided data in webhooks
7. **Rotate credentials** - Regularly rotate API keys and tokens

## Security Features in This Template

- **Pre-commit hooks** block hardcoded credentials
- **GitHub Actions** use least-privilege permissions
- **Dependabot** monitors for vulnerable dependencies
- **CodeQL** scans for security issues
- **Protected functions** require Twilio signature validation
