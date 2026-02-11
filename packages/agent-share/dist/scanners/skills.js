import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
export async function scanSkills(basePath) {
    const patterns = ['skills/**/SKILL.md', 'SKILL.md'];
    const files = await globby(patterns, { cwd: basePath, absolute: true });
    const skills = [];
    for (const filePath of files) {
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: body } = matter(content);
        const dir = path.dirname(filePath);
        const referencesDir = path.join(dir, 'references');
        skills.push({
            id: path.basename(dir),
            name: data.name || path.basename(dir),
            description: data.description || '',
            path: filePath,
            lines: body.split('\n').length,
            hasReferences: await fs.pathExists(referencesDir),
            metadata: data
        });
    }
    return skills;
}
