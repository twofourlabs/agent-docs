import { describe, it, expect, vi, beforeEach } from 'vitest';
import { linkOrCopy } from './link.js';

vi.mock('fs-extra', () => ({
  default: {
    pathExists: vi.fn(),
    remove: vi.fn(),
    ensureDir: vi.fn(),
    symlink: vi.fn(),
    copy: vi.fn()
  }
}));

vi.mock('os', () => ({
  default: {
    platform: vi.fn(() => 'darwin')
  }
}));

import fs from 'fs-extra';
import os from 'os';

describe('linkOrCopy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(os.platform).mockReturnValue('darwin');
  });

  it('copies when method is copy', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    const result = await linkOrCopy('/source', '/target', { method: 'copy' });

    expect(fs.copy).toHaveBeenCalledWith('/source', '/target');
    expect(result).toEqual({
      method: 'copy',
      source: '/source',
      target: '/target',
      success: true
    });
  });

  it('creates symlink on non-Windows by default', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);
    vi.mocked(fs.symlink).mockResolvedValue(undefined);

    const result = await linkOrCopy('/source', '/target');

    expect(fs.symlink).toHaveBeenCalledWith('/source', '/target', 'dir');
    expect(result.method).toBe('symlink');
    expect(result.success).toBe(true);
  });

  it('removes existing target when force is true', async () => {
    vi.mocked(fs.pathExists)
      .mockResolvedValueOnce(true)  // first check for force removal
      .mockResolvedValueOnce(false); // second check for exists error
    vi.mocked(fs.symlink).mockResolvedValue(undefined);

    await linkOrCopy('/source', '/target', { force: true });

    expect(fs.remove).toHaveBeenCalledWith('/target');
  });

  it('returns error when target exists without force', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);

    const result = await linkOrCopy('/source', '/target');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Target already exists');
  });

  it('falls back to copy when symlink fails', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);
    vi.mocked(fs.symlink).mockRejectedValue(new Error('Permission denied'));

    const result = await linkOrCopy('/source', '/target');

    expect(fs.copy).toHaveBeenCalledWith('/source', '/target');
    expect(result.method).toBe('copy');
    expect(result.success).toBe(true);
  });

  it('copies on Windows even with symlink method', async () => {
    vi.mocked(os.platform).mockReturnValue('win32');
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    const result = await linkOrCopy('/source', '/target', { method: 'symlink' });

    expect(fs.symlink).not.toHaveBeenCalled();
    expect(fs.copy).toHaveBeenCalledWith('/source', '/target');
    expect(result.method).toBe('copy');
  });

  it('ensures parent directory exists', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);
    vi.mocked(fs.symlink).mockResolvedValue(undefined);

    await linkOrCopy('/source', '/deep/nested/target');

    expect(fs.ensureDir).toHaveBeenCalledWith('/deep/nested');
  });
});
