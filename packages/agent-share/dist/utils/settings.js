import fs from 'fs-extra';
import path from 'path';
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])) {
            result[key] = deepMerge(target[key], source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
}
export async function mergeSettings(sourcePath, targetPath, options = {}) {
    const { backup = true } = options;
    const sourceSettings = await fs.readJson(sourcePath);
    let targetSettings = {};
    if (await fs.pathExists(targetPath)) {
        if (backup) {
            await fs.copy(targetPath, `${targetPath}.backup`);
        }
        targetSettings = await fs.readJson(targetPath);
    }
    const merged = deepMerge(targetSettings, sourceSettings);
    await fs.writeJson(targetPath, merged, { spaces: 2 });
}
export async function mergeMcp(sourcePath, targetPath) {
    const sourceMcp = await fs.readJson(sourcePath);
    let targetMcp = { mcpServers: {} };
    if (await fs.pathExists(targetPath)) {
        targetMcp = await fs.readJson(targetPath);
        if (!targetMcp.mcpServers) {
            targetMcp.mcpServers = {};
        }
    }
    const added = [];
    const skipped = [];
    for (const [name, config] of Object.entries(sourceMcp.mcpServers || {})) {
        if (targetMcp.mcpServers[name]) {
            skipped.push(name);
            continue;
        }
        targetMcp.mcpServers[name] = config;
        added.push(name);
    }
    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeJson(targetPath, targetMcp, { spaces: 2 });
    return { added, skipped };
}
