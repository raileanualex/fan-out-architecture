import { APIGatewayResponse, ok } from "@enter-at/lambda-handlers";
import { SQSEvent, Context } from "aws-lambda";
import { Shipment } from "./Usecase";

export class ShipmentAdapter {
    constructor(private usecase: Shipment) {
        this.usecase = usecase;
    }

    async handleEvent(event: SQSEvent, context: Context): Promise<void> {
        await this.usecase.run(event, context)
    }
}
