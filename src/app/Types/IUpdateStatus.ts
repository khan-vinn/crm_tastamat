export interface IUpdateStatus{
    identifier: string;
    customFields: any
} 

interface IResponseFromTastamatAfterBooking{
    dropCode: string;
    pickCode: string;
    status: string;
    active: boolean;
}

