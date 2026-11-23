# Agent Guide for This Project

## Code Style and Rules

- Do not add comments to the code.
- Add tests for every function that is static or lives in the `utils` folder.
- Internet access is unreliable, so avoid downloading dependencies. Try to get them from the pnpm store offline first; if a dependency is not available there, document it in a dedicated section of `dependencies.md`. When Internet access is available, I will fetch it and remove the entry from the list. Until then, we cannot use code that depends on it. Once it is available, we will do the adoption/onboarding. In that section of `dependencies.md`, document the workaround you used and how to migrate/adopt the dependency when it becomes available — specifically, its name, the workaround, and the migration steps. When downloading dependencies use pnpm, never npm with the flags --config.fetchTimeout=6000000 --config.networkConcurrency=1 as you.