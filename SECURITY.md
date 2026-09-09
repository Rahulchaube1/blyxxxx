# Blyx Security Policy

**Neuroblyx** and the **Blyx Project** take the security of our compiler, runtime, standard libraries, and developer toolchain seriously.

---

## Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported |
| :--- | :--- |
| `0.1.0-alpha` (Main Branch) | :white_check_mark: |
| Nightly builds | :white_check_mark: |
| Older releases | :x: |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within `blyxc`, `blyxpkg`, `blyx_bir`, or official standard library crates (`library/blyx`, `library/blyx-std`):

1. **Do NOT open a public GitHub issue.**
2. Send an email with details and reproduction steps to:
   - **Primary Security Contact**: [security@blyx-lang.space](mailto:security@blyx-lang.space)
   - **Neuroblyx Security Oversight**: [contact@neuroblyx.com](mailto:contact@neuroblyx.com)
3. Include in your report:
   - Description of the vulnerability and its potential impact.
   - Minimal reproduction code or compiler flags.
   - Operating system, architecture, and compiler version (`blyxc --version`).

---

## Response & Disclosure Process

- **Acknowledgement**: We aim to acknowledge receipt of vulnerability reports within 48 hours.
- **Assessment**: The Neuroblyx security and compiler team will verify and triage the issue.
- **Resolution**: A patch will be authored, reviewed internally, and prepared for release.
- **Coordinated Disclosure**: Once a fix is deployed, an advisory will be published thanking the reporter for their responsible disclosure.
