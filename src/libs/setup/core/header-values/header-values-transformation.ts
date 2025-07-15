import { HeaderValues } from './header-values'

export abstract class HeaderValuesTransformation<THeaderValues extends HeaderValues, O extends HeaderValues, TRequestContext = any> {
	abstract transform(headerValues: THeaderValues, req: TRequestContext): O
}
