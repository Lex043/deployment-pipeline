import { IsNotEmpty } from 'class-validator';

export class CreateDeployment {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  gitUrl: string;
}
