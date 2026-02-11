export const TARGETS = {
    '.claude': {
        name: 'Claude Code',
        skills: '.claude/skills',
        rules: '.claude/rules',
        commands: '.claude/commands',
        agents: '.claude/agents',
        settings: '.claude'
    },
    '.cursor': {
        name: 'Cursor',
        skills: '.cursor/skills',
        rules: '.cursor/rules',
        commands: '.cursor/commands',
        agents: '.cursor/agents',
        settings: '.cursor'
    },
    '.agents': {
        name: 'Shared Agents',
        skills: '.agents/skills',
        rules: '.agents/rules',
        commands: '.agents/commands',
        agents: '.agents',
        settings: '.agents'
    }
};
export function getTargetConfig(key) {
    return TARGETS[key] || {
        name: key,
        skills: `${key}/skills`,
        rules: `${key}/rules`,
        commands: `${key}/commands`,
        agents: `${key}/agents`,
        settings: key
    };
}
