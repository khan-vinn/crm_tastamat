import { ITransferStatus } from "../../Types/IProduct";

export interface TastamatAPiRepositoryInterface {
    cancelOrderCell(orderId: string): Promise<any>;
    bookCell(cellId: string, status: string): Promise<any>;
    checkCellStatus(cellId: string): Promise<any>;
}
