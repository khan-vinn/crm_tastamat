import { CellType, OrderStatus, ReserveStatus, TypeOfCellChange } from '../Enums/cellType';

export interface IProduct {
    trackNumber: string;
    fullName: string;
    mobilePhone: string;
    address: string;
    parcerValue: number;
    lockIndex: string;
}

export interface ITransferStatus {
    date: number;
    identifier: number;
    status: OrderStatus;
}

export interface ITransferStatusResponse extends Omit<ITransferStatus, "date"> {
    result: string;
}

export interface IBookCellRequest extends Omit<ITransferStatus, "date" | "status"> {
    size: CellType;
    method: TypeOfCellChange;
}

export interface IBookCellResponse {
    dropcode: string;
    pickcode: string;
    status: ReserveStatus;
    active: boolean;
}

export interface IUnbookCellResponse extends Omit<IBookCellResponse, "dropcode" | "pickcode"> {
}
