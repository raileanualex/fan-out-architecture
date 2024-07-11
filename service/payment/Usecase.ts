import { Context, SQSEvent } from "aws-lambda";
import { PaymentRepository } from "./PaymentRepository";

export class Payment {
    constructor(
        private paymentRepository: PaymentRepository,
    ) {}

    public async run(payload: SQSEvent, context: Context): Promise<unknown> {
        console.log(payload);
        console.log(context);
        return this.paymentRepository.sayHelloWorld(payload);
    }
}
