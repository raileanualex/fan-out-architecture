import { SQSEvent, Context } from "aws-lambda";
import { Shipment } from "./Usecase";
import { ShipmentAdapter } from "./Adapter";
import { ShipmentRepository } from "./ShipmentRepository";

async function initialize(): Promise<ShipmentAdapter> {
    const shipmentRepository = new ShipmentRepository();
    const usecase = new Shipment(
        shipmentRepository
    );

    return new ShipmentAdapter(usecase);
}

let adapter: ShipmentAdapter;

export async function handler(event: SQSEvent, context: Context): Promise<void> {
    if (!adapter) {
        adapter = await initialize();
    }
    adapter.handleEvent(event, context);
}

