import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadEnv } from 'dotenv';

export function resolveEnvFileName(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === 'production' ? '.env.prod' : '.env.dev';
}

export function loadServiceEnv(
  cwd = process.cwd(),
  nodeEnv = process.env.NODE_ENV,
) {
  const envFilePath = resolve(cwd, resolveEnvFileName(nodeEnv));

  if (existsSync(envFilePath)) {
    loadEnv({ path: envFilePath });
  }
}
