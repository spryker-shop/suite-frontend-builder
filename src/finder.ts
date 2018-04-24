import { sync } from 'fast-glob';
import { IPartialOptions } from 'fast-glob/out/managers/options';

export interface FinderSettings {
    dirs: string[],
    patterns: string[],
    globSettings?: IPartialOptions
}

export class Finder {
    find(settings: FinderSettings): string[] {
        const globSettings: IPartialOptions = {
            followSymlinkedDirectories: false,
            absolute: true,
            onlyFiles: true,
            onlyDirectories: false,

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
}
