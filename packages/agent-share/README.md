# agent-share

CLI tool for installing and sharing AI agent artifacts (skills, rules, commands, agents) across projects.

## Installation

```bash
# Run directly with npx
npx agent-share <command>

# Or install globally
npm install -g agent-share
```

Requires Node.js >= 18.0.0

## Commands

### install [source]

Install NEW items from a repository. Skips items that already exist.

```bash
# Install from GitHub
agent-share install twofourlabs/agent-docs --skills

# Install from local directory
agent-share install ./my-skills --rules

# Install all types from current directory
agent-share install --all
```

### update [source]

Update EXISTING items. Overwrites current files.

```bash
# Update all installed skills
agent-share update --skills

# Update from specific repo
agent-share update twofourlabs/agent-docs --rules --all
```

### list [source]

List available items in a repository.

```bash
# List all from current directory
agent-share list

# List skills from GitHub repo
agent-share list twofourlabs/agent-docs --skills

# List installed items
agent-share list --installed
```

### config

Manage default settings.

```bash
# Show current config
agent-share config --show

# Set default target
agent-share config --target .claude

# Set default link method
agent-share config --method symlink
```

## Options

| Option | Description |
|--------|-------------|
| `--skills` | Process skills only |
| `--rules` | Process rules only |
| `--commands` | Process commands only |
| `--agents` | Process agents only |
| `--all` | Select all items (skip interactive prompt) |
| `--target <dir>` | Target directory: `.claude`, `.cursor`, `.agents` |
| `--method <type>` | Link method: `symlink` (default) or `copy` |

## Examples

```bash
# Install skills from GitHub to .claude
npx agent-share install twofourlabs/agent-docs --skills --target .claude

# Install all artifact types
npx agent-share install --all --target .claude

# Update existing rules
npx agent-share update --rules

# List what's available in a repo
npx agent-share list twofourlabs/agent-docs

# Install with copy instead of symlink
npx agent-share install --skills --method copy

# Install from local path
npx agent-share install ../shared-skills --all
```

## Supported Artifact Types

| Type | Description | Detection |
|------|-------------|-----------|
| **Skills** | Reusable agent capabilities | `SKILL.md` files in directories |
| **Rules** | Project/coding guidelines | `.md` files with YAML frontmatter |
| **Commands** | Slash commands for agents | Command definition files |
| **Agents** | Full agent configurations | Agent configuration files |

## Target Directories

Each target organizes artifacts in subdirectories:

| Target | Skills | Rules | Commands | Agents |
|--------|--------|-------|----------|--------|
| `.claude` | `.claude/skills` | `.claude/rules` | `.claude/commands` | `.claude/agents` |
| `.cursor` | `.cursor/skills` | `.cursor/rules` | `.cursor/commands` | `.cursor/agents` |
| `.agents` | `.agents/skills` | `.agents/rules` | `.agents/commands` | `.agents` |

## Link Methods

- **symlink** (default): Creates symbolic links. Changes in source auto-propagate.
- **copy**: Copies files. Independent of source after installation.
