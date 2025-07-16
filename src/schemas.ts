import { z } from 'zod';

// prettier-ignore
const buildpackBuilder = z.object({
  build_command: z.string().optional().describe('A command used to override the build command, run after all build steps'),
  privileged: z.boolean().optional().describe('A flag to run the container in privileged mode'),
  run_command: z.string().optional().describe('A command used to override the default run command'),
})

// prettier-ignore
const dockerBuilder = z.object({
  args: z.string().array().optional().describe('The docker CMD args'),
  command: z.string().optional().describe('The docker CMD'),
  dockerfile: z.string().optional().describe('A path to the Dockerfile'),
  entrypoint: z.string().array().optional().describe('The docker ENTRYPOINT'),
  privileged: z.boolean().optional().describe('A flag to run the container in privileged mode'),
  target: z.string().optional().describe('The target for multi-stage builds'),
})

// prettier-ignore
const archive = z.object({
  buildpack: buildpackBuilder.optional(),
  docker: dockerBuilder.optional(),
  id: z.string().optional().describe("The ID of the archive to deploy"),
});

// prettier-ignore
const configFile = z.object({
  content: z.string().optional().describe('the content of the file'),
  path: z.string().optional().describe('the path where the file is copied'),
  permissions: z.string().optional().describe('the permissions of the file in format 0644'),
});

// prettier-ignore
const docker = z.object({
  args: z.string().array().optional(),
  command: z.string().optional(),
  entrypoint: z.string().array().optional(),
  image: z.string().optional(),
  image_registry_secret: z.string().optional(),
  privileged: z.boolean().optional().describe('A flag to run the container in privileged mode'),
});

// prettier-ignore
const env = z.object({
  key: z.string().optional(),
  scopes: z.string().optional(),
  secret: z.string().optional(),
  value: z.string().optional(),
});

// prettier-ignore
const git = z.object({
  branch: z.string().optional().describe('A git branch that will be tracked for new commits and deployments will be created'),
  build_command: z.string().optional().describe('A command used to override the build command, run after all build steps — deprecated, use buildpack.build_command instead'),
  buildpack: buildpackBuilder.optional(),
  docker: dockerBuilder.optional(),
  no_deploy_on_push: z.boolean().optional().describe('A flag to disable a new deployment when a push event is detected'),
  repository: z.string().optional().describe('description A url to a git repository (contains the provider as well) .e.g: github.com/koyeb/test.'),
  run_command: z.string().optional().describe('A command used to override the default run command - deprecated, use buildpack.run_command instead'),
  sha: z.string().optional().describe('A git commit that should be built (useful for pinning to a commit, this will always be set when a deployment is created by a code push)'),
  tag: z.string().optional().describe('A git tag that should be built'),
  workdir: z.string().optional().describe('A subdirectory to use as the build directory'),
});

// prettier-ignore
const httpHeader  = z.object({
  key: z.string().optional(),
  value: z.string().optional(),
});

// prettier-ignore
const httpHealthCheck = z.object({
  headers: httpHeader.array().optional().describe('An optional list of HTTP headers to provide when performing the request, default is empty'),
  method: z.string().optional().describe('An optional HTTP method to use to perform the health check, default is GET'),
  path: z.string().optional().describe('The path to use to perform the HTTP health check'),
  port: z.number().optional().describe('The port to use to perform the health check, must be declared in the ports section. Format: int64')
})

// prettier-ignore
const tcpHealthCheck = z.object({
  port: z.number().optional().describe('The port to use to perform the health check, must be declared in the ports section. Format: int64'),
});

// prettier-ignore
const healthCheck = z.object({
  grace_period: z.number().optional().describe('An optional initial period in seconds to wait for the instance to become healthy, default is 5s. Format: int64'),
  http: httpHealthCheck.optional(),
  interval: z.number().optional().describe('An optional period in seconds between two health checks, default is 60s. Format: int64'),
  restart_limit: z.number().optional().describe('An optional number of consecutive failures before attempting to restart the service, default is 3. Format: int64'),
  tcp: tcpHealthCheck.optional(),
  timeout: z.number().optional().describe('An optional maximum time to wait in seconds before considering the check as a failure, default is 5s. Format: int64'),
});

