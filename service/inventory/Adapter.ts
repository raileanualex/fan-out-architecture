import { SQSEvent, Context } from "aws-lambda";
import { Inventory } from "./Usecase";

export class InventoryAdapter {
    constructor(private usecase: Inventory) {
        this.usecase = usecase;
    }

    async handleEvent(event: SQSEvent, context: Context): Promise<void> {
        await this.usecase.run(event, context);
    }
}
