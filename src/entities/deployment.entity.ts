import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { DeploymentLog } from './deployment-logs.entity';

export enum DeploymentStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  DEPLOYING = 'deploying',
  RUNNING = 'running',
  FAILED = 'failed',
}

@Entity('deployments')
export class Deployment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'git_url' })
  gitUrl: string;

  @Column({ name: 'image_tag', nullable: true })
  imageTag?: string;

  @Column({ name: 'live_url', nullable: true })
  live_url?: string;

  @Column({
    type: 'enum',
    enum: DeploymentStatus,
    default: DeploymentStatus.PENDING,
  })
  status: DeploymentStatus;

  @OneToMany(() => DeploymentLog, (log) => log.deployment)
  logs?: DeploymentLog[];

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
