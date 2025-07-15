import { Global, Module } from '@nestjs/common'
import { AriGrpcModule } from '../grpc/grpc.module'
import { AriTcpModule } from '../tcp/tcp.module'
import { AriRpcErrorFilter } from './filters/ari-rpc-error.filter'

@Global()
@Module({
	imports: [AriGrpcModule, AriTcpModule],
	providers: [AriRpcErrorFilter]
})
export class RpcSetupModule {}
