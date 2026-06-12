# Claude Code Configuration

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

### Core Principles

1. **Think before coding** — State assumptions before implementing. If multiple interpretations exist, present them — never pick silently. Surface confusion and tradeoffs; push back when warranted.
2. **Simplicity first** — Write the minimum code that solves the problem, nothing speculative. No features beyond what was asked, no abstractions for single use. If 200 lines could be 50, rewrite it.
3. **Surgical changes** — Touch only what the task requires. Don't improve adjacent code, comments, or formatting. Every changed line must trace directly to the request.
4. **Goal-driven execution** — Define success criteria before starting multi-step work, then loop until verified. For bug fixes: write a failing test that reproduces the bug, then make it pass.

## File Organization

- NEVER save to root folder — use the directories below
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Ensure input validation at system boundaries

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal

## Claude Flow

Claude Flow V3 is installed for coordination (daemon + session hooks are active). Claude Code's own tools do the actual work — use the CLI only for swarm coordination and memory.

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
npx @claude-flow/cli@latest memory search --query "..."
npx @claude-flow/cli@latest doctor --fix
```

- Keep swarms small (6–8 agents) with hierarchical topology and specialized roles
- Spawn working agents via Claude Code's Task tool; the CLI never substitutes for it
- After spawning agents, don't poll status — wait for results
- Docs: https://github.com/ruvnet/claude-flow

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage labels are used unchanged (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: the glossary is `CONTEXT.md` at the repo root, ADRs live under `docs/adr/`. See `docs/agents/domain.md`.
