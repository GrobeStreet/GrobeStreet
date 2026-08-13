# Robert “Bobby” Morong

**Independent research engineer · AI evaluation · reproducibility · statistical red teaming**

I reproduce difficult quantitative claims, identify which assumptions carry
them, and publish the code, evidence, and limits. My work spans cosmology and AI
evaluation, with an emphasis on selection-aware statistics and inspectable
research systems.

[Research portfolio](https://robert-morong-research.netlify.app) ·
[Public repositories](https://github.com/GrobeStreet?tab=repositories) ·
[Contact](mailto:bobbyopsassistant@gmail.com?subject=Research%20collaboration)

## Flagship research

### [DESI DR2: where the late-time-evolution preference lives](https://github.com/GrobeStreet/de-stress-lab)

The compressed-likelihood preference for time-varying late-time behavior is
reproducible, and LRG2 is load-bearing for its strength. Selection-aware
calibration supplies the essential limit: conditional on a global fluctuation
as strong as the observed one, concentration at LRG2 is **not** an additional
independent anomaly. It is a localization result that directs follow-up.

**Evidence status:** reproduction and diagnostics complete; public package,
result manifest, frozen prediction ledger, and two Zenodo archives available;
independent human clean-room rerun pending.

### [ARC-AGI-2: how do we know a candidate program is right?](https://github.com/GrobeStreet/arc-agi-2-occam-baseline)

The corrected v2 analysis finds **32.8%** k=1 demonstration reliability. On
ambiguous cases, minimum-description-length selection gains **11.1 points** over
random selection, while the candidate oracle is only **3.7 points** above MDL.
The linked frozen solver remains **0/167**.

**Evidence status:** corrected v2 code, frozen machine-readable results, paper,
figures, and a pre-specified publish-regardless record are public.

### [MMLU: option-order robustness](https://github.com/GrobeStreet/mmlu-robustness-audit)

Cyclically reordering answer choices exposes a distinct robustness failure mode:
the regenerated public harness changes its underlying answer on roughly **78%**
of questions under both bf16 and fp32, while accuracy on flipping questions
remains near chance.

**Evidence status:** Qwen regeneration complete with **partial metric agreement**.
Headline accuracy and the majority-flip result regenerated; historical stability,
ECE, and mean four-label confidence did not. Tie-breaking and dtype were tested
and do not explain the discrepancy. The historical Qwen-vs-Llama calibration
contrast is therefore unconfirmed until the Llama arm is rerun. No second human
verifier has executed the package yet.

## Verification trail

- [Research portfolio and current public framing](https://robert-morong-research.netlify.app)
- [Installable `de-stress-lab` package](https://pypi.org/project/de-stress-lab/)
- [Canonical scientific reproduction archive](https://doi.org/10.5281/zenodo.21632602)
- [Reusable software archive](https://doi.org/10.5281/zenodo.21633731)
- [Frozen 2027 prediction ledger](https://github.com/GrobeStreet/de-stress-lab/tree/main/predictions)

## What I build

Selection-aware diagnostics, null calibration, reproducible scientific
software, benchmark audits, frozen evidence packages, and bounded agentic
workflows. The through-line is simple: **make consequential claims inspectable
before making them impressive.**

San Diego-based and open to research-engineering roles, applied-AI work, and
serious lab collaborations. [Email me](mailto:bobbyopsassistant@gmail.com?subject=Research%20or%20AI%20collaboration).
