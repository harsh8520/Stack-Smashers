import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));

const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE || 'ContentReviewerRateLimits';
const API_KEY_SECRET_NAME = process.env.API_KEY_SECRET_NAME || 'content-reviewer/api-keys';
const RATE_LIMIT_PER_MINUTE = 10;

interface ApiKeyData {
  keys: string[];
}

interface RateLimitRecord {
  apiKey: string;
  timestamp: number;
  requestCount: number;
  ttl: number;
}

/**
 * Validates API key against stored keys in Secrets Manager
 */
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: API_KEY_SECRET_NAME,
    });
    
    const response = await secretsClient.send(command);
    
    if (!response.SecretString) {
      console.error('No secret string found');
      return false;
    }
    
    const secretData: ApiKeyData = JSON.parse(response.SecretString);
    return secretData.keys.includes(apiKey);
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

/**
 * Checks and updates rate limit for the API key
 */
async function checkRateLimit(apiKey: string): Promise<boolean> {
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000) * 60000; // Round down to minute
  const ttl = Math.floor((currentMinute + 120000) / 1000); // TTL 2 minutes from current minute
  
  try {
    // Query current minute's requests
    const queryCommand = new QueryCommand({
      TableName: RATE_LIMIT_TABLE,
      KeyConditionExpression: 'apiKey = :apiKey AND #ts = :timestamp',
      ExpressionAttributeNames: {
        '#ts': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':apiKey': apiKey,
        ':timestamp': currentMinute,
      },
    });
    
    const queryResult = await dynamoClient.send(queryCommand);
    
    if (queryResult.Items && queryResult.Items.length > 0) {
      const record = queryResult.Items[0] as RateLimitRecord;
      
      if (record.requestCount >= RATE_LIMIT_PER_MINUTE) {
        console.log(`Rate limit exceeded for API key: ${apiKey.substring(0, 8)}...`);
        return false;
      }
      
      // Increment request count
      const putCommand = new PutCommand({
        TableName: RATE_LIMIT_TABLE,
        Item: {
          apiKey,
          timestamp: currentMinute,
          requestCount: record.requestCount + 1,
          ttl,
        },
      });
      
      await dynamoClient.send(putCommand);
    } else {
      // First request in this minute
      const putCommand = new PutCommand({
        TableName: RATE_LIMIT_TABLE,
        Item: {
          apiKey,
          timestamp: currentMinute,
          requestCount: 1,
          ttl,
        },
      });
      
      await dynamoClient.send(putCommand);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // Allow request on error to avoid blocking legitimate traffic
    return true;
  }
}

/**
 * Generates IAM policy for API Gateway
 */
function generatePolicy(principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

/**
 * Lambda authorizer handler for API Gateway
 */
export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('Authentication request received');
  
  const apiKey = event.authorizationToken;
  
  if (!apiKey) {
    console.log('No API key provided');
    throw new Error('Unauthorized');
  }
  
  // Validate API key
  const isValidKey = await validateApiKey(apiKey);
  
  if (!isValidKey) {
    console.log('Invalid API key');
    throw new Error('Unauthorized');
  }
  
  // Check rate limit
  const withinRateLimit = await checkRateLimit(apiKey);
  
  if (!withinRateLimit) {
    console.log('Rate limit exceeded');
    throw new Error('Too Many Requests');
  }
  
  console.log('Authentication successful');
  
  // Return allow policy
  return generatePolicy(apiKey, 'Allow', event.methodArn);
};
