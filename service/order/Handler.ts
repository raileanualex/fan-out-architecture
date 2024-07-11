import { SQSEvent, Context } from "aws-lambda";
import { Order } from "./Usecase";
import { OrderAdapter } from "./Adapter";
import { OrderRepository } from "./OrderRepository";

async function initialize(): Promise<OrderAdapter> {
    console.log("LOG=INITIALIZE LAMBDA1");
    const orderRepository = new OrderRepository();
    console.log("LOG=INITIALIZE LAMBDA4");
    const usecase = new Order(
        orderRepository
    );
    console.log("LOG=INITIALIZE LAMBDA2");
    return new OrderAdapter(usecase);
}

let adapter: OrderAdapter;

export async function handler(event: SQSEvent, context: Context): Promise<void> {
    console.log("LOG=INITIALIZE LAMBDA0");

    if (!adapter) {
        adapter = await initialize();
    }
    console.log("LOG=INITIALIZE LAMBDA3");

    adapter.handleEvent(event, context);
}

