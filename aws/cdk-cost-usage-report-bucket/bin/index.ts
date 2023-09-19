#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CostUsageReportBucketStack } from '../lib/index'
import { config } from '../env.config'

const app = new cdk.App()

const stack = new CostUsageReportBucketStack(app, `${config.environment}-s3-cost-usage-report-bucket`, config)
stack.templateOptions.description = 'This stack includes resources needed to deploy an S3 bucket to manage account billing cost and usage reports.'
