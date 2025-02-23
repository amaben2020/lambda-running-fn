#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LamdbdaRunsStack } from '../lib/lamdbda-runs-stack';

const app = new cdk.App();
new LamdbdaRunsStack(app, 'LamdbdaRunsStack', {});
