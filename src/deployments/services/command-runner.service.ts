import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class CommandRunnerService {
  runCommand(
    cmd: string,
    args: string[],
    id: number,
    options?: { cwd?: string },
  ) {
    return new Promise<void>((resolve, reject) => {
      const process = spawn(cmd, args, options);

      process.stdout.on('data', (chunk) => {
        console.log(`[${id} STDOUT] ${chunk.toString()}`);
      });

      process.stderr.on('data', (chunk) => {
        console.log(`[${id} STDERR ${cmd}] ${chunk.toString()}`);
      });

      process.on('close', (code) => {
        console.log(`[${id}] process exited with code:`, code);
        if (code === 0) return resolve();
        reject(new Error(`${cmd} failed`));
      });
    });
  }
}
