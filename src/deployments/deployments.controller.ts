import { Controller, Body, Post } from '@nestjs/common';
import { CreateDeployment } from './interfaces/create-deployment';
import { DeploymentsService } from './deployments.service';

@Controller('deployments')
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  create(@Body() data: CreateDeployment) {
    return this.deploymentsService.create(data);
  }
}
