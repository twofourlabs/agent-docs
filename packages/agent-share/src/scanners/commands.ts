import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
import type { Command } from '../types/index.js';

export async function scanCommands(basePath: string): Promise<Command[]> {
  const patterns = ['commands/**/*.md', '.claude/commands/**/*.md', '.cursor/commands/**/*.md'];
  const files = await globby(patterns, { cwd: basePath, absolute: true });

  const commands: Command[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(content);
    const fileName = path.basename(filePath, '.md');

    commands.push({
      id: fileName,
      name: (data.name as string) || fileName,
      description: (data.description as string) || '',
      path: filePath,
      metadata: data
    });
  }

  return commands;
}
