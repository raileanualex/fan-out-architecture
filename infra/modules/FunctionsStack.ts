import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    topic: sns.Topic;
    paymentQueue: sqs.IQueue;
    inventoryQueue: sqs.IQueue; 
    shipmentQueue: sqs.IQueue; 
};

export class FunctionsStack extends cdk.Stack {
    orderLambda: lambda.Function;
    
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${id}-functions-stack`, props);

        // Create Order Lambda function
        this.orderLambda = new nodeLambda.NodejsFunction(this, `${id}-order-lambda`, {
            entry: './service/order/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
            environment: {
                ORDER_TOPIC_ARN: props.topic.topicArn,
              },
        });
        props.topic.grantPublish(this.orderLambda);

        // Create Payment Lambda function
        const paymentLambda = new nodeLambda.NodejsFunction(this, `${id}-payment-lambda`, {
            entry: './service/payment/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
        });
        paymentLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.paymentQueue));

        // Create Inventory Lambda function
        const inventoryLambda = new nodeLambda.NodejsFunction(this, `${id}-inventory-lambda`, {
            entry: './service/inventory/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
        });
        inventoryLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.inventoryQueue));

        // Create Shipment Lambda function
        const shipmentLambda = new nodeLambda.NodejsFunction(this, `${id}-shipment-lambda`, {
            entry: './service/shipment/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
        });
        shipmentLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.shipmentQueue));

    }
}
