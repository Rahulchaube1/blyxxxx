# Reproducible Benchmarks

Performance claims are useful only when other developers can reproduce them. Blyx benchmarks should therefore be treated as experiments with published methodology, not as universal performance guarantees.

## Minimum benchmark record

Every published result should record:

- Blyx version or exact Git commit;
- benchmark source and input data;
- compiler configuration and optimization flags;
- target triple and CPU/GPU model;
- operating system and relevant runtime versions;
- dependency versions where they affect execution;
- number of warm-up and measured iterations;
- summary statistics and variance;
- comparison baseline and its version/configuration.

## Methodology

Prefer benchmarks that:

1. can be built from a clean checkout;
2. use deterministic or documented inputs;
3. separate compilation time from execution time;
4. report multiple runs rather than a single timing;
5. avoid hidden environment-specific optimizations;
6. explain any hardware acceleration or special runtime configuration.

## Reporting

A benchmark report should include the exact command, environment, result distribution, and interpretation. Avoid statements such as “Blyx is faster than X” unless the comparison is narrow, reproducible, and supported by the published methodology.

For unstable compiler features, benchmark results should also state whether the measured behavior is experimental.

## Contribution checklist

Before adding a benchmark result:

- [ ] source is committed or otherwise permanently referenced;
- [ ] environment and compiler commit are recorded;
- [ ] baseline is clearly identified;
- [ ] multiple measurements were collected;
- [ ] the benchmark can be rerun by another contributor;
- [ ] conclusions do not exceed the evidence.
