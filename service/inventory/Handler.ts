import { SQSEvent, Context } from "aws-lambda";
import { Inventory } from "./Usecase";
import { InventoryAdapter } from "./Adapter";
import { InventoryRepository } from "./InventoryRepository";

async function initialize(): Promise<InventoryAdapter> {
    const inventoryRepository = new InventoryRepository();
    const usecase = new Inventory(
        inventoryRepository
    );

    return new InventoryAdapter(usecase);
}

let adapter: InventoryAdapter;

export async function handler(event: SQSEvent, context: Context): Promise<void> {
    if (!adapter) {
        adapter = await initialize();
    }
    adapter.handleEvent(event, context);
}