// prettier-ignore
const instances = [
  { type: 'eco-nano',     vCPU: '0.1',  RAM: '256MB', disk: '2GB SSD',    pricePerSecond: '$0.0000006', pricePerHour: '$0.0022', pricePerMonth: '$1.61' },
  { type: 'eco-micro',    vCPU: '0.25', RAM: '512MB', disk: '4GB SSD',    pricePerSecond: '$0.000001',  pricePerHour: '$0.0036', pricePerMonth: '$2.68' },
  { type: 'eco-small',    vCPU: '0.5',  RAM: '1GB',   disk: '8GB SSD',    pricePerSecond: '$0.000002',  pricePerHour: '$0.0072', pricePerMonth: '$5.36' },
  { type: 'eco-medium',   vCPU: '1',    RAM: '2GB',   disk: '16GB SSD',   pricePerSecond: '$0.000004',  pricePerHour: '$0.0144', pricePerMonth: '$10.71' },
  { type: 'eco-large',    vCPU: '2',    RAM: '4GB',   disk: '20GB SSD',   pricePerSecond: '$0.000008',  pricePerHour: '$0.0288', pricePerMonth: '$21.43' },
  { type: 'eco-xlarge',   vCPU: '4',    RAM: '8GB',   disk: '20GB SSD',   pricePerSecond: '$0.000016',  pricePerHour: '$0.0576', pricePerMonth: '$42.85' },
  { type: 'eco-2xlarge',  vCPU: '8',    RAM: '16GB',  disk: '20GB SSD',   pricePerSecond: '$0.000032',  pricePerHour: '$0.1152', pricePerMonth: '$85.71' },
  { type: 'nano',         vCPU: '0.25', RAM: '256MB', disk: '2.5GB SSD',  pricePerSecond: '$0.000001',  pricePerHour: '$0.0036', pricePerMonth: '$2.68' },
  { type: 'micro',        vCPU: '0.5',  RAM: '512MB', disk: '5GB SSD',    pricePerSecond: '$0.000002',  pricePerHour: '$0.0072', pricePerMonth: '$5.36' },
  { type: 'small',        vCPU: '1',    RAM: '1GB',   disk: '10GB SSD',   pricePerSecond: '$0.000004',  pricePerHour: '$0.0144', pricePerMonth: '$10.71' },
  { type: 'medium',       vCPU: '2',    RAM: '2GB',   disk: '20GB SSD',   pricePerSecond: '$0.000008',  pricePerHour: '$0.0288', pricePerMonth: '$21.43' },
  { type: 'large',        vCPU: '4',    RAM: '4GB',   disk: '40GB SSD',   pricePerSecond: '$0.000016',  pricePerHour: '$0.0576', pricePerMonth: '$42.85' },
  { type: 'xlarge',       vCPU: '8',    RAM: '8GB',   disk: '80GB SSD',   pricePerSecond: '$0.000032',  pricePerHour: '$0.1152', pricePerMonth: '$85.71' },
  { type: '2xlarge',      vCPU: '16',   RAM: '16GB',  disk: '160GB SSD',  pricePerSecond: '$0.000064',  pricePerHour: '$0.2304', pricePerMonth: '$172' },
  { type: '3xlarge',      vCPU: '24',   RAM: '32GB',  disk: '240GB SSD',  pricePerSecond: '$0.000128',  pricePerHour: '$0.4608', pricePerMonth: '$343' },
  { type: '4xlarge',      vCPU: '32',   RAM: '64GB',  disk: '320GB SSD',  pricePerSecond: '$0.000256',  pricePerHour: '$0.9216', pricePerMonth: '$686' },
  { type: '5xlarge',      vCPU: '40',   RAM: '128GB', disk: '400GB SSD',  pricePerSecond: '$0.000512',  pricePerHour: '$1.8432', pricePerMonth: '$1371' },
  { type: 'gpu-nvidia-rtx-4000-sff-ada', VRAM: '20 GB',  vCPU: '6',    RAM: '44 GB',   pricePerSecond: '$0.00014',   pricePerHour: '$0.5',   pricePerMonth: '$375' },
  { type: 'gpu-nvidia-l4',               VRAM: '24 GB',  vCPU: '15',   RAM: '44 GB',   pricePerSecond: '$0.000194',  pricePerHour: '$0.70',  pricePerMonth: '$521' },
  { type: 'gpu-nvidia-rtx-a6000',        VRAM: '48 GB',  vCPU: '6',    RAM: '44 GB',   pricePerSecond: '$0.000208',  pricePerHour: '$0.75',  pricePerMonth: '$543' },
  { type: 'gpu-nvidia-l40s',             VRAM: '48 GB',  vCPU: '30',   RAM: '92 GB',   pricePerSecond: '$0.000430',  pricePerHour: '$1.55',  pricePerMonth: '$1153' },
  { type: 'gpu-nvidia-a100',             VRAM: '80 GB',  vCPU: '15',   RAM: '180 GB',  pricePerSecond: '$0.000555',  pricePerHour: '$2',     pricePerMonth: '$1488' },
  { type: '2x-gpu-nvidia-a100',          VRAM: '160 GB', vCPU: '30',   RAM: '360 GB',  pricePerSecond: '$0.00111',   pricePerHour: '$4',     pricePerMonth: '$2976' },
  { type: '4x-gpu-nvidia-a100',          VRAM: '320 GB', vCPU: '60',   RAM: '720 GB',  pricePerSecond: '$0.00222',   pricePerHour: '$8',     pricePerMonth: '$5952' },
  { type: '8x-gpu-nvidia-a100',          VRAM: '640 GB', vCPU: '120',  RAM: '1.44 TB', pricePerSecond: '$0.00444',   pricePerHour: '$16',    pricePerMonth: '$11904' },
  { type: 'gpu-nvidia-h100',             VRAM: '80 GB',  vCPU: '15',   RAM: '180 GB',  pricePerSecond: '$0.000916',  pricePerHour: '$3.30',  pricePerMonth: '$2454' },
  { type: '2x-gpu-nvidia-h100',          VRAM: '160 GB', vCPU: '30',   RAM: '360 GB',  pricePerSecond: '$0.001832',  pricePerHour: '$6.60',  pricePerMonth: '$4910.4' },
  { type: '4x-gpu-nvidia-h100',          VRAM: '320 GB', vCPU: '60',   RAM: '720 GB',  pricePerSecond: '$0.003664',  pricePerHour: '$13.20', pricePerMonth: '$9821' },
  { type: '8x-gpu-nvidia-h100',          VRAM: '640 GB', vCPU: '120',  RAM: '1.44 TB', pricePerSecond: '$0.007328',  pricePerHour: '$26.40', pricePerMonth: '$19632' },
]

