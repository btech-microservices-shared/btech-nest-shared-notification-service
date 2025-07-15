import { IsNotEmpty, IsString } from 'class-validator'

export class SendCodeDto {
	@IsNotEmpty()
	@IsString()
	to: string

	@IsNotEmpty()
	@IsString()
	code: string

	@IsNotEmpty()
	@IsString()
	companyName: string

	@IsNotEmpty()
	@IsString()
	logoUrl: string
}
