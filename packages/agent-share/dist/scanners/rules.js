import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
export async function scanRules(basePath) {
    const patterns = ['rules/**/*.md', '.cursor/rules/**/*.md', '.claude/rules/**/*.md'];
    const files = await globby(patterns, { cwd: basePath, absolute: true });
    const rules = [];
    for (const filePath of files) {
        const content = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(content);
        const fileName = path.basename(filePath, '.md');
        rules.push({
            id: fileName,
            description: data.description || '',
            path: filePath,
            alwaysApply: data.alwaysApply || false,
            globs: data.globs || [],
            tags: data.tags || []
        });
    }
    return rules;
}
