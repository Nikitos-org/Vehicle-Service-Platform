import { defineConfig } from 'prisma/config';

import { loadServiceEnv } from './src/config/load-env.js';

loadServiceEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
