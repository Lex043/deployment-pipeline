import { Module } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { Deployment } from 'src/entities/deployment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandRunnerService } from './services/command-runner.service';
import { DeploymentPipelineService } from './services/deployment-pipline.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment])],
  controllers: [DeploymentsController],
  providers: [
    DeploymentsService,
    CommandRunnerService,
    DeploymentPipelineService,
  ],
  exports: [
    DeploymentsService,
    DeploymentPipelineService,
    CommandRunnerService,
    TypeOrmModule,
  ],
})
export class DeploymentsModule {}
