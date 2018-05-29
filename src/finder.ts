import { sync } from 'fast-glob';
import { IPartialOptions } from 'fast-glob/out/managers/options';

export interface FinderSettings {
    dirs: string[],
    patterns: string[],
    globSettings?: IPartialOptions
}

const defaultGlobSettings: IPartialOptions = {
    followSymlinkedDirectories: false,
    absolute: true,
    onlyFiles: true,
    onlyDirectories: false
}

export function find(settings: FinderSettings): string[] {
    const globSettings: IPartialOptions = {
        ...defaultGlobSettings,
        ...settings.globSettings || {}
    };

    return <string[]>settings.dirs.reduce((results: string[], dir: string) => [
        ...results,
        ...sync(settings.patterns, {
            ...globSettings,
            cwd: dir
        })
    ], []);
}
