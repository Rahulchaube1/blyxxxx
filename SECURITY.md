# Blyx Security Policy

Blyx is experimental alpha software. Security reports are welcome for the compiler, runtime, libraries, tooling, build/release infrastructure, and official project services.

## Supported versions

| Version | Support |
| --- | --- |
| Current alpha development branch | Best effort |
| Older releases | Not guaranteed |

Because Blyx is pre-1.0, security fixes and compatibility guarantees may change between releases.

## Reporting a vulnerability

**Do not disclose security-sensitive vulnerabilities in a public GitHub issue.**

Please report vulnerabilities privately to:

- `security@blyx-lang.space`

Include, where possible:

- a clear description of the issue and impact;
- a minimal reproduction or proof of concept;
- affected Blyx version or Git commit;
- operating system and architecture;
- relevant compiler/tool versions;
- any suggested mitigation.

## Response

The maintainers will assess the report, determine affected components, and coordinate a fix and disclosure when appropriate.

Security fixes may require changes to experimental APIs or behavior. Because Blyx is alpha software, users should not assume production-grade security guarantees for unreleased or experimental components.

## Supply-chain issues

Reports involving dependencies, release artifacts, CI credentials, package distribution, or compromised project infrastructure should also use the private security contact above.
