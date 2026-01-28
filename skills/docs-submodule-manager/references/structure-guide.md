# Documentation Structure Guide

## Directory Layout

All documentation is stored in `docs/<repo-name>/` where `<repo-name>` matches the parent repository name (e.g., `app-kavana`).

### Three Main Categories

#### 1. `solutions/<issue>/`

For documenting solutions to specific issues or bugs.

**When to use:**
- Fixing bugs with non-obvious solutions
- Documenting workarounds
- Recording root cause analysis
- Issue retrospectives

**Example structure:**
```
docs/app-kavana/solutions/
├── android-build-failure/
│   ├── diagnosis.md
│   └── fix.md
└── navigation-crash-ios/
    └── solution.md
```

**Naming:** Use kebab-case describing the issue

#### 2. `specs/<feature>/`

For developer-focused technical specifications and implementation details.

**When to use:**
- Planning feature implementation
- Tracking development progress
- Documenting architecture decisions
- API design and technical details

**Example structure:**
```
docs/app-kavana/specs/
├── chat-refactor/
│   ├── implementation-plan.md
│   ├── progress.md
│   └── api-design.md
└── offline-sync/
    ├── implementation-plan.md
    └── data-flow.md
```

**Standard files:**
- `implementation-plan.md` - Initial technical plan
- `progress.md` - Development tracking (for features with 5+ todos)

#### 3. `feature/<feature-name>/`

For product manager-focused PRDs (Product Requirements Documents).

**When to use:**
- Defining product requirements
- User stories and use cases
- Business logic and workflows
- Product specifications

**Example structure:**
```
docs/app-kavana/feature/
├── voice-messaging/
│   ├── prd.md
│   └── user-flows.md
└── payment-integration/
    └── requirements.md
```

**Naming:** Use kebab-case describing the feature

### Dynamic Directory Creation

If the use case doesn't fit the three main categories, create a descriptive directory name that maintains clarity:

**Examples:**
- `docs/app-kavana/research/` - Research findings
- `docs/app-kavana/rfcs/` - Request for Comments
- `docs/app-kavana/architecture/` - System architecture docs

**Guidelines:**
- Use kebab-case for all directory and file names
- Keep names descriptive but concise
- Maintain logical grouping
- Avoid deeply nested structures (prefer 2-3 levels max)
