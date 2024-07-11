import { SQSEvent, Context } from "aws-lambda";
import { Payment } from "./Usecase";

export class PaymentAdapter {
    constructor(private usecase: Payment) {
        this.usecase = usecase;
    }

    async handleEvent(event: SQSEvent, context: Context): Promise<void> {
        await this.usecase.run(event, context)
    }
}
