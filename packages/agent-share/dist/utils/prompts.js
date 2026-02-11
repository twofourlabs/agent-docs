import * as p from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { TARGETS } from './targets.js';
// Cancel handler
function handleCancel(value) {
    if (p.isCancel(value)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }
}
export async function selectArtifactTypes() {
    const types = await p.multiselect({
        message: 'What would you like to install?',
        options: [
            { value: 'skills', label: 'Skills', hint: 'Slash commands and automations' },
            { value: 'rules', label: 'Rules', hint: 'Context rules and guidelines' },
            { value: 'commands', label: 'Commands', hint: 'Custom CLI commands' },
            { value: 'agents', label: 'Agents', hint: 'Agent configurations' },
        ],
        required: true,
        initialValues: ['skills']
    });
    handleCancel(types);
    return types;
}
// NEW: Multi-target selection (returns string[])
export async function selectTargets() {
    const targets = await p.multiselect({
        message: 'Where to install?',
        options: [
            { value: '.claude', label: 'Claude Code', hint: '.claude/' },
            { value: '.cursor', label: 'Cursor IDE', hint: '.cursor/' },
            { value: '.agents', label: 'Shared', hint: '.agents/' },
        ],
        required: true,
        initialValues: ['.claude']
    });
    handleCancel(targets);
    const addCustom = await p.confirm({
        message: 'Add a custom path?',
        initialValue: false
    });
    handleCancel(addCustom);
    if (addCustom) {
        const customPath = await p.text({
            message: 'Enter custom path:',
            placeholder: './my-config',
            validate: (value) => {
                if (!value)
                    return 'Path is required';
                return undefined;
            }
        });
        handleCancel(customPath);
        return [...targets, customPath];
    }
    return targets;
}
// Keep single target for backward compatibility
export async function selectTarget() {
    const target = await p.select({
        message: 'Where to install?',
        options: [
            { value: '.claude', label: 'Claude Code', hint: '.claude/' },
            { value: '.cursor', label: 'Cursor IDE', hint: '.cursor/' },
            { value: '.agents', label: 'Shared', hint: '.agents/' },
            { value: 'custom', label: 'Custom path...' },
        ]
    });
    handleCancel(target);
    if (target === 'custom') {
        const customPath = await p.text({
            message: 'Enter custom path:',
            placeholder: './my-config'
        });
        handleCancel(customPath);
        return customPath;
    }
    return target;
}
export async function selectItemsWithExistenceCheck(items, type, options) {
    const { mode, targetDirs, selectAll } = options;
    // Check which items exist in which targets
    const existsInTargets = new Map();
    for (const item of items) {
        const existsMap = {};
        for (const targetDir of targetDirs) {
            const targetPath = path.join(targetDir, item.id);
            existsMap[targetDir] = await fs.pathExists(targetPath);
        }
        existsInTargets.set(item.id, existsMap);
    }
    // Check if item exists in ANY target
    const existsInAny = (itemId) => {
        const map = existsInTargets.get(itemId);
        if (!map)
            return false;
        return Object.values(map).some(v => v);
    };
    if (selectAll) {
        if (mode === 'install') {
            const newItems = items.filter(i => !existsInAny(i.id));
            return { selected: newItems, existsInTargets };
        }
        return { selected: items, existsInTargets };
    }
    // Build options
    const itemOptions = items.map(item => {
        const existsAny = existsInAny(item.id);
        const existsCount = Object.values(existsInTargets.get(item.id) || {}).filter(Boolean).length;
        let hint = '';
        if (existsAny) {
            hint = `exists in ${existsCount}/${targetDirs.length} targets`;
        }
        else {
            hint = 'new';
        }
        const desc = item.description || '';
        return {
            value: item.id,
            label: `${item.id} ${chalk.dim(`- ${desc.slice(0, 35)}${desc.length > 35 ? '...' : ''}`)}`,
            hint
        };
    });
    const response = await p.multiselect({
        message: mode === 'install'
            ? `Select ${type} to install:`
            : `Select ${type} to update:`,
        options: itemOptions,
        required: false
    });
    handleCancel(response);
    const selectedIds = response;
    const selected = items.filter(i => selectedIds.includes(i.id));
    return { selected, existsInTargets };
}
export async function confirmAction(selected, targets, mode) {
    const totalSelected = Object.values(selected).flat().length;
    const summaryLines = Object.entries(selected)
        .filter(([, items]) => items.length > 0)
        .map(([type, items]) => `${chalk.green(items.length)} ${type}`);
    const targetNames = targets.map(t => TARGETS[t]?.name || t).join(', ');
    p.note(summaryLines.join('\n') + '\n\n' + chalk.dim('Targets: ') + targetNames, mode === 'install' ? 'Install Summary' : 'Update Summary');
    const proceed = await p.confirm({
        message: `${mode === 'install' ? 'Install' : 'Update'} ${totalSelected} item(s) to ${targets.length} target(s)?`,
        initialValue: true
    });
    handleCancel(proceed);
    return proceed;
}
