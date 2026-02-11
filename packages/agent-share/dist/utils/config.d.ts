import type { Config } from '../types/index.js';
export declare function getConfig(): Promise<Config>;
export declare function setConfig(updates: Partial<Config>): Promise<void>;
export declare function showConfig(): Promise<void>;