function getInstanceDescription(instance: (typeof instances)[number]): string {
  return Object.entries(instance)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

// prettier-ignore
const instanceType = z.object({
  scopes: z.string().optional(),
  type: z.union(instances.map(instance => z.literal(instance.type).describe(getInstanceDescription(instance))) as unknown as [z.ZodString, z.ZodString, ...z.ZodString[]]),
});

// prettier-ignore
const port = z.object({
  port: z.number().optional().describe('Format: int64'),
  protocol: z.string().optional().describe('One of http, http2, tcp'),
});

// prettier-ignore
const regions = z.union([
  z.literal('fra').describe('Use "fra" as the region identifier for Frankfurt, Germany'),
  z.literal('was').describe('Use "was" as the region identifier for Washington D.C., USA'),
  z.literal('sin').describe('Use "sin" as the region identifier for Singapore'),
  z.literal('tyo').describe('Use "tyo" as the region identifier for Tokyo, Japan'),
  z.literal('par').describe('Use "par" as the region identifier for Paris, France'),
  z.literal('sfo').describe('Use "sfo" as the region identifier for San Francisco, USA'),
]);

// prettier-ignore
const route = z.object({
  path: z.string().optional(),
  port: z.number().optional().describe('Format: int64'),
});

// prettier-ignore
const scalingTarget = z.object({
  value: z.number().describe('Format: int64'),
})

// prettier-ignore
const deploymentScalingTarget = z.object({
  average_cpu: scalingTarget.optional(),
  average_mem: scalingTarget.optional(),
  concurrent_requests: scalingTarget.optional(),
  requests_per_second: scalingTarget.optional(),
  requests_response_time: scalingTarget.optional(),
  sleep_idle_delay: scalingTarget.optional(),
})

// prettier-ignore
const scaling = z.object({
  max: z.number().describe('Format: int64'),
  min: z.number().describe('Format: int64'),
  scopes: z.string().optional(),
  targets: deploymentScalingTarget.array().optional(),
});

// prettier-ignore
const strategy = z.object({
  type: z.union([
    z.literal("DEPLOYMENT_STRATEGY_TYPE_INVALID").describe('Invalid / Zero value.'),
    z.literal("DEPLOYMENT_STRATEGY_TYPE_CANARY").describe('Use canary strategy.'),
    z.literal("DEPLOYMENT_STRATEGY_TYPE_ROLLING").describe('Use rolling strategy.'),
    z.literal("DEPLOYMENT_STRATEGY_TYPE_BLUE_GREEN").describe('Use blue green strategy.'),
    z.literal("DEPLOYMENT_STRATEGY_TYPE_IMMEDIATE").describe('Use immediate strategy.'),
  ]).optional()
});

// prettier-ignore
const volume = z.object({
  id: z.string().optional().describe('the id of the volume'),
  path: z.string().optional().describe('the path where the volume is mounted to'),
  replica_index: z.number().optional().describe('optionally, explicitly choose the replica index to mount the volume to. Format: int64'),
  scopes: z.string().array().optional().describe('scope of the associated'),
});

// prettier-ignore
export const deploymentDefinitionSchema = z.object({
  archive: archive.optional(),
  config_files: configFile.array().optional(),
  docker: docker.optional(),
  env: env.array().optional(),
  git: git.optional(),
  health_checks: healthCheck.array().optional(),
  instance_types: instanceType.array(),
  name: z.string(),
  ports: port.array().optional(),
  regions: z.array(regions).min(1),
  routes: route.array().optional(),
  scalings: scaling.array(),
  skip_cache: z.boolean().optional(),
  strategy: strategy.optional(),
  type: z.union([z.literal("INVALID"), z.literal("WEB"), z.literal("WORKER"), z.literal("DATABASE")]),
  volumes: volume.array().optional(),
});
