import * as sns from "@aws-sdk/client-sns";
import { internalServerError } from "@enter-at/lambda-handlers";

export interface Repository {
    sayHelloWorld(): Promise<unknown>;
}

export class OrderRepository implements Repository {
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

            console.log("LOG=before publish", params);

            const topicArn = process.env.ORDER_TOPIC_ARN;
            if (!topicArn) {
                throw new Error("ORDER_TOPIC_ARN environment variable is not set");
            }

            const snsClient = new sns.SNSClient({ region: 'eu-central-1' });

            const response = await snsClient.send(new sns.PublishCommand(params));
            console.log("LOG=after publish", JSON.stringify(response));

            return {
                statusCode: "Successful",

            }
        } catch(error) {
            console.log("ERROR=", error);
            throw internalServerError();
        }
    }
}
