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
    const child = spawn(cmd, args, options);

    const promise = new Promise<void>((resolve, reject) => {
      child.on('close', (code) => {
        console.log(`[${id}] process exited with code:`, code);
        if (code === 0) return resolve();
        reject(new Error(`${cmd} failed`));
      });
    });

    child.stdout.on('data', (chunk) => {
      console.log(`[${id} STDOUT] ${chunk.toString()}`);
    });

    child.stderr.on('data', (chunk) => {
      console.log(`[${id} STDERR ${cmd}] ${chunk.toString()}`);
    });

    return { process: child, promise };
  }
}
