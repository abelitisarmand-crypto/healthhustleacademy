# gstack Code Review

**Repository**: https://github.com/garrytan/gstack  
**Reviewed**: 2026-05-12  
**Scope**: Architecture, security model, dependencies, prompt injection defenses

---

## Overview

gstack is a Claude Code skill framework that adds 20+ AI role-based workflows (CEO, designer, QA, security auditor, etc.) on top of a persistent Chromium daemon. The core value proposition is sub-second browser interaction latency via a long-lived process rather than cold-starting Chromium per command.

---

## Architecture

### Strengths

**Daemon model is well-designed.** The single long-lived Chromium process with 100–200 ms round-trip (vs. ~3 s cold start) is the right call for an AI agent that issues many browser commands per session. The 30-minute idle timeout and SIGTERM handling are sensible lifecycle management.

**Dual-listener surface separation is correct.** Splitting local (127.0.0.1) and tunnel (ngrok-facing) listeners at the network level — not just at the application layer — is a sound architecture. The tunnel surface is gated to 22 allowlisted commands; expanding it requires a deliberate code change, not a config flag.

**Ref system over XPath/CSS.** Using sequential accessibility-tree refs (`@e1`, `@e2`) sidesteps DOM mutation problems from framework hydration and CSP-blocked injected scripts. Async staleness detection before ref reuse is correct; stale locators are a common silent failure mode in Playwright automation.

**Atomic state writes.** Temp-file + rename for the token state file prevents partial reads from a concurrent process. Small detail, correct instinct.

### Weaknesses

**Dual browser-automation dependency is redundant.** `package.json` lists both `playwright` and `puppeteer-core`. The architecture doc says Playwright is the abstraction layer. Carrying puppeteer-core as a production dependency adds ~30 MB and an extra attack surface with no documented reason. Should be removed or moved to optional/dev.

**No root token rotation.** The root `AUTH_TOKEN` is a `crypto.randomUUID()` generated at startup and stored in a mode-0600 state file. There is no rotation endpoint. If the state file is ever read by malware or a rogue subprocess, the attacker has permanent root access until the daemon restarts. A `/admin/rotate-token` endpoint (local surface only) would close this.

**30-minute idle timeout disabled for headed/tunnel modes.** This is documented as intentional, but it means a tunnel-connected session that crashes or is abandoned keeps the daemon alive indefinitely. A maximum absolute session TTL (e.g., 4 hours) independent of idle time would be safer.

---

## Security Model

### Token Authentication

The three-tier token model (root → scoped → SSE-view) is well-structured:

- Root token: local surface only, full command access
- Scoped tokens: tunnel surface, domain allowlist + scope set per token
- SSE cookies: view-only, HttpOnly + SameSite=Strict, short-lived

Removal of query-parameter auth in favor of Bearer + cookies is the right call — URL tokens appear in server logs, browser history, and Referer headers.

**Concern**: Scoped tokens cannot refresh or rotate themselves — only root can revoke them. In a long-running tunnel session this creates a credential cliff: the token either works or is dead, with no graceful renewal path. This is an operational gap for production use of `/pair-agent`.

### Prompt Injection Defense (6 layers)

The defense stack is more thorough than most tools in this space:

| Layer | Mechanism | Notes |
|-------|-----------|-------|
| L1–L3 | Datamarking / content envelope / hidden-element stripping | Structural, zero-cost |
| L4 | BERT-small classifier (TestSavantAI) | Fast, local |
| L4b | Claude Haiku transcript scan | Reasoning-blind to prevent self-persuasion |
| L4c | DeBERTa-v3 ensemble | Opt-in, ~721 MB |

**Strengths of this design:**
- Fail-open is intentional and documented: classifier failure degrades to `confidence=0`, not a hard block. This is correct for a developer tool where false negatives are more acceptable than blocking legitimate workflows.
- Haiku scan spawning from `os.tmpdir()` to avoid local `CLAUDE.md` context contamination is a non-obvious but important detail.
- Performance gating (Haiku runs only when L4 already fired at LOG_ONLY) saves ~70% of API calls.

**Concerns:**
- L4c (DeBERTa) is opt-in via env var and not documented in the README. Users who don't know about it get a weaker ensemble. It should be mentioned in the security section of the README and recommended for production tunnel use.
- The 45-second Haiku timeout is long enough to noticeably stall interactive sessions if CLI startup is slow. The timeout was bumped from 15 s after benchmarking — consider async/non-blocking execution with a result cache to avoid head-of-line blocking.

### Cookie / Credential Handling

Per the architecture documentation:
- Cookie decryption occurs in-process only
- Values are never written in plaintext
- Database access is read-only
- Keychain approval is required on first import

This is correct. The main risk is in-memory exposure during the daemon's lifetime, which is unavoidable for a persistent browser process. No structural concerns here.

---

## Dependencies

| Package | Version | Notes |
|---------|---------|-------|
| playwright | ^1.58.2 | Pin to exact version; breaking changes in minor releases have historically been disruptive |
| puppeteer-core | ^24.40.0 | **Redundant** — remove if not used |
| @huggingface/transformers | ^4.1.0 | Large transitive tree; pin and audit |
| @ngrok/ngrok | ^1.7.0 | Expands attack surface to ngrok infra; acceptable given the threat model |
| marked | ^18.0.2 | Markdown renderer — XSS risk if output is rendered without sanitization |
| @anthropic-ai/sdk | ^0.78.0 | Fine; broad range is acceptable for a SDK that follows semver |

**Recommendation**: Replace `^` with `~` for `playwright`, `@huggingface/transformers`, and `puppeteer-core` to reduce supply-chain risk from unexpected minor-version updates. Use `bun.lock` (already present) and periodically audit with `bun audit`.

The `marked` library warrants special attention: if any page content is passed through `marked` and rendered in the extension sidebar without a Content Security Policy or `sanitize` option, it could be an XSS vector for injected Markdown in page content. Verify that rendered output is either sandboxed or sanitized.

---

## Skill System

**SKILL.md generation from templates** (`bun run gen:skill-docs`) is a good pattern for keeping documentation in sync with implementation. The constraint to "never edit generated files directly" needs enforcement — a CI lint step that diffs generated output against committed files would make this enforceable rather than just advisory.

**Test tiers are well-thought-out.** Free (`bun test` < 2 s), paid (`test:evals` ~$4), and CI gate (`test:gate`) give contributors a clear cost/speed trade-off. The diff-based eval selection is practical.

**`/cso` (security audit) skill** runs OWASP + STRIDE review using Claude. This is a useful first-pass tool but should be paired with a note that LLM-generated security reviews do not replace manual penetration testing or SAST tooling for production systems.

---

## Summary

| Area | Rating | Key Finding |
|------|--------|-------------|
| Architecture | Good | Daemon model is well-designed; redundant puppeteer-core should be removed |
| Auth / Token model | Good | Three-tier system is correct; root token rotation gap is worth closing |
| Prompt injection defense | Good | 6-layer stack is thorough; L4c opt-in discoverability is weak |
| Cookie / credential handling | Good | In-process only, read-only DB, no plaintext write |
| Dependencies | Fair | Broad `^` ranges + redundant browser lib; lock down and audit |
| Skill system | Good | Template-generated docs are the right pattern; add CI enforcement |

**Overall**: gstack is a well-architected tool with a thoughtful security model for its threat space (local developer machine + optional remote pairing). The main gaps are operational (no root token rotation, opt-in ensemble classifier not discoverable, redundant dependency). None of the findings are blocking for a developer tool used in a trusted environment; they would need to be addressed before recommending it for multi-tenant or production agent deployments.
