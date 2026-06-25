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
    const basePort = 3000;
    const port = basePort + id;

    let imageTag: string | null = null;

    try {
      // BUILDING
      await this.update(id, DeploymentStatus.BUILDING);

      // CLONE
      const clone = this.runner.runCommand(
        'git',
        ['clone', gitUrl, repoPath],
        id,
      );

      // WAIT FOR MY REPO TO FINISH CLONING
      await clone.promise;

      // RAILPACK BUILD (CAPTURE OUTPUT)

      const railpack = this.runner.runCommand(
        'railpack',
        ['build', repoPath],
        id,
      );

      railpack.process.stdout.on('data', async (chunk) => {
        const text = chunk.toString();

        const match = text.match(/Loaded image:\s(.+)/);

        if (match) {
          imageTag = match[1].trim();

          if (imageTag) {
            await this.repo.update(id, {
              imageTag,
            });
          }
        }
      });
      await railpack.promise;

      if (!imageTag) {
        throw new Error('Image tag not produced by Railpack');
      }

      // DEPLOYING
      await this.update(id, DeploymentStatus.DEPLOYING);

      const docker = this.runner.runCommand(
        'docker',
        ['run', '-d', '-p', `${port}:3000`, imageTag],
        id,
      );

      await docker.promise;

      const liveUrl = `http://localhost:${port}`;

      // 5. RUNNING
      await this.repo.update(id, {
        status: DeploymentStatus.RUNNING,
        live_url: liveUrl,
      });
    } catch (e) {
      console.error(e);
      await this.update(id, DeploymentStatus.FAILED);
    }
  }

  private update(id: number, status: DeploymentStatus) {
    return this.repo.update(id, { status });
  }
}
