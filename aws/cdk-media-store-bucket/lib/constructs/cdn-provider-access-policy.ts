/* eslint-disable no-new */
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Bucket } from 'aws-cdk-lib/aws-s3'

export interface CDNProviderAccessPolicyProps {
  /**
   * The source bucket to use for the CDN provider.
   */
  readonly sourceBucket: Bucket
  /**
   * Create a IAM user and add it to the CDN provider group that has a bucket access policy attached.
   *
   * If this is set to true, a new IAM user will be created and added to the IAM group.
   * If this is set to false, the user will not be created.
   *
   * @default - true
   */
  readonly createIamUser?: boolean
}

/**
 * Creates an IAM group, IAM user and adds a bucket access policy to it.
 */
export class CDNProviderAccessPolicy extends Construct {
  public readonly group: iam.Group
  public readonly user: iam.User | undefined

  constructor (scope: Construct, id: string, props: CDNProviderAccessPolicyProps) {
    super(scope, id)

    const bucket = props.sourceBucket

    this.group = new iam.Group(this, 'Group', {})

    // Create a policy that allows the group to access the bucket
    new iam.Policy(this, 'AccessPolicy', {
      groups: [this.group],
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:ListBucket',
            's3:GetBucketLocation'
          ],
          resources: [
            `${bucket.bucketArn}`,
            `${bucket.bucketArn}/*`
          ]
        })
      ]
    })

    // Create a new user if the user is not created
    if (props?.createIamUser === undefined || props.createIamUser) {
      this.user = new iam.User(this, 'User', {
        groups: [this.group]
      })
    }
  }
}
