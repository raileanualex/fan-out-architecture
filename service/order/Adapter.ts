import { APIGatewayResponse, ok } from "@enter-at/lambda-handlers";
import { SQSEvent, Context } from "aws-lambda";
import { Order } from "./Usecase";

export class OrderAdapter {
    constructor(private usecase: Order) {
        this.usecase = usecase;
    }

    async handleEvent(event: SQSEvent, context: Context): Promise<APIGatewayResponse> {
        return ok(await this.usecase.run(event, context));
    }
}
