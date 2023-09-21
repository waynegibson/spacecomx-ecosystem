import { RemovalPolicy } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'

/**
 * @internal
 */
export function DefaultS3Props (loggingBucket?: s3.Bucket, lifecycleRules?: s3.LifecycleRule[]): s3.BucketProps {
  return {
    versioned: true,
    enforceSSL: true,
    encryption: s3.BucketEncryption.S3_MANAGED,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    autoDeleteObjects: false,
    removalPolicy: RemovalPolicy.RETAIN,
    lifecycleRules: lifecycleRules ?? [],
    serverAccessLogsBucket: loggingBucket
  }
}
