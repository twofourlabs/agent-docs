import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import type { LinkMethod } from '../types/index.js';

export interface LinkResult {
  method: LinkMethod;
  source: string;
  target: string;
  success: boolean;
  error?: string;
}

export async function linkOrCopy(
  source: string,
  target: string,
  options: { method?: LinkMethod; force?: boolean } = {}
): Promise<LinkResult> {
  const { method = 'symlink', force = false } = options;

  // Remove existing if force
  if (force && await fs.pathExists(target)) {
    await fs.remove(target);
  }

  // Check if target exists
  if (await fs.pathExists(target)) {
    return {
      method,
      source,
      target,
      success: false,
      error: 'Target already exists'
    };
  }

  // Ensure parent directory exists
  await fs.ensureDir(path.dirname(target));

  // Try symlink on non-Windows
  if (method === 'symlink' && os.platform() !== 'win32') {
    try {
      await fs.symlink(source, target, 'dir');
      return { method: 'symlink', source, target, success: true };
    } catch {
      console.warn('Symlink failed, falling back to copy');
    }
  }

  // Fall back to copy
  await fs.copy(source, target);
  return { method: 'copy', source, target, success: true };
}
