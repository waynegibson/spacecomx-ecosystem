import { Stack } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { CDNProviderAccessPolicy } from '../lib/constructs'

describe('CDN provider access policy construct for the media bucket -', () => {
  test('it should create a default cdn provider access policy.', () => {
    const stack = new Stack()

    const bucket = new s3.Bucket(stack, 'test-bucket', {})

    new CDNProviderAccessPolicy(stack, 'test-cdn-provider-access-policy', {
      sourceBucket: bucket,
    })

    const t = Template.fromStack(stack)

    expect(t).toMatchSnapshot()

    t.resourceCountIs('AWS::IAM::Group', 1)
    t.resourceCountIs('AWS::IAM::User', 1)
    t.resourceCountIs('AWS::IAM::Policy', 1)

    t.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject',
              's3:ListBucket',
              's3:GetBucketLocation',
            ],
            Effect: 'Allow',
          },
        ],
      },
    })
  })

  test('it should create a cdn provider access policy without a default IAM user.', () => {
    const stack = new Stack()

    const bucket = new s3.Bucket(stack, 'test-bucket', {})

    new CDNProviderAccessPolicy(stack, 'test-cdn-provider-access-policy', {
      sourceBucket: bucket,
      createIamUser: false,
    })

    const t = Template.fromStack(stack)

    expect(t).toMatchSnapshot()

    t.resourceCountIs('AWS::IAM::Group', 1)
    t.resourceCountIs('AWS::IAM::Policy', 1)
    t.resourceCountIs('AWS::IAM::User', 0)
  })
})
