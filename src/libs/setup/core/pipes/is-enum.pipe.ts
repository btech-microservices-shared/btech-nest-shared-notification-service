import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isEnum } from 'class-validator'
import { isUnset } from 'src/libs/lib/utils'

export interface IsEnumPipeOptions {
	nullable?: boolean
}

@Injectable()
export class IsEnumPipe<T> implements PipeTransform<any, T> {
	constructor(
		private readonly entity: any,
		private options?: IsEnumPipeOptions
	) {}

	transform(value: any, argumentMetadata: ArgumentMetadata): T {
		if (isUnset(this.options)) {
			this.options = {}
		}

		if (!(this.options.nullable === true) && isEnum(value, this.entity)) {
			throw new BadRequestException(`invalid value ${value}`)
		}

		return value
	}
}
