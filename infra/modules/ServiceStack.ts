import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { FunctionsStack } from './FunctionsStack';
import { RestAPIStack } from './RestAPIStack';
import { CloudfrontStack } from './CloudfrontStack';
import { FanoutStack } from './FanoutStack';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
};

export class ServiceStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const fanoutStack = new FanoutStack(this, id, props);
        
        const functionsStack = new FunctionsStack(this, id, {
            ...props,
            topic: fanoutStack.orderTopic,
            paymentQueue: fanoutStack.paymentQueue,
            inventoryQueue: fanoutStack.inventoryQueue,
            shipmentQueue: fanoutStack.shipmentQueue
        });
        
        const restApiStack = new RestAPIStack(this, id, {
            ...props,
            orderLambda: functionsStack.orderLambda
        });
        
        new CloudfrontStack(this, id, {
            ...props,
            api:restApiStack .api
        });
    }
}
