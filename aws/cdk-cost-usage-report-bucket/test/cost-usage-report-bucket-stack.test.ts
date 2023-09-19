import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { CostUsageReportBucketStack } from '../lib'

describe('S3 cost usage report stack -', () => {
  test('it should create an s3 cost usage report s3 bucket for development.', () => {
    const app = new cdk.App()

    const stack = new CostUsageReportBucketStack(app, 'test-s3-cost-usage-report-stack', {
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

    t.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [
          {
            "Action": "s3:*",
            "Condition": {
              "Bool": {
                "aws:SecureTransport": "false",
              },
            },
            "Effect": "Deny",
            "Principal": {
              "AWS": "*",
            },
            "Resource": [
              {
                "Fn::GetAtt": [
                  "S3Bucket07682993",
                  "Arn",
                ],
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "S3Bucket07682993",
                        "Arn",
                      ],
                    },
                    "/*",
                  ],
                ],
              },
            ],
          },
          {
            "Action": [
              "s3:GetBucket*",
              "s3:List*",
              "s3:DeleteObject*",
            ],
            "Effect": "Allow",
            "Principal": {
              "AWS": {
                "Fn::GetAtt": [
                  "CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092",
                  "Arn",
                ],
              },
            },
            "Resource": [
              {
                "Fn::GetAtt": [
                  "S3Bucket07682993",
                  "Arn",
                ],
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "S3Bucket07682993",
                        "Arn",
                      ],
                    },
                    "/*",
                  ],
                ],
              },
            ],
          },
          {
            "Action": [
              "s3:GetBucketAcl",
              "s3:GetBucketPolicy",
            ],
            "Condition": {
              "StringEquals": {
                "aws:SourceAccount": {
                  "Ref": "AWS::AccountId",
                },
                "aws:SourceArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:aws:cur:us-east-1:",
                      {
                        "Ref": "AWS::AccountId",
                      },
                      ":definition/*",
                    ],
                  ],
                },
              },
            },
            "Effect": "Allow",
            "Principal": {
              "Service": "billingreports.amazonaws.com",
            },
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket07682993",
                  },
                ],
              ],
            },
          },
          {
            "Action": "s3:PutObject",
            "Condition": {
              "StringEquals": {
                "aws:SourceAccount": {
                  "Ref": "AWS::AccountId",
                },
                "aws:SourceArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:aws:cur:us-east-1:",
                      {
                        "Ref": "AWS::AccountId",
                      },
                      ":definition/*",
                    ],
                  ],
                },
              },
            },
            "Effect": "Allow",
            "Principal": {
              "Service": "billingreports.amazonaws.com",
            },
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket07682993",
                  },
                  "/*",
                ],
              ],
            },
          },
        ],
      },
    })
  })

  test('it should create a cost usage report s3 bucket for production.', () => {
    const app = new cdk.App()

    const stack = new CostUsageReportBucketStack(app, 'test-s3-cost-usage-report-stack', {
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

    t.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [
          {
            "Action": "s3:*",
            "Condition": {
              "Bool": {
                "aws:SecureTransport": "false",
              },
            },
            "Effect": "Deny",
            "Principal": {
              "AWS": "*",
            },
            "Resource": [
              {
                "Fn::GetAtt": [
                  "S3Bucket07682993",
                  "Arn",
                ],
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "S3Bucket07682993",
                        "Arn",
                      ],
                    },
                    "/*",
                  ],
                ],
              },
            ],
          },
          {
            "Action": [
              "s3:GetBucketAcl",
              "s3:GetBucketPolicy",
            ],
            "Condition": {
              "StringEquals": {
                "aws:SourceAccount": {
                  "Ref": "AWS::AccountId",
                },
                "aws:SourceArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:aws:cur:us-east-1:",
                      {
                        "Ref": "AWS::AccountId",
                      },
                      ":definition/*",
                    ],
                  ],
                },
              },
            },
            "Effect": "Allow",
            "Principal": {
              "Service": "billingreports.amazonaws.com",
            },
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket07682993",
                  },
                ],
              ],
            },
          },
          {
            "Action": "s3:PutObject",
            "Condition": {
              "StringEquals": {
                "aws:SourceAccount": {
                  "Ref": "AWS::AccountId",
                },
                "aws:SourceArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:aws:cur:us-east-1:",
                      {
                        "Ref": "AWS::AccountId",
                      },
                      ":definition/*",
                    ],
                  ],
                },
              },
            },
            "Effect": "Allow",
            "Principal": {
              "Service": "billingreports.amazonaws.com",
            },
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:aws:s3:::",
                  {
                    "Ref": "S3Bucket07682993",
                  },
                  "/*",
                ],
              ],
            },
          },
        ],
      },
    })
  })
})
