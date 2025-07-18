import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createTextContent, token } from '../utils.js';

export function exec(server: McpServer) {
  server.tool(
    'exec',
    'Execute a command in a running deployment',
    {
      instanceId: z.string(),
      shell: z.string().array().default(['/bin/sh']),
      command: z.string(),
    },
    async ({ instanceId, shell, command }) => {
      const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>(
        (resolve, reject) => {
          const url = new URL(`/v1/streams/instances/exec?id=${instanceId}`, 'wss://app.koyeb.com');
          const protocols = token ? ['Bearer', token] : [];
          const socket = new WebSocket(url, protocols);

          const stdout: string[] = [];
          const stderr: string[] = [];

          const send = (data: unknown) => {
            socket.send(JSON.stringify(data));
          };

          socket.addEventListener('error', (event) => {
            reject((event as ErrorEvent).error);
          });

          socket.addEventListener('open', async () => {
            send({ id: instanceId, id_type: 'INSTANCE_ID', body: { command: shell } });
            send({ body: { stdin: { data: btoa(command + '\n') } } });
            send({ body: { stdin: { data: btoa('exit\n') } } });
          });

          socket.addEventListener('message', (event) => {
            const { data, error } = execOutputSchema.safeParse(JSON.parse(event.data));

            if (error) {
              return `Failed to parse API response: ${event.data}`;
            }

            if ('error' in data) {
              return `API error: ${data.error.message}`;
            }

            if (data.result.stdout) {
              stdout.push(atob(data.result.stdout.data));
            }

            if (data.result.stderr) {
              stderr.push(atob(data.result.stderr.data));
            }

            if (data.result.exited) {
              socket.close();

              resolve({
                stdout: stdout.join(''),
                stderr: stderr.join(''),
                exitCode: data.result.exit_code,
              });
            }
          });
        },
      );

      return createTextContent(
        [`exit code: ${result.exitCode}`, `stdout: ${result.stdout}`, `stderr: ${result.stderr}`].join(
          '\n\n',
        ),
      );
    },
  );
}

const execOutputSchema = z.union([
  z.object({
    result: z.object({
      stdout: z.object({ data: z.string() }).nullable(),
      stderr: z.object({ data: z.string() }).nullable(),
      exited: z.boolean(),
      exit_code: z.number(),
    }),
  }),
  z.object({
    error: z.object({
      message: z.string(),
      details: z.unknown(),
    }),
  }),
]);
