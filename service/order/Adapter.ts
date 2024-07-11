import { APIGatewayResponse, internalServerError, ok } from "@enter-at/lambda-handlers";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Order } from "./Usecase";

export class OrderAdapter {
    constructor(private usecase: Order) {
        this.usecase = usecase;
    }

    async handleEvent(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayResponse> {
        return ok(await this.usecase.run(event, context));
    }
}
