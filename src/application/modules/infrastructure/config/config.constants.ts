export const CONFIG_SERVICE_PROVIDER = 'ConfigService'
export const ENVIRONMENT = process.env.NODE_ENV ?? 'development'
export const DEFAULT_FILE_PATH = `${process.cwd()}/environments/${ENVIRONMENT}.env`
