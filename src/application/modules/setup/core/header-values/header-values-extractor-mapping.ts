import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { HeaderValues } from './header-values'
import { HeaderValuesExtractor } from './header-values-extractor'
import { HeaderValuesExtractorProcessor } from './header-values-extractor-processor'
import { HeaderValuesTransformation } from './header-values-transformation'

export type HeaderValuesExtractorType = 'http' | string

@Injectable()
export class HeaderValuesExtractorMapping implements OnApplicationShutdown {
	private readonly map: Map<HeaderValuesExtractorType, HeaderValuesExtractorProcessor> = new Map()

	onApplicationShutdown(signal?: string): void {
		this.map.clear()
	}

	register(type: HeaderValuesExtractorType, headerValuesExtractor: HeaderValuesExtractor): void {
		this.get(type).setExtractor(headerValuesExtractor)
	}

	registerTransformation<THeaderValues extends HeaderValues, O extends HeaderValues>(
		type: HeaderValuesExtractorType,
		transformation: HeaderValuesTransformation<THeaderValues, O>
	) {
		this.get(type).addTransformation(transformation)
	}

	get(type: HeaderValuesExtractorType): HeaderValuesExtractorProcessor {
		if (this.map.has(type)) {
			return this.map.get(type)
		} else {
			const processor = new HeaderValuesExtractorProcessor()
			this.map.set(type, processor)

			return processor
		}
	}
}
