import { RequestContext } from '@nestjs/microservices'
import { randomUUID } from 'crypto'
import { DEFAULT_TIMEZONE } from 'src/libs/common/utils/global-constants'
import { HeaderValuesExtractor } from '../../core/header-values/header-values-extractor'
import { TcpHeaderValues } from './tcp-header-values'

export class TcpHeaderValuesExtractor extends HeaderValuesExtractor<RequestContext, TcpHeaderValues> {
	extract(req: RequestContext): TcpHeaderValues {
		const data = req.getData()

		return new TcpHeaderValues({
			transactionId: data?.transactionId ?? randomUUID(),
			timezone: data?.timezone ?? DEFAULT_TIMEZONE
			// appId: data?.appId,
			// appTypeId: data?.appTypeId,
			// channelId: data?.channelId,
			// commerceId: data?.commerceId ?? data?.companyId,
			// partnerId: data?.partnerId,
			// companyId: data?.companyId,
			// companyDb: data?.companyDb
		})
	}
}
