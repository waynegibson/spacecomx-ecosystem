/* eslint-disable no-new */
import { Stack } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { S3Bucket } from '../lib'

describe('Default S3 Bucket construct -', () => {
  test('it should create a default s3 bucket.', () => {
    const stack = new Stack()
    
    new S3Bucket(stack, 'test-s3-bucket', {})

    const t = Template.fromStack(stack)

    expect(t).toMatchSnapshot()

    t.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    })

    t.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    })
  })
})
