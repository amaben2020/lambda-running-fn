import { Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
  snsTopic: Topic;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const topicArn = props.snsTopic.topicArn;

    // bind a lambda to it
    const onboardingLambda = new NodejsFunction(
      this,
      'OnboardingLambdaTrigger',
      {
        handler: 'handler',
        entry: join(__dirname, '..', 'services', 'onboarding-handler.ts'),
        runtime: Runtime.NODEJS_LATEST,
        environment: {
          SNS_TOPIC_ARN: topicArn,
        },
      }
    );

    const sendMessageLambda = new NodejsFunction(this, 'SendMessageLambda', {
      handler: 'handler',
      entry: join(__dirname, '..', 'services', 'sendMessage-handler.ts'),
      runtime: Runtime.NODEJS_LATEST,
    });

    console.log('topicArn ===>', topicArn);

    onboardingLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        resources: [topicArn],
      })
    );

    // ensure another lambda subscribes to it using filter policy
    props.snsTopic.addSubscription(new LambdaSubscription(sendMessageLambda));
  }
}
