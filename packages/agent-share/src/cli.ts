#!/usr/bin/env node

import { Command } from 'commander';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('agent-share')
  .description('Install and share AI skills, rules, and agents')
  .version('0.2.0');

program
  .command('install [source]')
  .description('Install NEW items from repository (skips existing)')
  .option('--skills', 'Install skills only')
  .option('--rules', 'Install rules only')
  .option('--commands', 'Install commands only')
  .option('--agents', 'Install agents only')
  .option('--all', 'Select all items in each category')
  .option('--target <dir>', 'Target directory (.claude, .cursor, .agents)')
  .option('--method <type>', 'Link method (symlink, copy)')
  .action(async (source, options) => {
    console.log('');
    p.intro(chalk.bgCyan(chalk.black(' agent-share ')));
    await installCommand(source, { ...options, mode: 'install' });
    p.outro('Done!');
  });

program
  .command('update [source]')
  .description('Update EXISTING items (overwrites)')
  .option('--skills', 'Update skills only')
  .option('--rules', 'Update rules only')
  .option('--commands', 'Update commands only')
  .option('--agents', 'Update agents only')
  .option('--all', 'Update all installed items')
  .option('--target <dir>', 'Target directory (.claude, .cursor, .agents)')
  .option('--method <type>', 'Link method (symlink, copy)')
  .action(async (source, options) => {
    console.log('');
    p.intro(chalk.bgCyan(chalk.black(' agent-share ')));
    await installCommand(source, { ...options, mode: 'update' });
    p.outro('Done!');
  });

program
  .command('list [source]')
  .description('List available items')
  .option('--skills', 'List skills only')
  .option('--rules', 'List rules only')
  .option('--installed', 'Show installed items')
  .action(listCommand);

program
  .command('config')
  .description('Manage configuration')
  .option('--target <dir>', 'Set default target directory')
  .option('--method <type>', 'Set default link method')
  .option('--show', 'Show current configuration')
  .action(configCommand);

program.parse();
