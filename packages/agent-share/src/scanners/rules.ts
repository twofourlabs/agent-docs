import { globby } from 'globby';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
import type { Rule } from '../types/index.js';

export async function scanRules(basePath: string): Promise<Rule[]> {
  const patterns = ['rules/**/*.md', '.cursor/rules/**/*.md', '.claude/rules/**/*.md'];
  const files = await globby(patterns, { cwd: basePath, absolute: true });

  const rules: Rule[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(content);
    const fileName = path.basename(filePath, '.md');

    rules.push({
      id: fileName,
      description: (data.description as string) || '',
      path: filePath,
      alwaysApply: (data.alwaysApply as boolean) || false,
      globs: (data.globs as string[]) || [],
      tags: (data.tags as string[]) || []
    });
  }

  return rules;
}
