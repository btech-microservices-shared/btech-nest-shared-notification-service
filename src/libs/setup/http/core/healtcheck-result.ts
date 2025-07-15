import { PACKAGE_JSON } from 'src/libs/common/utils/package-json'

export type HealthcheckStatus = 'ok' | 'down'
export type HealtcheckIndicator = {
	status: 'up' | 'down'
	message?: string
}

export class HealtcheckResult {
	constructor(
		public readonly status: HealthcheckStatus,
		public readonly info: Record<string, HealtcheckIndicator>
	) {}

	static ok(): HealtcheckResult {
		return new HealtcheckResult('ok', {
			[PACKAGE_JSON.name]: {
				status: 'up'
			}
		})
	}
}
