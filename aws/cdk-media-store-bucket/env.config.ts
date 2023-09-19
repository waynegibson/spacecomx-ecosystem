import { env } from 'node:process'
import * as dotenv from 'dotenv'
import type { EnvironmentType } from './lib'

dotenv.config()

export const config = {
  env: {
    account: env.AWS_ACCOUNT_ID,
    region: env.AWS_ACCOUNT_REGION ?? 'us-east-1',
  },
  environment: env.AWS_DEPLOY_ENVIRONMENT as EnvironmentType ?? 'dev',
}
