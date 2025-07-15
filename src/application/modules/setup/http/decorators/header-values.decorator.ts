import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetHeaderValues = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	return ctx.switchToHttp().getRequest().headerValues
})
