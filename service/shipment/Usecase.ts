import { Context, SQSEvent } from "aws-lambda";
import { ShipmentRepository } from "./ShipmentRepository";

export class Shipment {
    constructor(
        private shipmentRepository: ShipmentRepository,
    ) {}

    public async run(payload: SQSEvent, context: Context): Promise<unknown> {
        console.log(payload);
        console.log(context);
        return this.shipmentRepository.sayHelloWorld(payload);
    }
}
