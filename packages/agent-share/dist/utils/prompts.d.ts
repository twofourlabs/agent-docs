import type { ArtifactType } from '../types/index.js';
export declare function selectArtifactTypes(): Promise<ArtifactType[]>;
export declare function selectTargets(): Promise<string[]>;
export declare function selectTarget(): Promise<string>;
interface SelectableItem {
    id: string;
    description: string;
    path: string;
}
interface SelectItemsOptions {
    mode: 'install' | 'update';
    targetDirs: string[];
    selectAll?: boolean;
}
interface ExistenceMap {
    [targetDir: string]: boolean;
}
export declare function selectItemsWithExistenceCheck<T extends SelectableItem>(items: T[], type: string, options: SelectItemsOptions): Promise<{
    selected: T[];
    existsInTargets: Map<string, ExistenceMap>;
}>;
export declare function confirmAction(selected: Record<string, unknown[]>, targets: string[], mode: 'install' | 'update'): Promise<boolean>;
export {};
