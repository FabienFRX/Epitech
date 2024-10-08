import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Prisma } from '@prisma/client';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> 
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(dto: SaveTaskDto) {
    const data: Prisma.TaskCreateInput = {
      name: dto.name
    };
    try {
      return await this.taskRepository.save(data);
    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(dto: SaveTaskDto) {
    const data: Prisma.TaskUncheckedUpdateInput = {
      name: dto.name,
      id: dto.id
    };
    try {
      return await this.taskRepository.save(data);
    } catch(error) {
      throw new BadRequestException(error.message);
    }
  }

  async handle(dto: SaveTaskDto) {
    if (!dto || !dto.name) {
      throw new BadRequestException("error: missing name");
    }

    if (!dto.id)
      return await this.create(dto);
    return await this.update(dto);
  }
}
