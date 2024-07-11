import { SQSEvent } from 'aws-lambda';

export interface Repository {
    sayHelloWorld(event: SQSEvent): string;
}

export class PaymentRepository implements Repository {
    sayHelloWorld(event: SQSEvent): string {
        return JSON.stringify(event);
    }
}
