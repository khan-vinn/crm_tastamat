export enum CellType {
    "S" = "S",
    "M" = "M",
    "L" = "L",
}
export enum ResultStatus {
    "SUCCESS",
    "ERROR",
}

export enum TypeOfCellChange {
    "book" = "book",
    "unbook" = "unbook",
}

export enum ReserveStatus {
    "RESERVED",
    "UNRESERVED",
}

export enum OrderStatus {
    "REQUEST_RESERVING",
    "RESERVED",
    "REQUEST_UNRESERVING",
    "UNRESERVED",
    "UNBOOKED",
    "WITHDRAWN",
    "SENT",
    "DROPPED",
}
