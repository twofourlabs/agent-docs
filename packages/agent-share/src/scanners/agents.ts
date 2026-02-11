import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
import type { Agent } from '../types/index.js';

export async function scanAgents(basePath: string): Promise<Agent[]> {
  const patterns = ['agents/**/*.md', '.claude/agents/**/*.md', '.agents/**/*.md'];
  const files = await globby(patterns, { cwd: basePath, absolute: true });

  const agents: Agent[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(content);
    const fileName = path.basename(filePath, '.md');

    agents.push({
      id: fileName,
      name: (data.name as string) || fileName,
      description: (data.description as string) || '',
      path: filePath,
      metadata: data
    });
  }

  return agents;
}
