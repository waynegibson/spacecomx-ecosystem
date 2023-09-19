import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { MediaStoreBucketStack } from '../lib'

describe('Media store stack -', () => {
  test('it should create a media storage bucket for development.', () => {
    const app = new cdk.App()

    const stack = new MediaStoreBucketStack(app, 'test-media-store-bucket-stack', {
      environment: 'dev',
    })

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
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    })

    t.hasResourceProperties('AWS::Lambda::Function', {
      Description: {
        'Fn::Join': [
          '',
          [
            'Lambda function for auto-deleting objects in ',
            {
              Ref: 'S3Bucket07682993',
            },
            ' S3 bucket.',
          ],
        ],
      },
    })
  })

  test('it should create a media storage bucket for production.', () => {
    const app = new cdk.App()

    const stack = new MediaStoreBucketStack(app, 'test-media-store-bucket-stack', {
      environment: 'prod',
    })

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
