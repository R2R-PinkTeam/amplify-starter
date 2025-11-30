import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class McpServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function (ARM64 for better price/performance)
    const mcpFunction = new lambda.Function(this, 'McpFunction', {
      functionName: 'gum-wall-calculator',
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: 'bootstrap',
      code: lambda.Code.fromAsset('.build'),
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        RUST_LOG: 'info',
      },
      tracing: lambda.Tracing.ACTIVE,
    });

    // Log group
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/lambda/${mcpFunction.functionName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // HTTP API (will add auth in next phase)
    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      apiName: 'gum-wall-calculator',
      description: 'MCP Server HTTP API',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['*'],
      },
    });

    // Lambda integration
    const integration = new apigatewayv2.CfnIntegration(this, 'Integration', {
      apiId: httpApi.apiId,
      integrationType: 'AWS_PROXY',
      integrationUri: mcpFunction.functionArn,
      payloadFormatVersion: '2.0',
    });

    // Route
    new apigatewayv2.CfnRoute(this, 'Route', {
      apiId: httpApi.apiId,
      routeKey: 'POST /{proxy+}',
      target: `integrations/${integration.ref}`,
    });

    // Permission for API Gateway to invoke Lambda
    mcpFunction.addPermission('ApiGatewayInvoke', {
      principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${httpApi.apiId}/*/*`,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.apiEndpoint || '',
      description: 'MCP Server API URL',
    });

    new cdk.CfnOutput(this, 'OAuthDiscoveryUrl', {
      value: 'https://oauth-coming-soon',
      description: 'OAuth Discovery URL (coming in next phase)',
    });

    new cdk.CfnOutput(this, 'ClientId', {
      value: 'client-id-coming-soon',
      description: 'OAuth Client ID (coming in next phase)',
    });

    new cdk.CfnOutput(this, 'DashboardUrl', {
      value: `https://console.aws.amazon.com/cloudwatch/home?region=${this.region}`,
      description: 'CloudWatch Console',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: 'user-pool-coming-soon',
      description: 'Cognito User Pool ID (coming in next phase)',
    });
  }
}
