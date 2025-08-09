import { HttpStatus } from '@nestjs/common';

export interface EmailErrorResponse {
  message: string;
  statusCode: HttpStatus;
}
