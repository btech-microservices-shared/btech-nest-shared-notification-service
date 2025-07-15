import { join } from 'path'

export interface PackageJson {
	name: string
	version: string
	description?: string
	license: string
	author?: string
	[key: string]: string
}

export const PACKAGE_JSON: PackageJson = require(join(process.cwd(), 'package.json'))
