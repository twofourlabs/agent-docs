import * as tar from 'tar';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
export function parseGitHubUrl(input) {
    // Handle: owner/repo, https://github.com/owner/repo, owner/repo/path/to/folder
    const patterns = [
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?(?:\/(.+))?$/,
        /^([^/]+)\/([^/]+)(?:\/(.+))?$/
    ];
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
            return {
                owner: match[1],
                repo: match[2].replace('.git', ''),
                branch: match[3] || 'main',
                subpath: match[4]
            };
        }
    }
    throw new Error(`Invalid GitHub URL: ${input}`);
}
export async function fetchRepo(input) {
    // Check if local path
    if (await fs.pathExists(input)) {
        return path.resolve(input);
    }
    const { owner, repo, branch } = parseGitHubUrl(input);
    const tempDir = path.join(os.tmpdir(), 'agent-share', `${owner}-${repo}-${Date.now()}`);
    await fs.ensureDir(tempDir);
    // Try main first, then master
    const branches = branch === 'main' ? ['main', 'master'] : [branch];
    let response = null;
    for (const b of branches) {
        const tarUrl = `https://github.com/${owner}/${repo}/archive/${b}.tar.gz`;
        response = await fetch(tarUrl);
        if (response.ok)
            break;
    }
    if (!response || !response.ok) {
        throw new Error(`Failed to fetch: Repository not found or not accessible`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    // Write to temp file and extract
    const tarPath = path.join(tempDir, 'repo.tar.gz');
    await fs.writeFile(tarPath, buffer);
    await tar.extract({
        cwd: tempDir,
        file: tarPath,
        strip: 1
    });
    await fs.remove(tarPath);
    return tempDir;
}
