import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    api: apigateway.LambdaRestApi;
};

export class CloudfrontStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        // Create an SNS topic
        const orderTopic = new sns.Topic(this, 'OrderTopic', {
            displayName: 'Order Processing Topic',
        });
    
        // Create SQS queues for different processes
        const inventoryQueue = new sqs.Queue(this, `${id}-InventoryQueue`);
        const paymentQueue = new sqs.Queue(this, `${id}-PaymentQueue`);
        const shipmentQueue = new sqs.Queue(this, `${id}-ShipmentQueue`);
    
        // Subscribe the SQS queues to the SNS topic
        orderTopic.addSubscription(new subscriptions.SqsSubscription(inventoryQueue));
        orderTopic.addSubscription(new subscriptions.SqsSubscription(paymentQueue));
        orderTopic.addSubscription(new subscriptions.SqsSubscription(shipmentQueue));
    }
}
