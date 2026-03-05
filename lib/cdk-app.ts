#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContentReviewerStack } from './content-reviewer-stack';

const app = new cdk.App();

new ContentReviewerStack(app, 'ContentReviewerStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'AI-powered Content Quality Reviewer Backend Infrastructure',
});

app.synth();
