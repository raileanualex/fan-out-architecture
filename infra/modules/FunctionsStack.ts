import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as logs from 'aws-cdk-lib/aws-logs';

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
        super(scope, `${props.label.id}-functions-stack`, props);

        const logRetention = logs.RetentionDays.ONE_WEEK;

        // Create Order Lambda function
        this.orderLambda = new nodeLambda.NodejsFunction(this, `${props.label.id}-order-lambda`, {
            entry: './service/order/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
            environment: {
                ORDER_TOPIC_ARN: props.topic.topicArn,
              },
            logRetention,
            memorySize: 1024, // Adjust memory size (in MB)
            timeout: cdk.Duration.seconds(30), // Adjust timeout (in seconds)
        });
        props.topic.grantPublish(this.orderLambda);

        // Create Payment Lambda function
        const paymentLambda = new nodeLambda.NodejsFunction(this, `${props.label.id}-payment-lambda`, {
            entry: './service/payment/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
            logRetention,
        });
        paymentLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.paymentQueue));

        // Create Inventory Lambda function
        const inventoryLambda = new nodeLambda.NodejsFunction(this, `${props.label.id}-inventory-lambda`, {
            entry: './service/inventory/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
            logRetention,
        });
        inventoryLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.inventoryQueue));

        // Create Shipment Lambda function
        const shipmentLambda = new nodeLambda.NodejsFunction(this, `${props.label.id}-shipment-lambda`, {
            entry: './service/shipment/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
            logRetention,
        });
        shipmentLambda.addEventSource(new lambdaEventSources.SqsEventSource(props.shipmentQueue));

    }
}
