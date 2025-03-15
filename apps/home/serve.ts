// apps/home/serve.ts
import { env } from 'shared';
import { exec } from 'child_process';

const command = `ng serve --host ${env.HOST} --port ${env.HOME_APP_PORT} --serve-path /home/`;

exec(command, (error: Error | null, stdout: string, stderr: string) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});