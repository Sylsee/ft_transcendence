// NestJs imports
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

// Local files
import { ErrorBadRequest } from 'src/error/error-bad-request';
import { UserService } from './user.service';

@ApiExtraModels(ErrorBadRequest)
@ApiBadRequestResponse({
  description: ErrorBadRequest.description,
  schema: {
    $ref: getSchemaPath(ErrorBadRequest),
  },
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
