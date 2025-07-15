import { HeaderValues } from '../header-values/header-values'

export abstract class HeaderValuesExtractor<TRequestContext = any, THeaderValues extends HeaderValues = HeaderValues> {
	abstract extract(ctx: TRequestContext): THeaderValues
}
