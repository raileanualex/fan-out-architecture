import { SQSEvent } from 'aws-lambda';

export interface Repository {
    sayHelloWorld(event: SQSEvent): string;
}

export class InventoryRepository implements Repository {
    sayHelloWorld(event): string {
        return JSON.stringify(event);
    }
}
