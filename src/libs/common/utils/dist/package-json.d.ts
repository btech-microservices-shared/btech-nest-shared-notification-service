export interface PackageJson {
    name: string;
    version: string;
    description?: string;
    license: string;
    author?: string;
    [key: string]: string;
}
export declare const PACKAGE_JSON: PackageJson;
