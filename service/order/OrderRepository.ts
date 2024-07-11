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
        try {
            const text = "Hello World"
            const orderDetails = {
                test: text,
            }

            const params = {
                Message: JSON.stringify(orderDetails),
                TopicArn: process.env.ORDER_TOPIC_ARN,
            };

            return await this.snsClient.send(new sns.PublishCommand(params));
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}
