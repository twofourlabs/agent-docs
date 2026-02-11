import * as p from '@clack/prompts';
import chalk from 'chalk';
import boxen from 'boxen';
import path from 'path';
import { fetchRepo } from '../utils/repo.js';
import { scanSkills } from '../scanners/skills.js';
import { scanRules } from '../scanners/rules.js';
import { scanCommands } from '../scanners/commands.js';
import { scanAgents } from '../scanners/agents.js';
import {
  selectArtifactTypes,
  selectItemsWithExistenceCheck,
  selectTargets,
  confirmAction
} from '../utils/prompts.js';
import { linkOrCopy } from '../utils/link.js';
import { getTargetConfig, TARGETS } from '../utils/targets.js';
import { getConfig } from '../utils/config.js';
import type { InstallOptions, ArtifactType, InstallSummary } from '../types/index.js';

type ScannerFn = (basePath: string) => Promise<Array<{ id: string; description: string; path: string }>>;

interface ExistenceMap {
  [targetDir: string]: boolean;
}

export async function installCommand(
  source: string | undefined,
  options: InstallOptions
): Promise<void> {
  const config = await getConfig();
  const spin = p.spinner();
  const { mode } = options;

  try {
    // 1. Resolve source
    spin.start('Resolving source...');
    const repoPath = source ? await fetchRepo(source) : process.cwd();
    spin.stop(`Source: ${chalk.cyan(repoPath)}`);

    // 2. Select MULTIPLE targets
    let targetKeys: string[];
    if (options.target) {
      targetKeys = [options.target];
    } else if (config.defaultTarget) {
      targetKeys = [config.defaultTarget];
    } else {
      targetKeys = await selectTargets();
    }

    const cwd = process.cwd();
    const targetConfigs = targetKeys.map(key => ({
      key,
      config: getTargetConfig(key)
    }));

    // 3. Determine artifact types
    let types: ArtifactType[];
    if (options.skills || options.rules || options.commands || options.agents) {
      types = [];
      if (options.skills) types.push('skills');
      if (options.rules) types.push('rules');
      if (options.commands) types.push('commands');
      if (options.agents) types.push('agents');
    } else {
      types = await selectArtifactTypes();
    }

    // 4. Scan for available items
    const scanners: Record<string, ScannerFn> = {
      skills: scanSkills,
      rules: scanRules,
      commands: scanCommands,
      agents: scanAgents
    };

    const available: Record<string, Array<{ id: string; description: string; path: string }>> = {};
    for (const type of types) {
      if (scanners[type]) {
        spin.start(`Scanning for ${type}...`);
        available[type] = await scanners[type](repoPath);
        spin.stop(`Found ${chalk.cyan(available[type].length)} ${type}`);
      }
    }

    // 5. Interactive selection with multi-target existence check
    const selected: Record<string, Array<{ id: string; description: string; path: string }>> = {};
    const existenceMaps: Record<string, Map<string, ExistenceMap>> = {};

    for (const type of types) {
      if (available[type]?.length > 0) {
        const targetDirs = targetConfigs.map(tc =>
          path.join(cwd, tc.config[type as keyof typeof tc.config] as string)
        );

        const result = await selectItemsWithExistenceCheck(
          available[type],
          type,
          {
            mode,
            targetDirs,
            selectAll: options.all
          }
        );
        selected[type] = result.selected;
        existenceMaps[type] = result.existsInTargets;
      }
    }

    // 6. Summary and confirm
    const totalSelected = Object.values(selected).flat().length;
    if (totalSelected === 0) {
      p.note(
        mode === 'install'
          ? 'All selected items already exist.\nUse "agent-share update" to overwrite.'
          : 'No items selected.',
        'Nothing to do'
      );
      return;
    }

    const proceed = await confirmAction(selected, targetKeys, mode);
    if (!proceed) {
      p.cancel('Cancelled.');
      return;
    }

    // 7. Install to ALL targets
    const method = options.method || config.linkMethod || 'symlink';
    const force = mode === 'update';

    const summaries: InstallSummary[] = [];

    for (const { key: targetKey, config: targetConfig } of targetConfigs) {
      const summary: InstallSummary = {
        target: targetKey,
        targetName: TARGETS[targetKey]?.name || targetKey,
        installed: 0,
        skipped: 0,
        failed: 0
      };

      p.log.step(`Installing to ${chalk.cyan(summary.targetName)}...`);

      for (const [type, items] of Object.entries(selected)) {
        for (const item of items) {
          const targetDir = path.join(cwd, targetConfig[type as keyof typeof targetConfig] as string);
          const existsMap = existenceMaps[type]?.get(item.id);
          const existsInThisTarget = existsMap?.[targetDir];

          if (mode === 'install' && existsInThisTarget) {
            summary.skipped++;
            continue;
          }

          spin.start(`${item.id} -> ${targetKey}`);

          const sourcePath = path.dirname(item.path);
          const targetPath = path.join(targetDir, item.id);

          try {
            const result = await linkOrCopy(sourcePath, targetPath, { method, force });
            if (result.success) {
              spin.stop(`${chalk.green('✓')} ${item.id}`);
              summary.installed++;
            } else {
              throw new Error(result.error);
            }
          } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            spin.stop(`${chalk.red('✗')} ${item.id}: ${errMsg}`);
            summary.failed++;
          }
        }
      }

      summaries.push(summary);
    }

    // 8. Final summary box
    const summaryLines = summaries.map(s => {
      const parts = [];
      if (s.installed > 0) parts.push(chalk.green(`${s.installed} installed`));
      if (s.skipped > 0) parts.push(chalk.yellow(`${s.skipped} skipped`));
      if (s.failed > 0) parts.push(chalk.red(`${s.failed} failed`));
      return `${chalk.bold(s.targetName)}: ${parts.join(', ') || 'none'}`;
    });

    console.log('\n' + boxen(summaryLines.join('\n'), {
      title: mode === 'install' ? 'Installation Complete' : 'Update Complete',
      titleAlignment: 'center',
      padding: 1,
      borderColor: summaries.every(s => s.failed === 0) ? 'green' : 'yellow',
      borderStyle: 'round'
    }));

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    spin.stop(chalk.red(`Failed: ${errMsg}`));
    process.exit(1);
  }
}
