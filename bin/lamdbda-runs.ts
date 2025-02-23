#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LamdbdaRunsStack } from '../lib/lamdbda-runs-stack';
import { LambdaStack } from '../lib/LambdaStack';
import { OnboardingStack } from '../lib/OnboardingStack';

const app = new cdk.App();
new LamdbdaRunsStack(app, 'LamdbdaRunsStack', {});

const onboardingStack = new OnboardingStack(app, 'OnboardingStack');

new LambdaStack(app, 'LambdaStackSns', {
  snsTopic: onboardingStack.onboardingTopic,
});
