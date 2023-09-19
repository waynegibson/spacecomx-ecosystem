/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import { S3Bucket, type S3BucketProps } from '@spacecomx/cdk-s3-bucket'

export type EnvironmentType = 'dev' | 'test' | 'prod'

export interface CostUsageReportBucketStackProps extends cdk.StackProps {
  /**
   * Should we deploy to development, staging, or production?
   *
   * @default - development
   */
  readonly environment?: EnvironmentType
}

export class CostUsageReportBucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CostUsageReportBucketStackProps) {
    super(scope, id, props)

    let customBucketProps: S3BucketProps
    const accountId = cdk.Stack.of(this).account

    if (props?.environment === 'dev' || props?.environment === 'test') {
      customBucketProps = {
        bucketProps: {
          versioned: false,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
        },
      }
    }
    else {
      customBucketProps = {
        bucketProps: {
          versioned: false,
        },
      }
    }

    const { s3Bucket } = new S3Bucket(this, 'CostUsageReportBucket', customBucketProps)
    const targetBucketName = s3Bucket.bucketName
    const targetBucketArn = s3Bucket.bucketArn

    new cdk.CfnOutput(this, 'CostUsageReportBucketName', {
      value: targetBucketName,
    })

    new cdk.CfnOutput(this, 'CostUsageReportBucketArn', {
      value: targetBucketArn,
    })

    /**
     * Setting up an Amazon S3 bucket for Cost and Usage Reports policy statements
     *
     * https://docs.aws.amazon.com/cur/latest/userguide/cur-s3.html
     */
    const policyStatement1 = s3Bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('billingreports.amazonaws.com'),
        ],
        actions: [
          's3:GetBucketAcl',
          's3:GetBucketPolicy',
        ],
        resources: [
          `arn:aws:s3:::${targetBucketName}`,
        ],
        conditions: {
          StringEquals: {
            'aws:SourceArn': `arn:aws:cur:us-east-1:${accountId}:definition/*`,
            'aws:SourceAccount': `${accountId}`,
          },
        },
      }),
    )

    const policyStatement2 = s3Bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('billingreports.amazonaws.com'),
        ],
        actions: [
          's3:PutObject',
        ],
        resources: [
            `arn:aws:s3:::${targetBucketName}/*`,
        ],
        conditions: {
          StringEquals: {
            'aws:SourceArn': `arn:aws:cur:us-east-1:${accountId}:definition/*`,
            'aws:SourceAccount': `${accountId}`,
          },
        },
      }),
    )

    if (!policyStatement1.statementAdded || !policyStatement2.statementAdded)
      throw new Error('Resource policy statement(s) not added')
  }
}
