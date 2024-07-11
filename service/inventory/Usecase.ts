import { Context, SQSEvent } from "aws-lambda";
import { InventoryRepository } from "./InventoryRepository";

export class Inventory {
    constructor(
        private inventoryRepository: InventoryRepository,
    ) {}

    public async run(payload: SQSEvent, context: Context): Promise<unknown> {
        console.log(payload);
        console.log(context);
        return this.inventoryRepository.sayHelloWorld(payload);
    }
}
