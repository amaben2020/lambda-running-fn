import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { APIGatewayEvent } from 'aws-lambda';

const sns = new SNSClient({ region: process.env.AWS_REGION });

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';

export async function handler(event: APIGatewayEvent) {
  const requestBody = event.body ? JSON.parse(event.body) : {};
  const { email } = requestBody;

  if (!email) {
    return { statusCode: 400, body: `Email is undefined` };
  }

  // Send an SNS notification
  await sns.send(
    new PublishCommand({
      Message: `Welcome user ${String(email)}`,
      TopicArn: SNS_TOPIC_ARN,
    })
  );

  return { statusCode: 200, body: `Welcome ${String(email)}` };
}
