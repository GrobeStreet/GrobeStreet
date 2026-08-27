# Robert “Bobby” Morong

Independent research engineer focused on one lane: **reproducible AI-claim verification for high-stakes decisions**.

I build inspectable evaluations that test whether AI, statistical, benchmark, and performance claims survive reruns, corrected comparators, held-out checks, and adversarial scrutiny. The operating rule is simple: **AI proposes; deterministic systems verify; evidence remains traceable.**

## Verification infrastructure

- [RCV-Bench](https://github.com/GrobeStreet/rcv-bench) — a research-claim verification benchmark that distinguishes simple re-execution from provenance reasoning and robustness testing. The public corpus contains reproduced, deviation, fabricated, and fragile cases plus deterministic and real-agent baselines.
- [Eval Invariance Engine](https://github.com/GrobeStreet/eval-invariance-engine) — reusable tooling for measuring whether an AI-evaluation score survives semantics-preserving perturbations, with CLI and Inspect AI integration.
- [Diligence Lab / AI-claim verification](https://robert-morong-research.netlify.app/verify/) — a bounded application of the same evidence discipline to technically material AI, data-moat, benchmark, and unit-economics claims before they are underwritten.

## Evidence cases

- [MMLU Robustness Audit](https://github.com/GrobeStreet/mmlu-robustness-audit) — separately regenerated option-order fragility; the central majority-flip result survived while several historical calibration/stability quantities did not.
- [ARC-AGI-2 Occam Baseline](https://github.com/GrobeStreet/arc-agi-2-occam-baseline) — corrected same-holdout calibration and selection analysis, including a published reversal of the earlier optimistic result.
- [De-Stress Lab](https://github.com/GrobeStreet/de-stress-lab) — selection-aware scientific stress testing with frozen manifests, reproducibility tooling, and explicit limits on what has and has not been independently verified.

The standard is: **test the claim that matters, preserve the receipts, publish the correction when the evidence changes, and make the surviving result rerunnable.**
