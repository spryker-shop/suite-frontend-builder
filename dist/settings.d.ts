import { FinderSettings } from './finder';
export interface Paths {
    public: string;
    core: {
        modules: string;
        shopUiModule: string;
    };
    project: {
        modules: string;
        shopUiModule: string;
    };
}
export interface Settings {
    name: string;
    theme: string;
    context: string;
    paths: Paths;
    find: {
        componentEntryPoints: FinderSettings;
        componentStyles: FinderSettings;
    };
}
