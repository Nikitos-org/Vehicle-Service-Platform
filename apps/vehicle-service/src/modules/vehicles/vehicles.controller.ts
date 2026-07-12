import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentAccountId } from '@vsp/backend-shared/auth-session';

import {
  CreateVehicleDto,
  ListVehiclesQueryDto,
  UpdateVehicleDto,
} from './vehicles.dto.js';
import { VehiclesService } from './vehicles.service.js';

@UseGuards(AuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(
    @CurrentAccountId() accountId: string,
    @Query() query: ListVehiclesQueryDto,
  ) {
    return this.vehiclesService.findAll(accountId, query);
  }

  @Get(':id')
  findOneById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccountId() accountId: string,
  ) {
    return this.vehiclesService.findOneById(id, accountId);
  }

  @Post()
  create(@Body() dto: CreateVehicleDto, @CurrentAccountId() accountId: string) {
    return this.vehiclesService.create(dto, accountId);
  }

  @Put(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
    @CurrentAccountId() accountId: string,
  ) {
    return this.vehiclesService.updateById(id, dto, accountId);
  }

  @Delete(':id')
  deleteById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccountId() accountId: string,
  ) {
    return this.vehiclesService.deleteById(id, accountId);
  }
}
