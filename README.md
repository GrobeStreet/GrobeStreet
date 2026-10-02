# Robert “Bobby” Morong

Independent research engineer focused on one lane: **reproducible AI-claim verification for high-stakes decisions**.

I build inspectable evaluations that test whether AI, statistical, benchmark, and performance claims survive reruns, corrected comparators, held-out checks, provenance checks, and adversarial scrutiny. The operating rule is simple: **AI proposes; deterministic systems verify; evidence remains traceable.**

## Start here

1. [RCV-Bench](https://github.com/GrobeStreet/rcv-bench) — research-claim verification benchmark for autonomous agents. It separates simple re-execution from harder provenance and robustness judgments, with deterministic baselines and a first real-agent baseline.
2. [Eval Invariance Engine](https://github.com/GrobeStreet/eval-invariance-engine) — reusable tooling for testing whether evaluation scores remain stable under semantics-preserving perturbations, with CLI and Inspect AI integration.
3. [MMLU Robustness Audit](https://github.com/GrobeStreet/mmlu-robustness-audit) — separately regenerated option-order fragility; the central majority-flip result survived while several historical calibration/stability quantities did not.
4. [De-Stress Lab](https://github.com/GrobeStreet/de-stress-lab) — selection-aware scientific stress testing with installable software, frozen manifests, reproducibility tooling, and explicit evidence limits.
5. [ARC-AGI-2 Occam Baseline](https://github.com/GrobeStreet/arc-agi-2-occam-baseline) — corrected same-holdout calibration and selection analysis, including a published reversal of the earlier optimistic result.

## External validation wanted

The next threshold is outside use, not more self-authored projects. I welcome:
- [independent reruns of the MMLU audit](https://github.com/GrobeStreet/mmlu-robustness-audit/issues/5) or de-stress package;
- [outside agents evaluated on RCV-Bench](https://github.com/GrobeStreet/rcv-bench/issues/3) under a declared tool/network/isolation policy;
- [outside Inspect users for Eval Invariance Engine](https://github.com/GrobeStreet/eval-invariance-engine/issues/1);
- technical review, issue reports, and reproducibility PRs.

The standard is: **test the claim that matters, preserve the receipts, publish the correction when the evidence changes, and make the surviving result rerunnable.**
