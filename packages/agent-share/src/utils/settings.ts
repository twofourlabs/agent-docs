import fs from 'fs-extra';
import path from 'path';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

export async function mergeSettings(
  sourcePath: string,
  targetPath: string,
  options: { backup?: boolean } = {}
): Promise<void> {
  const { backup = true } = options;

  const sourceSettings = await fs.readJson(sourcePath);

  let targetSettings: Record<string, unknown> = {};
  if (await fs.pathExists(targetPath)) {
    if (backup) {
      await fs.copy(targetPath, `${targetPath}.backup`);
    }
    targetSettings = await fs.readJson(targetPath);
  }

  const merged = deepMerge(targetSettings, sourceSettings);
  await fs.writeJson(targetPath, merged, { spaces: 2 });
}

export async function mergeMcp(
  sourcePath: string,
  targetPath: string
): Promise<{ added: string[]; skipped: string[] }> {
  const sourceMcp = await fs.readJson(sourcePath);

  let targetMcp: { mcpServers: Record<string, unknown> } = { mcpServers: {} };
  if (await fs.pathExists(targetPath)) {
    targetMcp = await fs.readJson(targetPath);
    if (!targetMcp.mcpServers) {
      targetMcp.mcpServers = {};
    }
  }

  const added: string[] = [];
  const skipped: string[] = [];

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
