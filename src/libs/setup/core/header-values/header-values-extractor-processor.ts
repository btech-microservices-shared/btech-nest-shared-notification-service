import { isSet } from 'src/libs/lib/utils'
import { HeaderValues } from './header-values'
import { HeaderValuesExtractor } from './header-values-extractor'
import { HeaderValuesTransformation } from './header-values-transformation'

export class HeaderValuesExtractorProcessor<TRequestContext = any, THeaderValues extends HeaderValues = HeaderValues> {
	private extractor?: HeaderValuesExtractor<TRequestContext, THeaderValues>
	private transformations: Array<HeaderValuesTransformation<any, any>> = []

	setExtractor(extractor: HeaderValuesExtractor<TRequestContext, THeaderValues>): this {
		this.extractor = extractor
		return this
	}

	addTransformation(transformation: HeaderValuesTransformation<any, any>): this {
		this.transformations.push(transformation)
		return this
	}

	process(ctx: TRequestContext): THeaderValues {
		let headerValues = this.extractor?.extract(ctx)

		if (isSet(headerValues)) {
			if (this.transformations.length > 0) {
				for (const transformation of this.transformations) {
					headerValues = transformation.transform(headerValues, ctx)
				}
			}
		}

		return headerValues
	}
}
