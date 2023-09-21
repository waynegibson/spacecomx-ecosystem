/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { S3Bucket, type S3BucketProps } from '@spacecomx/cdk-s3-bucket'
import { CDNProviderAccessPolicy } from '../constructs'

export type EnvironmentType = 'dev' | 'test' | 'prod'

export interface MediaStoreBucketStackProps extends cdk.StackProps {
  /**
   * Should we deploy to development, staging, or production?
   *
   * @default - development
   */
  readonly environment?: EnvironmentType
  /**
   * Should we create an IAM user and group for the CDN provider?
   *
   * @default - true
   */
  readonly createIamUser?: boolean
}

/**
 * A CDK stack that deploys a media store bucket and IAM user/group for the CDN media provider.
 *
 * @example
 * ```typescript
 * import { MediaStoreBucketStack }
 * ```
 */
export class MediaStoreBucketStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: MediaStoreBucketStackProps) {
    super(scope, id, props)

    let customBucketProps: S3BucketProps

    if (props?.environment === 'dev' || props?.environment === 'test') {
      customBucketProps = {
        bucketProps: {
          versioned: false,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          autoDeleteObjects: true
        }
      }
    } else {
      customBucketProps = {
        bucketProps: {
          versioned: false
        }
      }
    }

    const { s3Bucket } = new S3Bucket(this, 'MediaStoreBucket', customBucketProps)
    const targetBucketName = s3Bucket.bucketName
    const targetBucketArn = s3Bucket.bucketArn

    new cdk.CfnOutput(this, 'MediaStoreBucketName', {
      value: targetBucketName
    })

    new cdk.CfnOutput(this, 'MediaStoreBucketArn', {
      value: targetBucketArn
    })

    const { group, user } = new CDNProviderAccessPolicy(this, 'CDNProviderAccessPolicy', {
      sourceBucket: s3Bucket,
      createIamUser: props?.createIamUser ?? true
    })

    new cdk.CfnOutput(this, 'CDNProviderGroupName', {
      value: group.groupName
    })

    new cdk.CfnOutput(this, 'CDNProviderGroupArn', {
      value: group.groupArn
    })

    if (user !== undefined) {
      new cdk.CfnOutput(this, 'CDNProviderUserName', {
        value: user.userName
      })
      new cdk.CfnOutput(this, 'CDNProviderUserArn', {
        value: user.userArn
      })
    }
  }
}
