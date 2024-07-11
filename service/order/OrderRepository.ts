import * as sns from "@aws-sdk/client-sns";

export interface Repository {
    sayHelloWorld(): Promise<unknown>;
}

export class OrderRepository implements Repository {
    snsClient: sns.SNSClient;

    constructor() {
        this.snsClient = new sns.SNSClient({ region: 'eu-central-1' });
    }

    async sayHelloWorld(): Promise<unknown> {
        const text = "Hello World";
        const orderDetails = JSON.parse(text);

        const params = {
            Message: JSON.stringify(orderDetails),
            TopicArn: process.env.ORDER_TOPIC_ARN,
        };

        return this.snsClient.send(new sns.PublishCommand(params));
    }
}
