import { ApiProperty } from '@nestjs/swagger';

import { Error } from './error';

export class ErrorBadRequest extends Error {
  public static description = 'Bad Request';

  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: ErrorBadRequest.description,
  })
  error: string;

  @ApiProperty({
    example: [
      'description should not be empty',
      'description must be a string',
    ],
  })
  message: Array<string>;
}
