// user signs up and it sends a message or notif
// a welcome message is sent via another lambda

import { Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class OnboardingStack extends Stack {
  public readonly onboardingTopic: Topic;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a topic
    const onboardingTopic = new Topic(this, 'OnboardingTopic');

    onboardingTopic.addSubscription(
      new EmailSubscription('uzochukwubenamara@gmail.com')
    );

    new StringParameter(this, 'MyValue', {
      parameterName: `/sns-OnboardingTopic`,
      stringValue: onboardingTopic.topicArn,
    });

    this.onboardingTopic = onboardingTopic;

    // bind a lambda to it

    // ensure another lambda subscribes to it using filter policy
  }
}
