import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deployment } from './deployment.entity';

@Entity('deployment_logs')
export class DeploymentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deployment)
  deployment: Deployment;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
