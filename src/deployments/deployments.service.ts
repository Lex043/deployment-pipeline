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

  async create(data: CreateDeployment) {
    const deployment = this.deploymentRepo.create({
      name: data.name,
      gitUrl: data.gitUrl,
      status: DeploymentStatus.PENDING,
    });
    await this.deploymentRepo.save(deployment);
    this.pipeline.run(deployment.id, data.gitUrl);

    return deployment;
    //   const repoPath = `/tmp/deployments/${deployment.id}`;
    //
    //   await this.deploymentRepo.update(deployment.id, {
    //     status: DeploymentStatus.BUILDING,
    //   });
    //
    //   const gitProcess = spawn('git', ['clone', data.url, repoPath]);
    //
    //   gitProcess.stdout.on('data', (chunk) => {
    //     console.log(chunk.toString());
    //   });
    //
    //   gitProcess.stderr.on('data', (chunk) => {
    //     console.log('error', chunk.toString());
    //   });
    //
    //   gitProcess.on('close', async (code) => {
    //     if (code !== 0) {
    //       await this.deploymentRepo.update(deployment.id, {
    //         status: DeploymentStatus.FAILED,
    //       });
    //       return;
    //     }
    //
    //     const buildProcess = spawn('railpack', ['build'], {
    //       cwd: repoPath,
    //     });
    //
    //     buildProcess.stdout.on('data', (chunk) => {
    //       console.log(chunk.toString());
    //     });
    //
    //     buildProcess.stderr.on('data', (chunk) => {
    //       console.log('error', chunk.toString());
    //     });
    //
    //     buildProcess.on('close', async (code) => {
    //       if (code !== 0) {
    //         await this.deploymentRepo.update(deployment.id, {
    //           status: DeploymentStatus.FAILED,
    //         });
    //         return;
    //       }
    //
    //       // STEP 3: DEPLOY SUCCESS
    //       await this.deploymentRepo.update(deployment.id, {
    //         status: DeploymentStatus.RUNNING,
    //       });
    //     });
    //   });
  }
}
