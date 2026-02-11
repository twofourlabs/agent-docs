import { describe, it, expect } from 'vitest';
import { parseGitHubUrl } from './repo.js';

describe('parseGitHubUrl', () => {
  it('parses owner/repo format', () => {
    const result = parseGitHubUrl('owner/repo');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      subpath: undefined
    });
  });

  it('parses https://github.com/owner/repo format', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      subpath: undefined
    });
  });

  it('strips .git suffix from repo', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo.git');
    expect(result.repo).toBe('repo');
  });

  it('parses URL with branch specified', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo/tree/develop');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'develop',
      subpath: undefined
    });
  });

  it('parses URL with branch and subpath', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo/tree/main/src/utils');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      subpath: 'src/utils'
    });
  });

  it('parses owner/repo with trailing path as branch (current behavior)', () => {
    // Note: The simple owner/repo pattern treats the third segment as branch, not subpath
    // This matches how GitHub shorthand works: owner/repo/branch
    const result = parseGitHubUrl('owner/repo/develop');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'develop',
      subpath: undefined
    });
  });

  it('throws error for invalid URL', () => {
    expect(() => parseGitHubUrl('invalid')).toThrow('Invalid GitHub URL: invalid');
    expect(() => parseGitHubUrl('')).toThrow('Invalid GitHub URL: ');
  });
});
