import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanSkills } from './skills.js';
vi.mock('globby', () => ({
    globby: vi.fn()
}));
vi.mock('fs-extra', () => ({
    default: {
        readFile: vi.fn(),
        pathExists: vi.fn()
    }
}));
import { globby } from 'globby';
import fs from 'fs-extra';
describe('scanSkills', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('finds and parses SKILL.md files', async () => {
        vi.mocked(globby).mockResolvedValue(['/base/skills/my-skill/SKILL.md']);
        vi.mocked(fs.readFile).mockResolvedValue(`---
name: My Skill
description: A test skill
version: 1.0.0
---
# My Skill

Skill content here.
`);
        vi.mocked(fs.pathExists).mockResolvedValue(false);
        const skills = await scanSkills('/base');
        expect(globby).toHaveBeenCalledWith(['skills/**/SKILL.md', 'SKILL.md'], { cwd: '/base', absolute: true });
        expect(skills).toHaveLength(1);
        expect(skills[0]).toEqual({
            id: 'my-skill',
            name: 'My Skill',
            description: 'A test skill',
            path: '/base/skills/my-skill/SKILL.md',
            lines: 4,
            hasReferences: false,
            metadata: { name: 'My Skill', description: 'A test skill', version: '1.0.0' }
        });
    });
    it('uses directory name as fallback for name', async () => {
        vi.mocked(globby).mockResolvedValue(['/base/skills/fallback-skill/SKILL.md']);
        vi.mocked(fs.readFile).mockResolvedValue(`---
description: No name field
---
Content
`);
        vi.mocked(fs.pathExists).mockResolvedValue(false);
        const skills = await scanSkills('/base');
        expect(skills[0].name).toBe('fallback-skill');
        expect(skills[0].id).toBe('fallback-skill');
    });
    it('detects references directory', async () => {
        vi.mocked(globby).mockResolvedValue(['/base/skills/with-refs/SKILL.md']);
        vi.mocked(fs.readFile).mockResolvedValue('---\nname: With Refs\n---\nContent');
        vi.mocked(fs.pathExists).mockResolvedValue(true);
        const skills = await scanSkills('/base');
        expect(fs.pathExists).toHaveBeenCalledWith('/base/skills/with-refs/references');
        expect(skills[0].hasReferences).toBe(true);
    });
    it('returns empty array when no skills found', async () => {
        vi.mocked(globby).mockResolvedValue([]);
        const skills = await scanSkills('/base');
        expect(skills).toEqual([]);
    });
    it('handles multiple skills', async () => {
        vi.mocked(globby).mockResolvedValue([
            '/base/skills/skill-a/SKILL.md',
            '/base/skills/skill-b/SKILL.md'
        ]);
        vi.mocked(fs.readFile).mockResolvedValue('---\nname: Test\n---\nContent');
        vi.mocked(fs.pathExists).mockResolvedValue(false);
        const skills = await scanSkills('/base');
        expect(skills).toHaveLength(2);
    });
});
