import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { OrderRepository } from "./OrderRepository";

export class Order {
    constructor(
        private orderRepository: OrderRepository,
    ) {}

    public async run(payload: APIGatewayProxyEvent, context: Context): Promise<unknown> {
        console.log(payload);
        console.log(context);
        const response = await this.orderRepository.sayHelloWorld();
        console.log("RESPONSE= ", response);
        return response;
    }
}
