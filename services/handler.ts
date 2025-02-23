import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({ region: process.env.AWS_REGION });
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';

export async function handler(event: any) {
  const startTime = Date.now();

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 50));

  const executionTime = Date.now() - startTime;

  if (executionTime > 10) {
    console.log(`Execution time exceeded 10ms: ${executionTime}ms`);

    // Send an SNS notification
    await sns.send(
      new PublishCommand({
        Message: `Lambda function execution exceeded 10ms: ${executionTime}ms`,
        TopicArn: SNS_TOPIC_ARN,
      })
    );
  }

  return { statusCode: 200, body: `Execution time: ${executionTime}ms` };
}
