export interface Skill {
    id: string;
    name: string;
    description: string;
    path: string;
    lines: number;
    hasReferences: boolean;
    metadata: Record<string, unknown>;
}
export interface Rule {
    id: string;
    description: string;
    path: string;
    alwaysApply: boolean;
    globs: string[];
    tags: string[];
}
export interface Command {
    id: string;
    name: string;
    description: string;
    path: string;
    metadata: Record<string, unknown>;
}
export interface Agent {
    id: string;
    name: string;
    description: string;
    path: string;
    metadata: Record<string, unknown>;
}
export type ArtifactType = 'skills' | 'rules' | 'commands' | 'agents' | 'settings';
export type LinkMethod = 'symlink' | 'copy';
export interface InstallOptions {
    mode: 'install' | 'update';
    skills?: boolean;
    rules?: boolean;
    commands?: boolean;
    agents?: boolean;
    all?: boolean;
    target?: string;
    method?: LinkMethod;
}
export interface TargetConfig {
    name: string;
    skills: string;
    rules: string;
    commands: string;
    agents: string;
    settings: string;
}
export interface Config {
    defaultTarget?: string;
    linkMethod?: LinkMethod;
}
export interface InstallSummary {
    target: string;
    targetName: string;
    installed: number;
    skipped: number;
    failed: number;
}
