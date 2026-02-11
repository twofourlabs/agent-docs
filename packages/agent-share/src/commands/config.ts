import chalk from 'chalk';
import { getConfig, setConfig, showConfig } from '../utils/config.js';
import type { LinkMethod } from '../types/index.js';

interface ConfigOptions {
  target?: string;
  method?: string;
  show?: boolean;
}

export async function configCommand(options: ConfigOptions): Promise<void> {
  if (options.show || (!options.target && !options.method)) {
    await showConfig();
    return;
  }

  const updates: { defaultTarget?: string; linkMethod?: LinkMethod } = {};

  if (options.target) {
    updates.defaultTarget = options.target;
    console.log(chalk.green(`✓ Default target set to: ${options.target}`));
  }

  if (options.method) {
    if (options.method !== 'symlink' && options.method !== 'copy') {
      console.log(chalk.red('Invalid method. Use "symlink" or "copy".'));
      process.exit(1);
    }
    updates.linkMethod = options.method as LinkMethod;
    console.log(chalk.green(`✓ Link method set to: ${options.method}`));
  }

  await setConfig(updates);
}
