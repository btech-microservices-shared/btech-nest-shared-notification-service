import { isUnset } from 'src/libs/common/utils/types-functions'

export enum CompanyEnum {
	WILLKAPOWER = 'WILLKAPOWER',
	INCANELECTRIC = 'INCANELECTRIC'
}

export namespace CompanyEnum {
	export function getName(company: CompanyEnum): string {
		if (isUnset(company)) {
			throw new Error('Error to get company name.')
		}

		const names: Record<CompanyEnum, string> = {
			[CompanyEnum.INCANELECTRIC]: 'Incan Electric',
			[CompanyEnum.WILLKAPOWER]: 'Willka Power'
		}

		return names[company]
	}

	export function getLogoUrl(company: CompanyEnum): string {
		if (isUnset(company)) {
			throw new Error('Error to get company logo url.')
		}

		const urls: Record<CompanyEnum, string> = {
			[CompanyEnum.INCANELECTRIC]: 'https://tuesdays3.sfo3.digitaloceanspaces.com/LOGO_INCAN_ROJO_1_1_e1671788654389_e1a17bac22_5ab5964982.png',
			[CompanyEnum.WILLKAPOWER]: 'https://tuesdays3.sfo3.digitaloceanspaces.com/16753fb054e318eedb5456acfaca5575.png'
		}

		return urls[company]
	}
}
