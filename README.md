# Content Quality Reviewer Backend

AI-powered Content Quality Reviewer built with Node.js, AWS Lambda, Amazon Bedrock, and DynamoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or later
- AWS CLI configured
- AWS CDK CLI (`npm install -g aws-cdk`)
- AWS Account with Bedrock access

### Installation

```bash
# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy to AWS
npm run deploy
```

### Testing

```bash
# Run unit tests (no AWS required)
npm test

# Run tests with coverage
npm test -- --coverage
```

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 📋 What's Been Built

✅ **Infrastructure** - CDK stack with API Gateway, Lambda, DynamoDB  
✅ **Authentication** - API key auth with rate limiting (10 req/min)  
✅ **Storage** - DynamoDB service for analysis results and history  
✅ **Bedrock Integration** - Claude 3 Sonnet with retry logic  
✅ **Comprehend Integration** - Sentiment, key phrases, syntax analysis  

🚧 **In Progress** - Content analyzers, orchestrator, API endpoints  
⏳ **Pending** - Frontend integration, deployment scripts

## 🏗️ Project Structure

```
.
├── lambda/           # Lambda function handlers
│   ├── auth/        # Authentication handler
│   ├── storage/     # DynamoDB storage service
│   ├── bedrock/     # Bedrock AI integration
│   └── comprehend/  # AWS Comprehend service
├── lib/              # CDK infrastructure code
│   ├── cdk-app.ts
│   └── content-reviewer-stack.ts
├── test/             # Unit and property-based tests
├── package.json      # Node.js dependencies
├── tsconfig.json     # TypeScript configuration
├── cdk.json          # CDK configuration
└── jest.config.js    # Jest test configuration
```

## Prerequisites

- Node.js 20.x or later
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Installation

```bash
npm install
```

## Development

Build TypeScript:
```bash
npm run build
```

Watch mode:
```bash
npm run watch
```

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🧪 Testing

### Unit Tests (No AWS Required)
```bash
npm test
```

Tests the following with mocked AWS services:
- Storage service (DynamoDB operations)
- Prompt template construction
- Input validation
- Error handling

### Integration Tests (Requires AWS)
```bash
# Deploy to AWS first
npm run deploy

# Test with real AWS services
# See TESTING_GUIDE.md for detailed instructions
```

## 📦 Deployment

### Development Environment

```bash
# Synthesize CloudFormation template
npm run synth

# Deploy to AWS
npm run deploy
```

### Configure API Keys

After deployment, add API keys to Secrets Manager:

```bash
aws secretsmanager put-secret-value \
  --secret-id content-reviewer/api-keys \
  --secret-string '{"keys":["your-api-key-here"]}'
```

### Test the API

```bash
# Get API endpoint from CDK outputs
API_ENDPOINT="https://xxxxx.execute-api.us-east-1.amazonaws.com/prod"

# Test analysis endpoint
curl -X POST $API_ENDPOINT/analyze \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your content here",
    "targetPlatform": "blog",
    "contentIntent": "inform"
  }'
```

## Environment Variables

The following environment variables are configured for Lambda functions:

- `BEDROCK_MODEL_ID`: Claude 3 Sonnet model identifier
- `DYNAMODB_TABLE_NAME`: DynamoDB table for analysis results
- `COMPREHEND_REGION`: AWS region for Comprehend service
- `API_KEY_SECRET_NAME`: Secrets Manager secret name for API keys
- `MAX_CONTENT_LENGTH`: Maximum content length in words (2000)
- `ANALYSIS_TIMEOUT_MS`: Analysis timeout in milliseconds (25000)

## Architecture

The system uses a serverless architecture with:

- **API Gateway**: RESTful API endpoints with API key authentication
- **Lambda Functions**: Serverless compute for analysis logic
- **Amazon Bedrock**: AI-powered content analysis using Claude 3 Sonnet
- **AWS Comprehend**: NLP services for sentiment and syntax analysis
- **DynamoDB**: Persistent storage for analysis results (90-day TTL)
- **Secrets Manager**: Secure API key storage

### Key Features

- ✅ API key authentication with rate limiting (10 req/min)
- ✅ Automatic retry logic with exponential backoff
- ✅ Fallback to Comprehend when Bedrock unavailable
- ✅ 25-second timeout protection
- ✅ Comprehensive error handling
- ✅ CloudWatch logging and monitoring
- ✅ 90-day data retention with automatic cleanup

## 📊 Monitoring

### View Logs

```bash
# List Lambda functions
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `ContentReviewer`)].FunctionName'

# Tail logs
aws logs tail /aws/lambda/ContentReviewerStack-AuthFunction --follow
```

### Check DynamoDB

```bash
# View analysis results
aws dynamodb scan --table-name ContentAnalysisResults --max-items 5

# View rate limits
aws dynamodb scan --table-name ContentReviewerRateLimits --max-items 5
```

## 🐛 Troubleshooting

### Bedrock Access Denied
1. Go to AWS Console → Bedrock → Model access
2. Request access to Claude 3 Sonnet
3. Wait for approval (usually instant)

### Lambda Timeout
- Bedrock calls can take 10-20 seconds
- Current timeout: 30 seconds
- Adjust in `lib/content-reviewer-stack.ts` if needed

### Rate Limiting
- Current limit: 10 requests per minute per API key
- Wait 60 seconds between bursts
- Adjust in CDK stack if needed

For more troubleshooting, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 💰 Cost Estimates

Estimated AWS costs for 1000 analyses:

- Lambda: ~$0.20
- API Gateway: ~$3.50
- DynamoDB: ~$1.25
- Bedrock (Claude 3 Sonnet): ~$3-5
- Comprehend: ~$0.10

**Total: ~$8-10 per 1000 analyses**

## 🧹 Clean Up

To avoid ongoing costs:

```bash
# Destroy all resources
cdk destroy

# Delete retained DynamoDB tables (if needed)
aws dynamodb delete-table --table-name ContentAnalysisResults
```

## Testing

The project uses:

- **Jest**: Unit testing framework
- **fast-check**: Property-based testing library
- **ts-jest**: TypeScript support for Jest

Test coverage target: 90% for all metrics (branches, functions, lines, statements)

## License

MIT
