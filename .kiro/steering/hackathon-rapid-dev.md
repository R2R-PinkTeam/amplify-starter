# Hackathon Rapid Development Guidelines

## Context

This is a 5-hour hackathon. Speed and working demos trump perfection.

## Core Principles

### 1. Minimal Viable Implementation

- Write the absolute minimum code to demonstrate the feature
- Skip edge cases unless they break the demo
- No premature optimization
- Hardcode values if it saves time

### 2. No Over-Engineering

- Avoid abstractions until you need them twice
- Skip design patterns unless they're obvious wins
- No "future-proofing" - solve today's problem only
- Single file solutions are fine

### 3. Fast Iteration

- Get something running in the first hour
- Iterate in small, testable chunks
- Break if it works, fix if it doesn't
- Demo-driven development

### 4. Smart Shortcuts

- Use existing libraries instead of building from scratch
- Copy-paste and adapt working code
- Mock external services with static data
- Skip authentication/authorization unless required

### 5. Documentation = Comments

- Brief inline comments only
- No separate documentation files
- README with setup instructions only if needed
- Let the demo speak for itself

### 6. Testing Strategy

- Manual testing through the UI/CLI
- No unit tests unless explicitly required
- Focus on the happy path
- Fix bugs only if they block the demo

### 7. Time Management

- Hour 1: Basic structure + one working feature
- Hour 2-3: Core functionality
- Hour 4: Integration + bug fixes
- Hour 5: Polish + demo prep

## What to Skip

- Comprehensive error handling
- Input validation (beyond basics)
- Logging frameworks
- Configuration files
- Database migrations
- CI/CD pipelines
- Linting/formatting setup
- Type definitions (unless TypeScript is required)
- Tests (unless judging criteria requires them)

## What to Prioritize

- Working demo
- Core feature that solves the problem
- Visual polish (if it's user-facing)
- Clear value proposition
- Stable enough to present

## Code Style

- Consistency matters less than speed
- Use whatever naming convention comes naturally
- Skip refactoring unless code is unreadable
- Inline everything until it hurts

## When Stuck

- Timebox debugging to 10 minutes
- Ask for help or pivot
- Use simpler approach
- Cut scope if needed

Remember: A working 80% solution beats a perfect 20% solution.
