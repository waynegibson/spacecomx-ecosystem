#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { MediaStoreBucketStack } from '../lib/index'
import { config } from '../env.config'

const app = new cdk.App()

const stack = new MediaStoreBucketStack(app, `${config.environment}-media-store-bucket`, config)
stack.templateOptions.description = 'This stack includes resources needed to deploy an S3 bucket to manage CDN media assets.'
