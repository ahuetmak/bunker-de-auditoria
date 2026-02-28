# AGENTS.md

## Cursor Cloud specific instructions

### Repository state

This repository (`bunker-de-auditoria`) is currently **empty** — it contains only a `README.md` and a Java-oriented `.gitignore`. There is no application code, no build configuration (no `pom.xml`, `build.gradle`, etc.), and no dependency files.

### Environment

- **Java 21 JDK** (OpenJDK 21.0.10) is pre-installed on the VM.
- **No build tool** (Maven/Gradle) is configured because no build file exists in the repo.
- If a build tool is added in the future, the update script and these instructions should be updated accordingly.

### Development notes

- The `.gitignore` uses a standard Java template, suggesting the project intends to be Java-based.
- Once source code and a build configuration are added, update this file with lint/test/build/run commands.
