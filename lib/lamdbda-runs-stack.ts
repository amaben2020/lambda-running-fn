import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Alarm } from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
export class LamdbdaRunsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const notificationTopic = new sns.Topic(this, 'FunctionMonitorTopic');

    notificationTopic.addSubscription(
      new sns_subs.EmailSubscription('uzochukwubenamara@gmail.com')
    );

    const monitoredFunction = new NodejsFunction(this, 'MonitoredFunction', {
      handler: 'handler',
      runtime: Runtime.NODEJS_LATEST,
      entry: join(__dirname, '..', 'services', 'handler.ts'),
      timeout: cdk.Duration.seconds(5),
      environment: {
        SNS_TOPIC_ARN: notificationTopic.topicArn,
      },
    });

    monitoredFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        resources: [notificationTopic.topicArn],
      })
    );

    const alarm = new Alarm(this, 'ExecutionAlarm', {
      metric: monitoredFunction.metricDuration(),
      threshold: 10,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    alarm.addAlarmAction(new SnsAction(notificationTopic));
  }
}
