import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    orderLambda: lambda.Function;
};

export class RestAPIStack extends cdk.Stack {
    api: apigateway.LambdaRestApi;

    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${props.label.id}-rest-api-stack`, props);

        // Create API Gateway
        this.api = new apigateway.LambdaRestApi(this, `${props.label.id}-api-gw`, {
            handler: props.orderLambda,
            proxy: false,
            restApiName: 'OrderService',
            description: 'This service serves an order API.',
            apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
        });

        // Define API Gateway resources and methods
        const orderResource = this.api.root.addResource('order');
        orderResource.addMethod('POST', new apigateway.LambdaIntegration(props.orderLambda), {
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
