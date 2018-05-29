import { IPartialOptions } from 'fast-glob/out/managers/options';
export interface FinderSettings {
    dirs: string[];
    patterns: string[];
    globSettings?: IPartialOptions;
}
export declare function find(settings: FinderSettings): string[];
