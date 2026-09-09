# Blyx Open Source Governance & Stewardship

**Blyx** is governed through an open, transparent stewardship model led by **Neuroblyx** in close collaboration with the open-source community.

---

## Stewardship Principles

1. **Open Source Commitment**: Blyx is and will always remain open source under permissive dual licensing (MIT and Apache 2.0).
2. **Technical Meritocracy**: Decisions regarding language syntax, semantic features, and compiler optimizations are driven by rigorous benchmarking, RFC consensus, and engineering merit.
3. **Stability & Backward Compatibility**: Production stability is paramount. Breaking changes must follow the formal deprecation and edition migration policies.
4. **Community Accessibility**: Anyone can participate, propose changes, and contribute to the evolution of the language.

---

## Governance Structure

### 1. Steering Committee (Led by Neuroblyx)
- **Role**: Guides long-term technical vision, architectural roadmap, resource allocation, and ecosystem strategy.
- **Lead**: Rahul Chaube (Founder & Lead Architect)

### 2. Specialized Working Groups

- **Compiler Team**: Responsible for `compiler/blyxc`, AST structures, type inference, SSA BIR lowering, and LLVM machine code generation.
- **Standard Library & Runtime Team**: Responsible for `library/blyx` and `library/blyx-std`, including memory management, actor scheduling, and tensor arithmetic.
- **Developer Experience & Tooling Team**: Oversees developer productivity utilities including `blyxpkg`, `blyx-analyzer` (LSP), `blyxfmt`, `blyxdoc`, and `blyxup`.
- **Security & Integrity Team**: Evaluates vulnerability reports and coordinates patch disclosures under [SECURITY.md](SECURITY.md).

---

## Decision Making & RFC Process

All major language changes, new syntactic keywords, or standard library API modifications follow the **Blyx RFC (Request for Comments)** process:

1. **Discussion**: The proposal is published as a draft RFC in the `RFC/` folder via a pull request.
2. **Community Review**: The community and maintainers evaluate trade-offs, ergonomic impacts, and implementation feasibility.
3. **Decision**: The Steering Committee approves, requests modifications, or closes the RFC based on technical review.

---

## Commercial Stewardship

**Neuroblyx** provides commercial backing, funding CI infrastructure, cloud runner matrices, and core research. Neuroblyx guarantees the continued independence, open-source licensing, and vendor-neutral availability of the Blyx compiler and core tooling.
