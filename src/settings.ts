import { FinderSettings } from './finder';

export interface RelativePaths {
    public: string,
    shop: string,
    ui: {
        shop: string,
        project: string
    }
}

export interface AbsolutePaths extends RelativePaths {
    context: string
}

export interface Settings {
    name: string,
    theme: string,
    paths: RelativePaths,
    dirs: AbsolutePaths,
    find: {
        componentEntryPoints: FinderSettings,
        componentStyles: FinderSettings
    }
}
