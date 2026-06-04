import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment, DeploymentStatus } from 'src/entities/deployment.entity';
import { Repository } from 'typeorm';
import { CommandRunnerService } from './command-runner.service';

@Injectable()
export class DeploymentPipelineService {
  constructor(
    @InjectRepository(Deployment)
    private repo: Repository<Deployment>,
    private runner: CommandRunnerService,
  ) {}

  async run(id: number, gitUrl: string) {
    const repoPath = `/tmp/deployments/${id}`;
    const imageTag = `deployment-${id}:latest`;
    try {
      await this.update(id, DeploymentStatus.BUILDING);
      await this.runner.runCommand('git', ['clone', gitUrl, repoPath], id);
      await this.runner.runCommand('railpack', ['build', repoPath], id);
      await this.update(id, DeploymentStatus.DEPLOYING);
      await this.runner.runCommand(
        'docker',
        ['run', '-d', '-p', '3000:3000', imageTag],
        id,
      );
      await this.update(id, DeploymentStatus.RUNNING);
    } catch (e) {
      await this.update(id, DeploymentStatus.FAILED);
    }
  }
  private update(id: number, status: DeploymentStatus) {
    return this.repo.update(id, { status });
  }
}
