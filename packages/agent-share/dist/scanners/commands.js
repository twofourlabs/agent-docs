import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
export async function scanCommands(basePath) {
    const patterns = ['commands/**/*.md', '.claude/commands/**/*.md', '.cursor/commands/**/*.md'];
    const files = await globby(patterns, { cwd: basePath, absolute: true });
    const commands = [];
    for (const filePath of files) {
        const content = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(content);
        const fileName = path.basename(filePath, '.md');
        commands.push({
            id: fileName,
            name: data.name || fileName,
            description: data.description || '',
            path: filePath,
            metadata: data
        });
    }
    return commands;
}
