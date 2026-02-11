import type { LinkMethod } from '../types/index.js';
export interface LinkResult {
    method: LinkMethod;
    source: string;
    target: string;
    success: boolean;
    error?: string;
}
export declare function linkOrCopy(source: string, target: string, options?: {
    method?: LinkMethod;
    force?: boolean;
}): Promise<LinkResult>;
