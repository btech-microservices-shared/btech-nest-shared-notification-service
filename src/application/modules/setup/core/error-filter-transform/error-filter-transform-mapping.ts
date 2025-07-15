import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { ErrorFilterTransform } from './error-filter-transform'

export type ErrorFilterTransformType = 'grpc' | string

@Injectable()
export class ErrorFilterTransformMapping implements OnApplicationShutdown {
	private map: Map<ErrorFilterTransformType, ErrorFilterTransform> = new Map()

	onApplicationShutdown(signal?: string): void {
		this.map.clear()
	}

	register(type: ErrorFilterTransformType, transform: ErrorFilterTransform) {
		this.map.set(type, transform)
	}

	get(type: ErrorFilterTransformType): ErrorFilterTransform {
		return this.map.get(type)
	}
}
