import { z } from "zod";

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
  args: z.string().optional(),
  command: z.string().optional(),
  entrypoint: z.string().optional(),
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
const instanceType = z.object({
  scopes: z.string().optional(),
  type: z.string().optional(),
});

// prettier-ignore
const port = z.object({
  port: z.number().optional().describe('Format: int64'),
  protocol: z.string().optional().describe('One of http, http2, tcp'),
});

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
    z.literal("DEPLOYMENT_STRATEGY_TYPE_INVALID",).describe('Invalid / Zero value.'),
    z.literal( "DEPLOYMENT_STRATEGY_TYPE_CANARY",).describe('Use canary strategy.'),
    z.literal( "DEPLOYMENT_STRATEGY_TYPE_ROLLING",).describe('Use rolling strategy.'),
    z.literal( "DEPLOYMENT_STRATEGY_TYPE_BLUE_GREEN",).describe('Use blue green strategy.'),
    z.literal( "DEPLOYMENT_STRATEGY_TYPE_IMMEDIATE").describe('Use immediate strategy.'),
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
  instance_types: instanceType.array().optional(),
  name: z.string().optional(),
  ports: port.array().optional(),
  regions: z.string().optional(),
  routes: route.array().optional(),
  scalings: scaling.array().optional(),
  skip_cache: z.boolean().optional(),
  strategy: strategy.optional(),
  type: z.union([z.literal("INVALID"), z.literal("WEB"), z.literal("WORKER"), z.literal("DATABASE")]).optional(),
  volumes: volume.array().optional(),
});
