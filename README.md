# Robert “Bobby” Morong

**Research engineer · AI evaluation · reproducibility · statistical red teaming**

I test whether quantitative claims survive replication.

I reproduce published results, identify the assumptions carrying them, calibrate selection effects, and publish the evidence — including failed hypotheses, weakened claims, frozen artifacts, and explicit limits.

**Cosmology · AI benchmarks · scientific software · statistical stress testing**

[Research portfolio](https://robert-morong-research.netlify.app) · [Repositories](https://github.com/GrobeStreet?tab=repositories) · [Email](mailto:bobbyopsassistant@gmail.com?subject=Research%20collaboration)

## Start here

### [DESI DR2 — scientific reproduction & stress test](https://github.com/GrobeStreet/de-stress-lab)

**Result:** the published compressed-likelihood preference for evolving dark energy reproduces, but much of its strength is LRG2-sensitive. A 5,000-mock selection calibration shows that the localization at LRG2 is **not** additional independent evidence once the global fluctuation is conditioned on.

**Receipts:** [software DOI](https://doi.org/10.5281/zenodo.21633731) · [scientific archive DOI](https://doi.org/10.5281/zenodo.21632602) · [PyPI](https://pypi.org/project/de-stress-lab/) · [ReproHack Paper #108](https://www.reprohack.org/paper/108/) · [CI](https://github.com/GrobeStreet/de-stress-lab/actions) · [frozen result manifest](https://github.com/GrobeStreet/de-stress-lab/blob/main/RESULTS_MANIFEST.json)

**Verification status:** analysis, tests, provenance, and arXiv package complete; independent human clean-room execution is actively being sought.

---

### [MMLU — option-order robustness audit](https://github.com/GrobeStreet/mmlu-robustness-audit)

**Result:** under four cyclic answer-choice reorderings, the regenerated Qwen harness changes its underlying answer on roughly **78%** of sampled questions in both bf16 and fp32; accuracy on flipping questions remains near chance.

**Receipts:** [green verification workflow](https://github.com/GrobeStreet/mmlu-robustness-audit/actions) · [regeneration record](https://github.com/GrobeStreet/mmlu-robustness-audit/blob/main/regeneration/REGENERATION.md) · [provenance](https://github.com/GrobeStreet/mmlu-robustness-audit/blob/main/regeneration/PROVENANCE.json) · [frozen vs regenerated results](https://github.com/GrobeStreet/mmlu-robustness-audit/blob/main/RESULTS.md)

**Verification status:** headline robustness result regenerated with partial metric agreement; historical calibration/stability quantities that did not regenerate remain explicitly downgraded. No second human verifier yet.

---

### [ARC-AGI-2 — benchmark methodology & self-correction](https://github.com/GrobeStreet/arc-agi-2-occam-baseline)

**Result:** the corrected same-holdout analysis finds **32.8% / 50.8% / 63.4%** demonstration reliability at k=1/2/3. On ambiguous cases, MDL selection beats random by **+11.1 points**, while the candidate oracle is only **+3.7 points** above MDL. The linked solver remains **0/167**.

**Receipts:** [paper](https://github.com/GrobeStreet/arc-agi-2-occam-baseline/blob/main/ARC_Paper_Draft.pdf) · [pre-specified publish-regardless record](https://github.com/GrobeStreet/arc-agi-2-occam-baseline/blob/main/HYPOTHESIS-crossfold-v2.md) · [frozen machine-readable results](https://github.com/GrobeStreet/arc-agi-2-occam-baseline/tree/main/results) · [MIT-0 release](https://github.com/GrobeStreet/arc-agi-2-occam-baseline/blob/main/LICENSE)

**Verification status:** corrected v2 evidence is public and frozen; engineering hardening is the next technical pass.

## Evidence, not adjectives

`2 Zenodo DOIs` · `PyPI package` · `5,000-mock null calibration` · `ReproHack #108` · `CI-tested research code` · `frozen manifests` · `publish-regardless records` · `failed claims retained` · `human verification status stated explicitly`

## What I do

**AI evaluation** — benchmark robustness, protocol reconstruction, evaluation failure modes, controlled reruns.

**Statistical red teaming** — selection effects, null calibration, sensitivity analysis, holdout tests, influence diagnostics.

**Reproducibility engineering** — frozen artifacts, hashes, CI, clean-room protocols, scientific software, evidence manifests.

**AI-assisted research systems** — agentic workflows where implementation can be automated but the evidence trail remains inspectable by humans.

## Working principle

> **Reproduce → localize the load-bearing assumption → calibrate the null/selection process → define what would kill the story → publish what happens anyway.**

That method is the through-line across cosmology, AI benchmark evaluation, and quantitative model auditing.

## Work with me

San Diego-based and open to **research-engineering roles, AI evaluation work, reproducibility collaborations, and serious quantitative research projects**.

[Portfolio](https://robert-morong-research.netlify.app) · [Email](mailto:bobbyopsassistant@gmail.com?subject=Research%20or%20AI%20collaboration)
