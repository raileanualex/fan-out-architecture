import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    helloWorldLambda: lambda.Function;
};

export class RestAPIStack extends cdk.Stack {
    api: apigateway.LambdaRestApi;

    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${id}-rest-api-stack`, props);

        // Create API Gateway
        this.api = new apigateway.LambdaRestApi(this, 'APIGateway', {
            handler: props.helloWorldLambda,
            proxy: false,
            restApiName: 'HelloWorldService',
            description: 'This service serves a hello world API.',
            apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
        });

        // Define API Gateway resources and methods
        const textToSpeechResource = this.api.root.addResource('hello-world');
        textToSpeechResource.addMethod('POST', new apigateway.LambdaIntegration(props.helloWorldLambda), {
            apiKeyRequired: true
        });
        
        const corsOptions: apigateway.CorsOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
        };

        this.api.root.addCorsPreflight(corsOptions);

        const apiKey = new apigateway.ApiKey(this, 'ApiKey');
        const usagePlan = new apigateway.UsagePlan(this, 'UsagePlan', {
            name: 'Usage Plan',
            apiStages: [
            {
                api: this.api,
                stage: this.api.deploymentStage,
            },
            ],
        });

        usagePlan.addApiKey(apiKey);
    }
}
