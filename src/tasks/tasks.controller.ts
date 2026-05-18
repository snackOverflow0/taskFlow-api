import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  Query
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateTaskDto } from './dto/create-task.dto';

import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private tasksService: TasksService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,

    @Req() req: any,
  ) {
    return this.tasksService.create(
      dto,
      req.user.id,
    );
  }

  @Get()
  getAll(
    @Req() req: any,

    @Query('search') search?: string,

    @Query('page') page?: string,

    @Query('limit') limit?: string,

    @Query('completed') completed?: string,

    @Query('priority') priority?: string,

    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.tasksService.getAll(
      req.user.id,

      {
        search,

        page: Number(page) || 1,

        limit: Number(limit) || 5,

        completed,

        priority,

        sort,
      },
      
    );
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body() dto: UpdateTaskDto,

    @Req() req: any,
  ) {
    return this.tasksService.update(
      id,
      dto,
      req.user.id,
    );
  }

  @Delete(':id')
  delete(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Req() req: any,
  ) {
    return this.tasksService.delete(
      id,
      req.user.id,
    );
  }
}