import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { OrderRepository } from "./OrderRepository";

export class Order {
    constructor(
        private orderRepository: OrderRepository,
    ) {}

    public async run(payload: APIGatewayProxyEvent, context: Context): Promise<unknown> {
        return this.orderRepository.sayHelloWorld();
    }
}
