interface RepoInfo {
    owner: string;
    repo: string;
    branch: string;
    subpath?: string;
}
export declare function parseGitHubUrl(input: string): RepoInfo;
export declare function fetchRepo(input: string): Promise<string>;
export {};
