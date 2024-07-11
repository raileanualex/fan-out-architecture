import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { Order } from "./Usecase";
import { OrderAdapter } from "./Adapter";
import { OrderRepository } from "./OrderRepository";

async function initialize(): Promise<OrderAdapter> {
    const orderRepository = new OrderRepository();
    const usecase = new Order(
        orderRepository
    );
    return new OrderAdapter(usecase);
}

let adapter: OrderAdapter;

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    if (!adapter) {
        adapter = await initialize();
    }

    return adapter.handleEvent(event, context);
}

