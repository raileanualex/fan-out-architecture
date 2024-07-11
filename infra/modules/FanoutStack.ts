import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
};

export class FanoutStack extends cdk.Stack {
    orderTopic: sns.Topic;
    inventoryQueue: sqs.IQueue;
    paymentQueue: sqs.IQueue;
    shipmentQueue: sqs.IQueue;

    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        
        super(scope, `${props.label.id}-fanout-stack`, props);

        // Create an SNS topic
        this.orderTopic = new sns.Topic(this, `${props.label.id}-OrderTopic`, {
            displayName: 'Order Processing Topic',
        });
    
        // Create SQS queues for different processes
        this.inventoryQueue = new sqs.Queue(this, `${props.label.id}-InventoryQueue`);
        this.paymentQueue = new sqs.Queue(this, `${props.label.id}-PaymentQueue`);
        this.shipmentQueue = new sqs.Queue(this, `${props.label.id}-ShipmentQueue`);
    
        // Subscribe the SQS queues to the SNS topic
        this.orderTopic.addSubscription(new subscriptions.SqsSubscription(this.inventoryQueue));
        this.orderTopic.addSubscription(new subscriptions.SqsSubscription(this.paymentQueue));
        this.orderTopic.addSubscription(new subscriptions.SqsSubscription(this.shipmentQueue));
    }
}
