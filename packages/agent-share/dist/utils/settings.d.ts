export declare function mergeSettings(sourcePath: string, targetPath: string, options?: {
    backup?: boolean;
}): Promise<void>;
export declare function mergeMcp(sourcePath: string, targetPath: string): Promise<{
    added: string[];
    skipped: string[];
}>;
