import { randomUUID } from 'crypto'
import { FastifyBaseLogger, FastifyRequest, FastifySchema, FastifyTypeProviderDefault, RawServerDefault, RouteGenericInterface } from 'fastify'
import { ResolveFastifyRequestType } from 'fastify/types/type-provider'
import { IncomingMessage } from 'http'
import { DEFAULT_TIMEZONE } from 'src/libs/common/utils/global-constants'
import { HeaderValuesExtractor } from '../../core/header-values/header-values-extractor'
import { FastifyHeaderValues } from './fastify-header-values'

export class FastifyHeaderValuesExtractor extends HeaderValuesExtractor<FastifyRequest, FastifyHeaderValues> {
	extract(
		req: FastifyRequest<
			RouteGenericInterface,
			RawServerDefault,
			IncomingMessage,
			FastifySchema,
			FastifyTypeProviderDefault,
			unknown,
			FastifyBaseLogger,
			ResolveFastifyRequestType<FastifyTypeProviderDefault, FastifySchema, RouteGenericInterface>
		>
	): FastifyHeaderValues {
		return new FastifyHeaderValues({
			transactionId: (req.headers['x-transaction-id'] as string) ?? randomUUID(),
			timezone: (req.headers['x-timezone'] as string) ?? DEFAULT_TIMEZONE
			// appId: req.headers['x-app-id'] as string,
			// appTypeId: req.headers['x-app-type-id'] as string,
			// channelId: req.headers['x-channel-id'] as string,
			// commerceId: (req.headers['x-commerce-id'] ?? req.headers['x-company-id']) as string,
			// partnerId: req.headers['x-partner-id'] as string,
			// companyId: req.headers['x-company-id'] as string,
			// companyDb: req.headers['x-company-db'] as string
		})
	}
}
