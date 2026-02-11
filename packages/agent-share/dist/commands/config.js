import chalk from 'chalk';
import { setConfig, showConfig } from '../utils/config.js';
export async function configCommand(options) {
    if (options.show || (!options.target && !options.method)) {
        await showConfig();
        return;
    }
    const updates = {};
    if (options.target) {
        updates.defaultTarget = options.target;
        console.log(chalk.green(`✓ Default target set to: ${options.target}`));
    }
    if (options.method) {
        if (options.method !== 'symlink' && options.method !== 'copy') {
            console.log(chalk.red('Invalid method. Use "symlink" or "copy".'));
            process.exit(1);
        }
        updates.linkMethod = options.method;
        console.log(chalk.green(`✓ Link method set to: ${options.method}`));
    }
    await setConfig(updates);
}
