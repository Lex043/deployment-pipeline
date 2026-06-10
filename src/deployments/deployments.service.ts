import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment } from 'src/entities/deployment.entity';
import { Repository } from 'typeorm';
import { CreateDeployment } from './interfaces/create-deployment';
import { DeploymentStatus } from 'src/entities/deployment.entity';
import { DeploymentPipelineService } from './services/deployment-pipline.service';

@Injectable()
export class DeploymentsService {
  constructor(
    @InjectRepository(Deployment)
    private deploymentRepo: Repository<Deployment>,
    private pipeline: DeploymentPipelineService,
  ) {}

  findAll() {
    return this.deploymentRepo.find();
  }

  async create(data: CreateDeployment) {
    const deployment = this.deploymentRepo.create({
      name: data.name,
      gitUrl: data.gitUrl,
      status: DeploymentStatus.PENDING,
    });
    await this.deploymentRepo.save(deployment);
    this.pipeline.run(deployment.id, data.gitUrl);

    return deployment;
  }
}
