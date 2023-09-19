import { Construct } from 'constructs'
import type * as s3 from 'aws-cdk-lib/aws-s3'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { consolidateProps } from '@spacecomx/cdk-utils'
import { DefaultS3Props } from './s3-bucket-defaults'

export interface S3BucketProps {
  /**
   * User provided props to override the default props for the S3 Bucket.
   *
   * @default - Default props are used
   */
  readonly bucketProps?: s3.BucketProps
}

export class S3Bucket extends Construct {
  public readonly s3Bucket: s3.Bucket

  constructor(scope: Construct, id: string, props: S3BucketProps = {}) {
    super(scope, id)

    const combinedBucketProps = consolidateProps(DefaultS3Props(), props.bucketProps)
    const s3BucketResponse = new Bucket(scope, 'S3Bucket', combinedBucketProps)

    this.s3Bucket = s3BucketResponse
  }
}
