interface ListOptions {
    skills?: boolean;
    rules?: boolean;
    commands?: boolean;
    agents?: boolean;
    installed?: boolean;
}
export declare function listCommand(source: string | undefined, options: ListOptions): Promise<void>;
export {};
