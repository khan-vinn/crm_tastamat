import { CellType } from "../../Enums/cellType";
import { ITransferStatus } from "../../Types/IProduct";

export interface TastamatAPiRepositoryInterface {
    unbookCell(orderId: string): Promise<any>;
    bookCell(identifier: string, size: CellType): Promise<any>;
    checkCellStatus(cellId: string): Promise<any>;
}
