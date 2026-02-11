import * as p from '@clack/prompts';
import chalk from 'chalk';
import boxen from 'boxen';
import { fetchRepo } from '../utils/repo.js';
import { scanSkills } from '../scanners/skills.js';
import { scanRules } from '../scanners/rules.js';
import { scanCommands } from '../scanners/commands.js';
import { scanAgents } from '../scanners/agents.js';

interface ListOptions {
  skills?: boolean;
  rules?: boolean;
  commands?: boolean;
  agents?: boolean;
  installed?: boolean;
}

export async function listCommand(
  source: string | undefined,
  options: ListOptions
): Promise<void> {
  const spin = p.spinner();

  try {
    spin.start('Resolving source...');
    const repoPath = source ? await fetchRepo(source) : process.cwd();
    spin.stop(`Source: ${chalk.cyan(repoPath)}`);

    const showAll = !options.skills && !options.rules && !options.commands && !options.agents;
    const results: string[] = [];

    if (showAll || options.skills) {
      spin.start('Scanning skills...');
      const skills = await scanSkills(repoPath);
      spin.stop(`Found ${skills.length} skills`);

      if (skills.length > 0) {
        const lines = skills.map(s =>
          `  ${chalk.cyan(s.id)} ${chalk.dim('-')} ${s.description || chalk.dim('No description')}`
        );
        results.push(`${chalk.bold.underline('Skills')} (${skills.length})\n${lines.join('\n')}`);
      }
    }

    if (showAll || options.rules) {
      spin.start('Scanning rules...');
      const rules = await scanRules(repoPath);
      spin.stop(`Found ${rules.length} rules`);

      if (rules.length > 0) {
        const lines = rules.map(r =>
          `  ${chalk.cyan(r.id)} ${chalk.dim('-')} ${r.description || chalk.dim('No description')}`
        );
        results.push(`${chalk.bold.underline('Rules')} (${rules.length})\n${lines.join('\n')}`);
      }
    }

    if (showAll || options.commands) {
      spin.start('Scanning commands...');
      const commands = await scanCommands(repoPath);
      spin.stop(`Found ${commands.length} commands`);

      if (commands.length > 0) {
        const lines = commands.map(c =>
          `  ${chalk.cyan(c.id)} ${chalk.dim('-')} ${c.description || chalk.dim('No description')}`
        );
        results.push(`${chalk.bold.underline('Commands')} (${commands.length})\n${lines.join('\n')}`);
      }
    }

    if (showAll || options.agents) {
      spin.start('Scanning agents...');
      const agents = await scanAgents(repoPath);
      spin.stop(`Found ${agents.length} agents`);

      if (agents.length > 0) {
        const lines = agents.map(a =>
          `  ${chalk.cyan(a.id)} ${chalk.dim('-')} ${a.description || chalk.dim('No description')}`
        );
        results.push(`${chalk.bold.underline('Agents')} (${agents.length})\n${lines.join('\n')}`);
      }
    }

    if (results.length > 0) {
      console.log('\n' + boxen(results.join('\n\n'), {
        title: 'Available Items',
        titleAlignment: 'center',
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'round'
      }));
    } else {
      p.note('No items found in source.', 'Empty');
    }

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    spin.stop(chalk.red(`List failed: ${errMsg}`));
    process.exit(1);
  }
}
