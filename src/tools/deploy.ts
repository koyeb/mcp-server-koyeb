import * as koyeb from '@koyeb/api-client-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as tar from 'tar';
import { z } from 'zod';

import { deploymentDefinitionSchema } from '../schemas.js';
import { api, auth, createTextContent } from '../utils.js';

export function deploy(server: McpServer) {
  server.tool(
    'deploy',
    'Deploy a directory to Koyeb',
    {
      path: z.string().describe('Path to the directory to deploy'),
      appName: z.string().describe('Name of the app'),
      serviceName: z.string().describe('Name of the service'),
      definition: deploymentDefinitionSchema.partial().optional().describe('Custom deployment definition'),
    },
    async ({ path, appName, serviceName, definition: customDefinition }) => {
      const appId = await getAppId(appName);
      const serviceId = await getServiceId(appId, serviceName);
      const archiveId = await createArchive(path);

      if (serviceId) {
        const { service } = await api(koyeb.getService({ auth, path: { id: serviceId } }));

        const { deployment } = await api(
          koyeb.getDeployment({ auth, path: { id: service!.latest_deployment_id! } }),
        );

        const definition = {
          ...deployment!.definition!,
          customDefinition,
        };

        definition.archive ??= {};
        definition.archive.id = archiveId;

        delete definition.git;
        delete definition.docker;

        await api(koyeb.updateService({ auth, path: { id: serviceId }, body: { definition } }));
      } else {
        const definition: koyeb.DeploymentDefinition = {
          name: serviceName,
          archive: { id: archiveId },
          regions: ['fra'],
          instance_types: [{ type: 'nano' }],
          scalings: [{ min: 1, max: 1 }],
          ...customDefinition,
        };

        await api(koyeb.createService({ auth, body: { app_id: appId, definition } }));
      }

      return createTextContent('');
    },
  );
}

async function getAppId(appName: string): Promise<string> {
  const { apps } = await api(koyeb.listApps({ auth, query: { name: appName } }));
  const existingApp = apps!.find((app) => app.name === appName);

  if (existingApp) {
    return existingApp.id!;
  }

  const { app: createdApp } = await api(koyeb.createApp({ auth, body: { name: appName } }));

  return createdApp!.id!;
}

async function getServiceId(appId: string, serviceName: string): Promise<string | undefined> {
  const { services } = await api(koyeb.listServices({ auth, query: { app_id: appId, name: serviceName } }));
  const existingService = services!.find((service) => service.name === serviceName);

  if (existingService) {
    return existingService.id!;
  }
}

async function createArchive(path: string): Promise<string> {
  const tarball = await new Promise<Buffer>((resolve, reject) => {
    const stream = tar.create({ gzip: true, cwd: path }, ['.']);
    const buffers: Buffer[] = [];

    stream.on('error', (err) => reject(err));
    stream.on('data', (buf) => buffers.push(buf));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });

  const { archive } = await api(koyeb.createArchive({ auth, body: { size: String(tarball.length) } }));

  const response = await fetch(archive!.upload_url!, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-goog-content-length-range': `${tarball.length},${tarball.length}`,
    },
    body: tarball,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return archive!.id!;
}
