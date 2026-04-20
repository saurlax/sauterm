# SAUTERM Agent Guide

## Project Overview

Sauterm is a desktop terminal application built with Nuxt 4 + Vue 3 on the frontend and Tauri (Rust) on the backend.
The frontend renders terminal UI with `@wterm/dom`, while process control and PTY integration are handled through Tauri commands/events.

## Core Principles

1. Keep code concise and readable.
2. Prefer direct logic over indirection.
3. Avoid placeholder abstractions and speculative architecture.
4. Use English only in code, comments, docs, and UI strings unless explicitly requested otherwise.

## Coding Standards

1. Do not introduce unnecessary temporary variables.
2. Do not introduce helper functions unless they improve clarity or reuse.
3. Keep component state minimal and local.
4. Remove dead code and stale branches instead of keeping them "just in case".
5. Preserve existing style and APIs unless a task requires change.

## Comments and Documentation

1. Add comments only when behavior is non-obvious.
2. Do not add narrative or redundant comments.
3. Prefer self-explanatory naming over explanatory comments.
4. Keep docs short, concrete, and actionable.

## Frontend Conventions

1. Use Nuxt auto-import conventions where appropriate.
2. Keep Vue components focused on one responsibility.
3. Prefer explicit cleanup for listeners/subscriptions in lifecycle hooks.
4. Minimize reactive state and watchers to what is strictly needed.
5. Nuxt auto-imports types in this codebase where available; do not add manual type imports from `~/utils` or `~/types` when a shared or auto-imported type can be referenced directly.
6. Shared tab/process shapes should live in `app/types/*.d.ts` as global ambient types instead of imported type aliases.
7. Prefer Nuxt UI components and `ui` props over hand-written Tailwind utilities, especially in layout files like `app/layouts/default.vue`; keep raw utility classes to the minimum needed for sizing or overflow.
8. Use Nuxt routing for page-like tabs. If a tab is a page, navigate directly to its route. If a tab is terminal-backed, route it to `app/pages/terminal.vue` and pass the terminal id through the query string.

## Tauri Integration Conventions

1. Keep command/event boundaries explicit and typed.
2. Handle terminal lifecycle predictably: open, stream, exit, dispose.
3. Surface failures clearly instead of silently ignoring errors.

## Dependency and File Hygiene

1. Do not keep unused dependencies.
2. Keep lockfile consistent with dependency changes.
3. Avoid adding new packages when existing project dependencies already solve the task.

## Agent Execution Checklist

1. Implement the smallest viable change.
2. Verify related TypeScript/Nuxt checks after edits.
3. Ensure naming reflects current implementation (no stale names like xterm after migration).
4. Keep all outputs and generated artifacts in English.
