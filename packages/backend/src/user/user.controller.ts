import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

import { ErrorBadRequest } from 'src/error/error-bad-request';

@ApiExtraModels(ErrorBadRequest)
@ApiBadRequestResponse({
  description: ErrorBadRequest.description,
  schema: {
    $ref: getSchemaPath(ErrorBadRequest),
  },
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
