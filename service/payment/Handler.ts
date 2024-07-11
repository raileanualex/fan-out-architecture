import { SQSEvent, Context } from "aws-lambda";
import { Payment } from "./Usecase";
import { PaymentAdapter } from "./Adapter";
import { PaymentRepository } from "./PaymentRepository";

async function initialize(): Promise<PaymentAdapter> {
    const paymentRepository = new PaymentRepository();
    const usecase = new Payment(
        paymentRepository
    );

    return new PaymentAdapter(usecase);
}

let adapter: PaymentAdapter;

export async function handler(event: SQSEvent, context: Context): Promise<void> {
    if (!adapter) {
        adapter = await initialize();
    }
    adapter.handleEvent(event, context);
}

