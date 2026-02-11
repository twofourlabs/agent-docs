interface ConfigOptions {
    target?: string;
    method?: string;
    show?: boolean;
}
export declare function configCommand(options: ConfigOptions): Promise<void>;
export {};
