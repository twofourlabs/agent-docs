import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import type { Config, LinkMethod } from '../types/index.js';

const CONFIG_PATH = path.join(os.homedir(), '.config', 'agent-share', 'config.json');

export async function getConfig(): Promise<Config> {
  try {
    if (await fs.pathExists(CONFIG_PATH)) {
      return await fs.readJson(CONFIG_PATH);
    }
  } catch {
    // Ignore errors
  }
  return {};
}

export async function setConfig(updates: Partial<Config>): Promise<void> {
  const config = await getConfig();
  const newConfig = { ...config, ...updates };
  await fs.ensureDir(path.dirname(CONFIG_PATH));
  await fs.writeJson(CONFIG_PATH, newConfig, { spaces: 2 });
}

export async function showConfig(): Promise<void> {
  const config = await getConfig();
  console.log('Current configuration:');
  console.log(`  Default target: ${config.defaultTarget || '(not set)'}`);
  console.log(`  Link method: ${config.linkMethod || '(not set)'}`);
}
