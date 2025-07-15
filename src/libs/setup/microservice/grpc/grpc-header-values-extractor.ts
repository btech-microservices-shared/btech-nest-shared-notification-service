import { Metadata } from '@grpc/grpc-js'
import { RequestContext } from '@nestjs/microservices'
import { randomUUID } from 'crypto'
import { DEFAULT_TIMEZONE } from 'src/libs/common/utils/global-constants'
import { HeaderValuesExtractor } from '../../core/header-values/header-values-extractor'
import { GrpcHeaderValues } from './grpc-header-values'

export class GrpcHeaderValuesExtractor extends HeaderValuesExtractor<RequestContext, GrpcHeaderValues> {
	getValueFromMeta(md: Metadata, key: string) {
		return md.get(key)?.at(0) as string
	}

	extract(req: RequestContext): GrpcHeaderValues {
		const metadata = req.getContext() as Metadata

		return new GrpcHeaderValues({
			transactionId: this.getValueFromMeta(metadata, 'transactionid') ?? randomUUID(),
			timezone: DEFAULT_TIMEZONE
			// appId: this.getValueFromMeta(metadata, 'appid'),
			// appTypeId: this.getValueFromMeta(metadata, 'apptypeid'),
			// channelId: this.getValueFromMeta(metadata, 'channelId'),
			// commerceId: this.getValueFromMeta(metadata, 'commerceid'),
			// partnerId: this.getValueFromMeta(metadata, 'partnerid'),
			// companyId: this.getValueFromMeta(metadata, 'companyid'),
			// companyDb: this.getValueFromMeta(metadata, 'companydb')
		})
	}
}
