import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentAdminId } from '@vsp/backend-shared/auth-session';
import { PaginateQueryDto } from '@vsp/backend-shared/paginate';

import { CreateUserDto, UpdateUserDto } from './users.dto.js';
import { UsersService } from './users.service.js';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto, @CurrentAdminId() adminId: string) {
    return this.usersService.create(dto, adminId);
  }

  @Get()
  findAll(@Query() query: PaginateQueryDto, @CurrentAdminId() adminId: string) {
    return this.usersService.findAll(query, adminId);
  }

  @Get(':id')
  findOneById(@Param('id') id: string, @CurrentAdminId() adminId: string) {
    return this.usersService.findOneById(id, adminId);
  }

  @Put(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentAdminId() adminId: string,
  ) {
    return this.usersService.updateById(id, dto, adminId);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string, @CurrentAdminId() adminId: string) {
    return this.usersService.deleteById(id, adminId);
  }
}
